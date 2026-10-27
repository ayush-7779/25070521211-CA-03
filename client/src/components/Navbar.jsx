import React from 'react';
import { ShoppingBag, Search, Sparkles, Database, PlusCircle, PackageCheck, X, LogOut, User } from 'lucide-react';

export default function Navbar({
  cartCount,
  cartTotal,
  onOpenCart,
  searchQuery,
  onSearchChange,
  dbStatus,
  onOpenOrders,
  ordersCount,
  onOpenAddProduct,
  onLogoClick,
  currentUser,
  onLogout,
}) {
  return (
    <header className="navbar" id="main-navbar">
      {/* Brand Logo */}
      <div className="brand-container" id="brand-logo-btn" onClick={onLogoClick}>
        <div className="brand-logo-icon">
          <Sparkles size={20} />
        </div>
        <div className="brand-text">
          <h1>Lumina</h1>
          <span>Luxury Tech</span>
        </div>
      </div>

      {/* Real-time Search Input */}
      <div className="search-wrapper">
        <Search size={16} className="search-icon-left" />
        <input
          id="product-search-input"
          type="text"
          className="search-input"
          placeholder="Search headphones, titanium watches, OLED laptops..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            id="clear-search-btn"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav Actions */}
      <div className="nav-actions">
        {/* DB Connection Badge */}
        <div
          id="db-status-badge"
          className="db-status-pill"
          title={`Backend: ${dbStatus?.dbMode || 'Checking connection...'}`}
        >
          <span className="db-indicator-dot"></span>
          <Database size={13} />
          <span>{dbStatus?.isMongoConnected ? 'MongoDB Live' : 'Database Ready'}</span>
        </div>

        {/* Add Product (Admin Action) */}
        <button
          id="nav-add-product-btn"
          className="btn-secondary"
          onClick={onOpenAddProduct}
          title="Add New Product to Catalog"
        >
          <PlusCircle size={16} />
          <span style={{ fontSize: '0.84rem' }}>Add Product</span>
        </button>

        {/* Orders History Button */}
        <button
          id="nav-orders-btn"
          className="btn-secondary"
          onClick={onOpenOrders}
          title="View Past Orders"
        >
          <PackageCheck size={16} />
          <span style={{ fontSize: '0.84rem' }}>Orders ({ordersCount})</span>
        </button>

        {/* Cart Drawer Trigger */}
        <button
          id="nav-cart-btn"
          className="cart-btn"
          onClick={onOpenCart}
          title="Open Cart"
        >
          <ShoppingBag size={18} color="#00f2fe" />
          <span>Bag</span>
          <span id="nav-cart-count" className="cart-count-badge">
            {cartCount}
          </span>
          {cartCount > 0 && (
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '2px' }}>
              ${cartTotal.toFixed(0)}
            </span>
          )}
        </button>

        {/* User Info + Direct Logout */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(0,242,254,0.5)', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,242,254,0.15)', border: '2px solid rgba(0,242,254,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color="#00f2fe" />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#f8fafc', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{currentUser.email}</span>
              </div>
            </div>

            <button
              id="nav-logout-btn"
              onClick={onLogout}
              title="Click to Log Out Immediately"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '7px 12px',
                color: '#fca5a5',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                e.currentTarget.style.borderColor = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              }}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', marginLeft: '6px' }}>
            <button
              className="btn-secondary"
              onClick={onLogout}
              style={{ padding: '7px 14px', fontSize: '0.82rem' }}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
