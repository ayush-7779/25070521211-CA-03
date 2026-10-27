import React from 'react';
import { Sparkles, ShieldCheck, Truck, Headphones, ArrowRight, Star, ShoppingBag, LogIn, UserPlus } from 'lucide-react';

export default function LandingPage({ onExplore, onOpenLogin, onOpenSignup, featuredProducts = [] }) {
  return (
    <div className="landing-page-container">
      {/* Top Banner Navigation */}
      <nav className="landing-nav">
        <div className="brand-container" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-logo-icon">
            <Sparkles size={20} />
          </div>
          <div className="brand-text">
            <h1>Lumina</h1>
            <span>Luxury Tech</span>
          </div>
        </div>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#preview">Catalog</a>
          <a href="#about">About</a>
        </div>

        <div className="landing-nav-actions">
          <button className="btn-secondary" onClick={onOpenLogin} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
          <button className="btn-primary" onClick={onOpenSignup} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <UserPlus size={15} />
            <span>Get Started</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="landing-hero-badge">
          <Sparkles size={14} color="#00f2fe" />
          <span>Next Generation E-Commerce & Hardware</span>
        </div>
        <h1 className="landing-hero-title">
          Engineering The Future of <span className="gradient-text">Personal Tech</span>
        </h1>
        <p className="landing-hero-sub">
          Lumina blends bespoke industrial design with acoustic perfection and precision engineering. Discover handcrafted luxury tech with full stack speed.
        </p>

        <div className="landing-hero-cta">
          <button className="btn-primary" onClick={onExplore} style={{ padding: '14px 30px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} />
            <span>Browse Products</span>
            <ArrowRight size={18} />
          </button>
          <button className="btn-secondary" onClick={onOpenLogin} style={{ padding: '14px 26px', fontSize: '1rem' }}>
            Sign In / Register
          </button>
        </div>

        {/* Feature stats */}
        <div className="landing-stats-grid">
          <div className="stat-card">
            <h3>40mm</h3>
            <p>Beryllium Acoustic Drivers</p>
          </div>
          <div className="stat-card">
            <h3>60h</h3>
            <p>Active Battery Endurance</p>
          </div>
          <div className="stat-card">
            <h3>Grade 5</h3>
            <p>Aerospace Titanium Frame</p>
          </div>
          <div className="stat-card">
            <h3>0.02s</h3>
            <p>Ultra-low Latency Mesh</p>
          </div>
        </div>
      </header>

      {/* Trust Badges */}
      <section className="landing-trust-section" id="features">
        <div className="trust-item">
          <ShieldCheck size={28} color="#00f2fe" />
          <div>
            <h4>2-Year Global Warranty</h4>
            <p>Complimentary concierge hardware support</p>
          </div>
        </div>
        <div className="trust-item">
          <Truck size={28} color="#4facfe" />
          <div>
            <h4>Express Global Courier</h4>
            <p>Free tracked express delivery on all orders</p>
          </div>
        </div>
        <div className="trust-item">
          <Headphones size={28} color="#a855f7" />
          <div>
            <h4>30-Day In-Home Audition</h4>
            <p>Love your sound or return risk-free</p>
          </div>
        </div>
      </section>

      {/* Featured Catalog Preview */}
      <section className="landing-preview-section" id="preview">
        <div className="section-header-centered">
          <span className="badge-tag">Curated Collection</span>
          <h2>Crafted for the Discerning</h2>
          <p>Explore flagship audio, computing, and wearable innovations.</p>
        </div>

        <div className="landing-preview-grid">
          {featuredProducts.slice(0, 3).map((item) => (
            <div key={item.id} className="preview-card" onClick={onExplore}>
              <div className="preview-img-box">
                <img src={item.image} alt={item.title} />
                <span className="preview-tag">{item.tag || item.category}</span>
              </div>
              <div className="preview-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{item.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '0.85rem' }}>
                    <Star size={14} fill="#fbbf24" />
                    <span>{item.rating || 4.9}</span>
                  </div>
                </div>
                <p>{item.subtitle || item.description}</p>
                <div className="preview-card-bottom">
                  <span className="preview-price">${item.price}</span>
                  <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button className="btn-primary" onClick={onExplore} style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            <span>Explore All {featuredProducts.length || '6+'} Innovations</span>
            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="landing-cta-banner">
        <div className="cta-content">
          <h2>Ready to Upgrade Your Tech Experience?</h2>
          <p>Join thousands of audiophiles, developers, and creators worldwide.</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
            <button className="btn-primary" onClick={onOpenSignup} style={{ padding: '14px 28px' }}>
              Create Your Account
            </button>
            <button className="btn-secondary" onClick={onExplore} style={{ padding: '14px 28px' }}>
              Enter Store
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontWeight: '700', fontSize: '1.1rem' }}>
          <span>LUMINA</span>
          <span style={{ color: '#00f2fe' }}>•</span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '400' }}>
            Full Stack E-Commerce Platform
          </span>
        </div>
        <p style={{ marginTop: '8px', color: '#64748b', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Lumina Tech Inc. Built with React, Node.js, Express & MongoDB.
        </p>
      </footer>
    </div>
  );
}
