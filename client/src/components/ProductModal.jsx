import React, { useState } from 'react';
import { X, Check, Star, ShoppingBag, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} id="product-detail-backdrop">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        id="product-detail-modal"
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-cyan">{product.category}</span>
            {product.tag && <span className="badge badge-gold">{product.tag}</span>}
          </div>
          <button
            id="close-product-modal-btn"
            className="btn-icon"
            onClick={onClose}
            title="Close Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1fr) 1.2fr',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* Image Preview */}
            <div style={{ position: 'relative' }}>
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                }}
              />
              <div
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#34d399',
                  fontSize: '0.8rem',
                }}
              >
                <ShieldCheck size={16} />
                <span>Verified Authentic Lumina Hardware</span>
              </div>
            </div>

            {/* Product Details & Actions */}
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', color: '#fbbf24' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />
                  ))}
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#f8fafc' }}>
                  {product.rating || '4.9'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  ({product.numReviews || 80} verified client reviews)
                </span>
              </div>

              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', lineHeight: '1.2' }}>
                {product.title}
              </h2>

              <p style={{ fontSize: '0.92rem', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.6' }}>
                {product.description}
              </p>

              {/* Key Features List */}
              {product.features && product.features.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38bdf8', marginBottom: '10px' }}>
                    Engineered Highlights
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {product.features.map((feat, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem',
                          color: '#e2e8f0',
                        }}
                      >
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'rgba(0, 242, 254, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#00f2fe',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={12} />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Specifications */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px' }}>
                  <h4 style={{ fontSize: '0.84rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>
                    Technical Specifications
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key}>
                        <span style={{ color: '#64748b' }}>{key}: </span>
                        <span style={{ color: '#cbd5e1', fontWeight: '500' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing & Add Section */}
              <div
                style={{
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Price per unit
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#00f2fe', fontFamily: 'var(--font-heading)' }}>
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="qty-stepper">
                    <button
                      id="modal-qty-decrease-btn"
                      className="qty-btn"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-count">{quantity}</span>
                    <button
                      id="modal-qty-increase-btn"
                      className="qty-btn"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    id="modal-add-to-cart-btn"
                    className="btn-primary"
                    onClick={handleAdd}
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
