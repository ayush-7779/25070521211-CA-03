import React, { useState } from 'react';
import { X, Plus, Sparkles, Image, Check } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, onProductCreated, onShowToast }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Audio',
    price: '',
    originalPrice: '',
    stockCount: '15',
    image: '/images/products/apex-headphones.jpg',
    tag: 'New Arrival',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleImages = [
    { label: 'Apex ANC Headphones', url: '/images/products/apex-headphones.jpg' },
    { label: 'Chronos Titan Watch', url: '/images/products/chronos-watch.jpg' },
    { label: 'Blade 14 OLED Laptop', url: '/images/products/blade-laptop.jpg' },
    { label: 'Sound Orb 360 Sphere', url: '/images/products/sound-orb.jpg' },
    { label: 'Aura AR Smart Glasses', url: '/images/products/vision-glasses.jpg' },
    { label: 'Orbit MagFast Dock', url: '/images/products/charging-dock.jpg' },
  ];

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      onShowToast('Please fill in required fields (Title, Category, Price).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onProductCreated(data.product);
        onShowToast(`Product "${data.product.title}" created in MongoDB! ✨`);
        onClose();
      } else {
        onShowToast(`Error: ${data.message || 'Could not save product'}`);
      }
    } catch (err) {
      console.error('Error creating product:', err);
      onShowToast('Network error while saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} id="add-product-modal-backdrop">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
        id="add-product-modal-container"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#00f2fe" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Add Product to Catalog</h3>
          </div>
          <button id="close-add-product-modal-btn" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Product Title *
              </label>
              <input
                id="new-product-title"
                type="text"
                required
                placeholder="e.g. Lumina Pulse Studio Monitors"
                className="search-input"
                style={{ padding: '8px 14px' }}
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Category *
                </label>
                <select
                  id="new-product-category"
                  className="search-input"
                  style={{ padding: '8px 14px', background: '#121622' }}
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Computing">Computing</option>
                  <option value="Smart Home">Smart Home</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Badge Tag
                </label>
                <input
                  id="new-product-tag"
                  type="text"
                  placeholder="e.g. Flagship, New, Limited"
                  className="search-input"
                  style={{ padding: '8px 14px' }}
                  value={formData.tag}
                  onChange={(e) => handleChange('tag', e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Price ($) *
                </label>
                <input
                  id="new-product-price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="299.99"
                  className="search-input"
                  style={{ padding: '8px 14px' }}
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Original Price ($)
                </label>
                <input
                  id="new-product-original-price"
                  type="number"
                  step="0.01"
                  placeholder="349.99"
                  className="search-input"
                  style={{ padding: '8px 14px' }}
                  value={formData.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Stock Count
                </label>
                <input
                  id="new-product-stock"
                  type="number"
                  className="search-input"
                  style={{ padding: '8px 14px' }}
                  value={formData.stockCount}
                  onChange={(e) => handleChange('stockCount', e.target.value)}
                />
              </div>
            </div>

            {/* Select Image */}
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Select Product Photography or Custom URL
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '10px' }}>
                {sampleImages.map((img) => (
                  <div
                    key={img.url}
                    onClick={() => handleChange('image', img.url)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      aspectRatio: '1 / 1',
                      border: formData.image === img.url ? '2px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)',
                      position: 'relative',
                    }}
                    title={img.label}
                  >
                    <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {formData.image === img.url && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: '#00f2fe',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={11} color="#04101e" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <input
                id="new-product-image-url"
                type="text"
                placeholder="Or paste custom image URL..."
                className="search-input"
                style={{ padding: '8px 14px' }}
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                id="new-product-description"
                rows="3"
                placeholder="Describe materials, engineering highlights, and acoustic/performance specs..."
                className="search-input"
                style={{ padding: '8px 14px', borderRadius: '10px', resize: 'vertical' }}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                id="save-new-product-btn"
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                <Plus size={16} />
                <span>{isSubmitting ? 'Saving to Database...' : 'Create Product'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
