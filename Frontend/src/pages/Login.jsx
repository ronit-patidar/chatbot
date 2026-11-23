import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.warning('Please enter both email and password');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 bg-dark px-3 py-5">
      <div className="auth-card p-4 p-sm-5 rounded-4 shadow-lg bg-dark-subtle border border-secondary border-opacity-25 w-100" style={{ maxWidth: '440px' }}>
        {/* Brand / Logo */}
        <div className="text-center mb-4">
          <div
            className="rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #10a37f 0%, #2563eb 100%)',
            }}
          >
            <i className="bi bi-stars text-white fs-3"></i>
          </div>
          <h3 className="fw-bold text-light mb-1">Welcome back</h3>
          <p className="text-secondary small">Sign in to continue to Pulse</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-light small fw-medium">Email address</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-control bg-dark text-light border-secondary border-opacity-25 shadow-none"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label text-light small fw-medium">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-control bg-dark text-light border-secondary border-opacity-25 shadow-none"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn btn-outline-secondary border-secondary border-opacity-25 text-secondary"
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold shadow d-flex align-items-center justify-content-center gap-2 mb-3"
            style={{ background: 'linear-gradient(135deg, #10a37f 0%, #2563eb 100%)', border: 'none' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="text-center pt-2 border-top border-secondary border-opacity-25">
          <span className="text-secondary small">Don't have an account? </span>
          <Link to="/register" className="text-info text-decoration-none small fw-semibold hover-underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
