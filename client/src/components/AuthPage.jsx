import React, { useState } from 'react';
import { Eye, EyeOff, Zap, ArrowRight, Sparkles, Lock, Mail, User } from 'lucide-react';

export default function AuthPage({ onAuthSuccess, onBackToLanding, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const update = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }
    if (mode === 'signup' && !form.name) {
      setError('Full name is required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Authentication failed. Please try again.');
        return;
      }

      // Store JWT & user info
      localStorage.setItem('lumina_token', data.token);
      localStorage.setItem('lumina_user', JSON.stringify(data.user));
      onAuthSuccess(data.user, data.token);
    } catch (err) {
      setError('Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <Zap size={22} color="#00f2fe" fill="#00f2fe" />
          <span style={styles.logoText}>LUMINA</span>
        </div>

        <h1 style={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={styles.subtitle}>
          {mode === 'login'
            ? 'Sign in to access your luxury collection'
            : 'Join thousands of premium customers'}
        </p>

        {/* Demo credentials hint */}
        {mode === 'login' && (
          <div style={styles.demoHint}>
            <Sparkles size={13} color="#00f2fe" />
            <span>
              Demo account: <strong>alexander.vance@lumina-tech.com</strong> / <strong>Password123!</strong>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form} id="auth-form">
          {/* Name field — signup only */}
          {mode === 'signup' && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrap}>
                <User size={15} color="#64748b" style={styles.inputIcon} />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Alexander Vance"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  style={styles.input}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrap}>
              <Mail size={15} color="#64748b" style={styles.inputIcon} />
              <input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                style={styles.input}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <Lock size={15} color="#64748b" style={styles.inputIcon} />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                style={{ ...styles.input, paddingRight: '42px' }}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                id="toggle-password-btn"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={styles.errorBox} role="alert">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? (
              <span style={styles.loadingSpinner} />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle */}
        <p style={styles.toggleText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            id="auth-toggle-btn"
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
              setForm({ name: '', email: '', password: '' });
            }}
            style={styles.toggleLink}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        {/* Back to Landing Page */}
        {onBackToLanding && (
          <div style={{ textAlign: 'center', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={onBackToLanding}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer', transition: 'color 0.2s', textDecoration: 'underline' }}
              onMouseEnter={(e) => (e.target.style.color = '#00f2fe')}
              onMouseLeave={(e) => (e.target.style.color = '#64748b')}
            >
              ← Back to Landing Page & Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#04101e',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  blob1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,242,254,0.12) 0%, transparent 70%)',
    top: '-100px',
    left: '-150px',
    filter: 'blur(40px)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79,172,254,0.09) 0%, transparent 70%)',
    bottom: '-80px',
    right: '-100px',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },
  blob3: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,242,254,0.06) 0%, transparent 70%)',
    top: '50%',
    left: '60%',
    filter: 'blur(60px)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '20px',
    padding: '40px 36px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,242,254,0.06)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '28px',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '0.12em',
    color: '#f8fafc',
  },
  title: {
    fontSize: '1.7rem',
    fontWeight: '700',
    color: '#f8fafc',
    margin: '0 0 8px',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '0.88rem',
    color: '#64748b',
    margin: '0 0 22px',
  },
  demoHint: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(0,242,254,0.08)',
    border: '1px solid rgba(0,242,254,0.18)',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginBottom: '22px',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#94a3b8',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '11px 14px 11px 36px',
    color: '#f8fafc',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#fca5a5',
    fontSize: '0.82rem',
    lineHeight: 1.5,
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '13px 24px',
    background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    color: '#04101e',
    fontWeight: '700',
    fontSize: '0.95rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
    marginTop: '4px',
    boxShadow: '0 8px 24px rgba(0,242,254,0.25)',
  },
  loadingSpinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(4,16,30,0.3)',
    borderTop: '2px solid #04101e',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '22px',
    marginBottom: 0,
  },
  toggleLink: {
    background: 'none',
    border: 'none',
    color: '#00f2fe',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
};
