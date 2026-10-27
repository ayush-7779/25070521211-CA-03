import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles, Volume2, BatteryCharging, Award } from 'lucide-react';

export default function Hero({ featuredProduct, onAddToCart, onExploreClick }) {
  if (!featuredProduct) return null;

  return (
    <section className="hero-section" id="hero-showcase">
      <div className="hero-banner">
        {/* Left Column: Information & Actions */}
        <div className="hero-content">
          <div className="hero-tag">
            <span className="badge badge-cyan">
              <Sparkles size={12} />
              Flagship Innovation 2026
            </span>
          </div>

          <h2 className="hero-title">
            Sound Reimagined in <span className="gradient-text-cyan">Pure Titanium.</span>
          </h2>

          <p className="hero-description">
            Experience the new Lumina Apex ANC. 40mm beryllium acoustic architecture, lossless high-resolution wireless transmission, and adaptive head-tracking spatial audio engineered for purists.
          </p>

          <div className="hero-features-chips">
            <div className="feature-chip">
              <Volume2 size={14} color="#00f2fe" />
              <span>Spatial 360° Audio</span>
            </div>
            <div className="feature-chip">
              <BatteryCharging size={14} color="#00f2fe" />
              <span>45-Hour Ultra Endurance</span>
            </div>
            <div className="feature-chip">
              <Award size={14} color="#00f2fe" />
              <span>Beryllium Drivers</span>
            </div>
          </div>

          <div className="hero-actions">
            <div className="hero-price-tag">
              <span className="hero-price-label">Exclusive Launch</span>
              <span className="hero-price-amount">${featuredProduct.price.toFixed(2)}</span>
            </div>

            <button
              id="hero-add-to-cart-btn"
              className="btn-primary"
              onClick={() => onAddToCart(featuredProduct)}
            >
              <span>Add to Bag</span>
              <ArrowRight size={17} />
            </button>

            <button
              id="hero-explore-btn"
              className="btn-secondary"
              onClick={onExploreClick}
            >
              <span>Explore Collection</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Showcase Image */}
        <div className="hero-image-container">
          <img
            src={featuredProduct.image}
            alt={featuredProduct.title}
            className="hero-img"
            id="hero-product-image"
          />

          <div className="hero-floating-badge">
            <ShieldCheck size={20} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc' }}>
                Studio Verified
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Lossless 24-bit Hi-Res
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Bar */}
      <div className="trust-bar">
        <div className="trust-item">
          <div className="trust-icon">
            <Truck size={20} />
          </div>
          <div>
            <h4>Complimentary Express Shipping</h4>
            <p>Fast worldwide delivery on all orders over $200</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon">
            <RotateCcw size={20} />
          </div>
          <div>
            <h4>30-Day Risk-Free Audition</h4>
            <p>Experience in your sanctuary or return with zero hassle</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4>2-Year Full Hardware Coverage</h4>
            <p>Comprehensive protection and direct concierge support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
