import React from 'react';
import { Star, ShoppingBag, Eye, Zap } from 'lucide-react';

export default function ProductCard({ product, onSelect, onAddToCart }) {
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const isLowStock = product.stockCount > 0 && product.stockCount <= 8;

  return (
    <article className="product-card" id={`product-card-${product.id}`}>
      {/* Product Image Area */}
      <div
        className="product-image-wrap"
        onClick={() => onSelect(product)}
        title="Click to view full specifications"
      >
        <img
          src={product.image}
          alt={product.title}
          className="product-img"
          loading="lazy"
        />

        {/* Tag Badge */}
        {product.tag && (
          <div className="card-tag-badge">
            <span
              className={`badge ${
                product.tag === 'Best Seller'
                  ? 'badge-gold'
                  : product.tag === 'Flagship'
                  ? 'badge-cyan'
                  : 'badge-emerald'
              }`}
            >
              {product.tag}
            </span>
          </div>
        )}

        {/* Quick Actions Hover Overlay */}
        <div className="card-quick-actions">
          <button
            id={`quick-view-btn-${product.id}`}
            className="btn-icon"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            title="Quick Specs View"
          >
            <Eye size={17} />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="product-info">
        <div className="product-meta-row">
          <span className="product-category-text">{product.category}</span>
          <div className="rating-pill">
            <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
            <span>{product.rating?.toFixed(1) || '4.9'}</span>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
              ({product.numReviews || 40})
            </span>
          </div>
        </div>

        <h3
          className="product-title"
          onClick={() => onSelect(product)}
          id={`product-title-${product.id}`}
        >
          {product.title}
        </h3>

        <p className="product-subtitle">{product.subtitle || product.description}</p>

        {/* Stock warning if low stock */}
        {isLowStock && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
            <Zap size={12} color="#f59e0b" />
            <span style={{ fontSize: '0.74rem', color: '#f59e0b', fontWeight: '600' }}>
              Only {product.stockCount} left in stock
            </span>
          </div>
        )}

        {/* Pricing & Add to Cart Action */}
        <div className="product-pricing-row">
          <div className="price-container">
            <span className="current-price" id={`product-price-${product.id}`}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
            {discountPercent && (
              <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '700' }}>
                -{discountPercent}%
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            className="btn-add-cart"
            onClick={() => onAddToCart(product)}
            title="Add to Shopping Bag"
          >
            <ShoppingBag size={15} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
