import React, { useEffect, useState } from 'react';
import { X, PackageCheck, Calendar, MapPin, RefreshCw, ShoppingBag, DollarSign } from 'lucide-react';

export default function OrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} id="orders-modal-backdrop">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
        id="orders-modal-container"
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PackageCheck size={20} color="#00f2fe" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
              Order History & Tracking
            </h3>
            <span className="badge badge-cyan">{orders.length} orders</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              id="refresh-orders-btn"
              className="btn-icon"
              onClick={fetchOrders}
              title="Refresh Orders"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              id="close-orders-modal-btn"
              className="btn-icon"
              onClick={onClose}
              title="Close Orders"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Loading order records from MongoDB...
            </div>
          ) : orders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '50px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <ShoppingBag size={36} color="#64748b" />
              <h4 style={{ fontSize: '1.1rem', color: '#f8fafc' }}>No orders placed yet</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Add items to your bag and complete checkout to see your live MongoDB orders recorded here!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} id="orders-list">
              {orders.map((order) => (
                <div
                  key={order.id}
                  id={`order-card-${order.orderNumber}`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '18px',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {/* Top order meta */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '800', color: '#00f2fe', fontSize: '1rem' }}>
                          {order.orderNumber}
                        </span>
                        <span className="badge badge-emerald">
                          {order.paymentStatus || 'Paid'}
                        </span>
                        <span className="badge badge-cyan">
                          {order.orderStatus || 'Processing'}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginTop: '4px',
                        }}
                      >
                        <Calendar size={12} />
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                        Total Billed
                      </span>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                        ${order.total?.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Customer & Destination */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 0',
                      fontSize: '0.82rem',
                      color: '#94a3b8',
                    }}
                  >
                    <MapPin size={14} color="#f59e0b" />
                    <span>
                      Recipient: <strong style={{ color: '#f8fafc' }}>{order.customer?.fullName}</strong> — {order.customer?.address}, {order.customer?.city} ({order.customer?.postalCode})
                    </span>
                  </div>

                  {/* Purchased Items list */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      paddingTop: '10px',
                    }}
                  >
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <div style={{ fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: '600', color: '#f8fafc' }}>
                            {item.title}
                          </span>
                          <span style={{ color: '#94a3b8', marginLeft: '6px' }}>
                            × {item.quantity} (${item.price?.toFixed(2)})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
