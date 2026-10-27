import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Lock, ShieldCheck, ArrowRight, Truck, Package } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  promoCode,
  onOrderSuccess,
  onShowToast,
}) {
  const [customer, setCustomer] = useState({
    fullName: 'Alexander Vance',
    email: 'alexander.vance@lumina-tech.com',
    address: '742 Evergreen Terrace, Suite 400',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('Instant Card (Simulated)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let discountAmount = 0;
  if (promoCode === 'LUMINA20') discountAmount = subtotal * 0.20;
  if (promoCode === 'WELCOME10') discountAmount = subtotal * 0.10;

  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15.00;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.085;
  const finalTotal = taxableAmount + shipping + tax;

  const handleInputChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customer.fullName || !customer.email || !customer.address || !customer.city || !customer.postalCode) {
      onShowToast('Please fill out all required shipping details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customer,
          promoCode,
          paymentMethod,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCompletedOrder(data.order);
        onOrderSuccess(data.order);
        onShowToast(`Order placed successfully! (${data.order.orderNumber}) 🎉`);
      } else {
        onShowToast(`Order error: ${data.message || 'Could not place order'}`);
      }
    } catch (err) {
      console.error('Order submission error:', err);
      onShowToast('Network error while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} id="checkout-modal-backdrop">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: completedOrder ? '580px' : '720px' }}
        id="checkout-modal-container"
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lock size={18} color="#00f2fe" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
              {completedOrder ? 'Order Confirmed' : 'Encrypted Express Checkout'}
            </h3>
          </div>
          <button
            id="close-checkout-modal-btn"
            className="btn-icon"
            onClick={onClose}
            title="Close Checkout"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {completedOrder ? (
            /* Order Success View */
            <div
              style={{
                textAlign: 'center',
                padding: '20px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
              id="order-success-screen"
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid rgba(16, 185, 129, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
                }}
              >
                <CheckCircle2 size={40} />
              </div>

              <h2 style={{ fontSize: '1.8rem', color: '#f8fafc' }}>
                Thank You for Your Order!
              </h2>

              <p style={{ fontSize: '0.92rem', color: '#94a3b8', maxWidth: '420px' }}>
                We have received your order and our laboratory technicians have initiated bespoke inspection and priority packaging.
              </p>

              {/* Order ID Box */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  width: '100%',
                  textAlign: 'left',
                  marginTop: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order Number</span>
                  <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#00f2fe' }}>
                    {completedOrder.orderNumber}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Recipient</span>
                  <span style={{ fontSize: '0.88rem', color: '#f8fafc' }}>
                    {completedOrder.customer?.fullName}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Delivery Destination</span>
                  <span style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                    {completedOrder.customer?.address}, {completedOrder.customer?.city}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: '700' }}>Amount Paid</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#34d399' }}>
                    ${completedOrder.total?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '14px', width: '100%' }}>
                <button
                  id="order-success-close-btn"
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px' }}
                  onClick={onClose}
                >
                  <span>Continue Exploring</span>
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handlePlaceOrder}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 0.9fr',
                  gap: '28px',
                }}
              >
                {/* Left: Shipping & Payment details */}
                <div>
                  <h4 style={{ fontSize: '0.92rem', textTransform: 'uppercase', color: '#38bdf8', marginBottom: '14px', letterSpacing: '0.05em' }}>
                    1. Shipping Information
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Full Name *
                      </label>
                      <input
                        id="checkout-name-input"
                        type="text"
                        required
                        className="search-input"
                        style={{ padding: '8px 14px' }}
                        value={customer.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Email Address *
                      </label>
                      <input
                        id="checkout-email-input"
                        type="email"
                        required
                        className="search-input"
                        style={{ padding: '8px 14px' }}
                        value={customer.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Street Address *
                      </label>
                      <input
                        id="checkout-address-input"
                        type="text"
                        required
                        className="search-input"
                        style={{ padding: '8px 14px' }}
                        value={customer.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          City *
                        </label>
                        <input
                          id="checkout-city-input"
                          type="text"
                          required
                          className="search-input"
                          style={{ padding: '8px 14px' }}
                          value={customer.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          Postal Code *
                        </label>
                        <input
                          id="checkout-postal-input"
                          type="text"
                          required
                          className="search-input"
                          style={{ padding: '8px 14px' }}
                          value={customer.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '0.92rem', textTransform: 'uppercase', color: '#38bdf8', margin: '22px 0 12px', letterSpacing: '0.05em' }}>
                    2. Payment Method
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['Instant Card (Simulated)', 'Apple Pay / Google Pay', 'Zero-Gas Crypto (USDC)'].map((method) => (
                      <label
                        key={method}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: paymentMethod === method ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255,255,255,0.03)',
                          border: paymentMethod === method ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: '#f8fafc',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                        />
                        <CreditCard size={15} color="#00f2fe" />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Right: Order Summary */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '14px', color: '#f8fafc' }}>
                      Order Summary ({cartItems.length} items)
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', marginBottom: '16px' }}>
                      {cartItems.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={item.image} alt={item.title} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-summary-table">
                      <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="summary-row" style={{ color: '#34d399' }}>
                          <span>Discount ({promoCode})</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="summary-row">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="summary-row total-row">
                        <span>Total Due</span>
                        <span style={{ color: '#00f2fe' }}>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '12px' }}>
                      <ShieldCheck size={14} color="#10b981" />
                      <span>256-Bit SSL Encrypted & Verified</span>
                    </div>

                    <button
                      id="submit-order-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary"
                      style={{ width: '100%', padding: '14px' }}
                    >
                      {isSubmitting ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <span>Authorize & Place Order</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
