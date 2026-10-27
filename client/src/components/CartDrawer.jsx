import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Tag, CheckCircle } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  promoCode,
  setPromoCode,
  appliedPromo,
  setAppliedPromo,
  onShowToast,
}) {
  const [promoInput, setPromoInput] = useState(promoCode || '');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Promo code discounts
  let discountAmount = 0;
  if (appliedPromo === 'LUMINA20') {
    discountAmount = subtotal * 0.20;
  } else if (appliedPromo === 'WELCOME10') {
    discountAmount = subtotal * 0.10;
  }

  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15.00;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.085;
  const finalTotal = taxableAmount + shipping + tax;

  const freeShippingThreshold = 200;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'LUMINA20') {
      setAppliedPromo('LUMINA20');
      setPromoCode('LUMINA20');
      onShowToast('Promo LUMINA20 applied! 20% discount unlocked ✨');
    } else if (clean === 'WELCOME10') {
      setAppliedPromo('WELCOME10');
      setPromoCode('WELCOME10');
      onShowToast('Promo WELCOME10 applied! 10% discount unlocked ✨');
    } else {
      onShowToast('Invalid promo code. Try LUMINA20 for 20% off.');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="cart-drawer-backdrop" onClick={onClose} id="cart-drawer-backdrop" />

      {/* Slide-over Drawer */}
      <aside className="cart-drawer" id="cart-drawer-panel">
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#00f2fe" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Your Bag</h3>
            <span className="badge badge-cyan">{cartItems.length} items</span>
          </div>
          <button
            id="close-cart-drawer-btn"
            className="btn-icon"
            onClick={onClose}
            title="Close Bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="free-shipping-progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            {subtotal >= freeShippingThreshold ? (
              <span style={{ color: '#34d399', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle size={14} /> You have unlocked Free Worldwide Express Shipping!
              </span>
            ) : (
              <span>
                Add <strong style={{ color: '#00f2fe' }}>${amountToFreeShipping.toFixed(2)}</strong> more for Free Shipping
              </span>
            )}
            <span style={{ color: '#94a3b8' }}>{Math.round(progressPercent)}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-list" id="cart-items-container">
          {cartItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                }}
              >
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: '#f8fafc' }}>Your bag is empty</h4>
              <p style={{ fontSize: '0.86rem', maxWidth: '260px' }}>
                Discover our curated devices and elevate your daily digital realm.
              </p>
              <button
                id="cart-empty-browse-btn"
                className="btn-primary"
                onClick={onClose}
                style={{ marginTop: '10px' }}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item-card" key={item.id} id={`cart-item-${item.id}`}>
                <img src={item.image} alt={item.title} className="cart-item-thumb" />

                <div className="cart-item-info">
                  <div>
                    <h4 className="cart-item-title">{item.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.category}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                    }}
                  >
                    <div className="qty-stepper">
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                        id={`cart-decrease-${item.id}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-count">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        id={`cart-increase-${item.id}`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#f8fafc' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        className="btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        onClick={() => onRemoveItem(item.id)}
                        id={`cart-remove-${item.id}`}
                        title="Remove item"
                      >
                        <Trash2 size={13} color="#f43f5e" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="promo-row">
              <input
                id="cart-promo-input"
                type="text"
                placeholder="PROMO CODE (LUMINA20)"
                className="promo-input"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button id="cart-apply-promo-btn" type="submit" className="btn-secondary">
                <Tag size={14} />
                <span>Apply</span>
              </button>
            </form>

            {/* Breakdown */}
            <div className="order-summary-table">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row" style={{ color: '#34d399' }}>
                  <span>Promo ({appliedPromo})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="summary-row">
                <span>Estimated Tax (8.5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-row total-row">
                <span>Total</span>
                <span style={{ color: '#00f2fe' }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="cart-checkout-btn"
              className="btn-primary"
              style={{ width: '100%', padding: '14px' }}
              onClick={onProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
