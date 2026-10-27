import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductFilter from './components/ProductFilter';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersModal from './components/OrdersModal';
import AddProductModal from './components/AddProductModal';
import Toast from './components/Toast';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import './App.css';

const CATEGORIES = ['All', 'Audio', 'Wearables', 'Computing', 'Smart Home', 'Accessories'];

export default function App() {
  // ─── Auth State ────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('lumina_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem('lumina_token') || null
  );

  // ─── Current View State ('landing' | 'store' | 'auth') ─────────────────────
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('lumina_user') ? 'store' : 'landing';
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'

  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    setCurrentView('store');
    showToast(`Welcome back, ${user.name}! 🚀`);
  };

  // Direct immediate logout
  const handleLogout = () => {
    localStorage.removeItem('lumina_token');
    localStorage.removeItem('lumina_user');
    setCurrentUser(null);
    setAuthToken(null);
    setCartItems([]);
    setCurrentView('landing');
    showToast('You have been logged out. 👋');
  };

  // Navigation handlers
  const handleOpenLogin = () => {
    setAuthMode('login');
    setCurrentView('auth');
  };

  const handleOpenSignup = () => {
    setAuthMode('signup');
    setCurrentView('auth');
  };

  const handleExploreStore = () => {
    setCurrentView('store');
  };

  // ─── Product & Filter State ────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // ─── Cart State (localStorage persisted) ──────────────────────────────────
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('lumina_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ─── Modals & Drawers ──────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // ─── Promo Code ───────────────────────────────────────────────────────────
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');

  // ─── Status & Stats ───────────────────────────────────────────────────────
  const [dbStatus, setDbStatus] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);

  // ─── Toast Notifications ──────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  const catalogRef = useRef(null);

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumina_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed saving cart:', e);
    }
  }, [cartItems]);

  // Fetch DB status
  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setDbStatus(data.database);
    } catch (err) {
      console.warn('Could not fetch DB status:', err);
    }
  };

  // Fetch orders count
  const fetchOrdersCount = async () => {
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const res = await fetch('/api/orders', { headers });
      const data = await res.json();
      if (data.success) setOrdersCount(data.orders?.length || 0);
    } catch (err) {
      console.warn('Could not fetch orders:', err);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  // Load products & status on mount
  useEffect(() => {
    fetchProducts();
    fetchDbStatus();
  }, []);

  // When user logs in, fetch their orders
  useEffect(() => {
    if (currentUser) {
      fetchOrdersCount();
    }
  }, [currentUser]);

  // ─── Filtered & Sorted Products ───────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.subtitle?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }
    if (inStockOnly) {
      list = list.filter((p) => p.stockCount > 0);
    }
    if (sortOption === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortOption === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortOption === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [products, selectedCategory, searchQuery, inStockOnly, sortOption]);

  const featuredProduct = useMemo(
    () => products.find((p) => p.title?.includes('Apex') || p.tag === 'Best Seller') || products[0],
    [products]
  );

  // ─── Cart Operations ──────────────────────────────────────────────────────
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: product.id, productId: product.id, title: product.title, price: product.price, image: product.image, category: product.category, quantity }];
    });
    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${product.title}" to bag 🛍️`);
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) { handleRemoveItem(itemId); return; }
    setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item)));
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from bag');
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    setOrdersCount((c) => c + 1);
    fetchProducts();
  };

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) catalogRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ─── 1. Landing Page View ──────────────────────────────────────────────────
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onExplore={handleExploreStore}
          onOpenLogin={handleOpenLogin}
          onOpenSignup={handleOpenSignup}
          featuredProducts={products}
        />
        <Toast toasts={toasts} />
      </>
    );
  }

  // ─── 2. Auth Page View (Login / Signup) ────────────────────────────────────
  if (currentView === 'auth') {
    return (
      <>
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setCurrentView('landing')}
          initialMode={authMode}
        />
        <Toast toasts={toasts} />
      </>
    );
  }

  // ─── 3. Full E-Commerce Store View ─────────────────────────────────────────
  return (
    <div className="app-container" id="lumina-app">
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dbStatus={dbStatus}
        onOpenOrders={() => setIsOrdersOpen(true)}
        ordersCount={ordersCount}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLogoClick={() => setCurrentView('landing')}
      />

      <main>
        <Hero
          featuredProduct={featuredProduct}
          onAddToCart={handleAddToCart}
          onExploreClick={scrollToCatalog}
          currentUser={currentUser}
        />

        <section className="catalog-section" ref={catalogRef} id="catalog-section">
          <ProductFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
            inStockOnly={inStockOnly}
            onToggleInStock={() => setInStockOnly((v) => !v)}
            productCount={filteredProducts.length}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                Loading Lumina Catalog...
              </div>
              <p style={{ fontSize: '0.86rem' }}>Fetching luxury hardware collection</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No matching innovations found</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '16px' }}>
                Try adjusting your search criteria or explore another category.
              </p>
              <button
                id="reset-filter-btn"
                className="btn-secondary"
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setInStockOnly(false); }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid" id="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '40px 28px', background: '#06080d', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: '700', fontSize: '1.1rem' }}>
            <span>LUMINA</span>
            <span style={{ color: '#00f2fe' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '400' }}>
              Full Stack E-Commerce Platform (React + Express + MongoDB)
            </span>
          </div>
          <p>Built with React, Vanilla CSS, Node.js/Express, and MongoDB with intelligent fallback storage.</p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentView('landing')}
              style={{ background: 'none', border: 'none', color: '#00f2fe', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Back to Landing Page
            </button>
            {currentUser && (
              <>
                <span>•</span>
                <span>Signed in as <strong style={{ color: '#00f2fe' }}>{currentUser.name}</strong></span>
                <span>•</span>
                <button
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Log Out Immediately
                </button>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem', color: '#94a3b8' }}>
            <span>Promo: <strong>LUMINA20</strong> (20% Off)</span>
            <span>•</span>
            <span>API: <code>/api/products</code> & <code>/api/orders</code></span>
          </div>
        </div>
      </footer>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQty={handleUpdateQty} onRemoveItem={handleRemoveItem} onProceedToCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} promoCode={promoCode} setPromoCode={setPromoCode} appliedPromo={appliedPromo} setAppliedPromo={setAppliedPromo} onShowToast={showToast} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cartItems={cartItems} promoCode={appliedPromo} onOrderSuccess={handleOrderSuccess} onShowToast={showToast} />
      <OrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
      <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} onProductCreated={handleProductCreated} onShowToast={showToast} />
      <Toast toasts={toasts} />
    </div>
  );
}
