import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      toast.warning('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      toast.warning('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (res.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 bg-dark px-3 py-5">
      <div className="auth-card p-4 p-sm-5 rounded-4 shadow-lg bg-dark-subtle border border-secondary border-opacity-25 w-100" style={{ maxWidth: '480px' }}>
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
            <i className="bi bi-person-plus text-white fs-3"></i>
          </div>
          <h3 className="fw-bold text-light mb-1">Create an account</h3>
          <p className="text-secondary small">Start chatting with Pulse and memory features</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Row */}
          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label text-light small fw-medium">First name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="form-control bg-dark text-light border-secondary border-opacity-25 shadow-none"
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label text-light small fw-medium">Last name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="form-control bg-dark text-light border-secondary border-opacity-25 shadow-none"
              />
            </div>
          </div>

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
          <div className="mb-3">
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
                placeholder="At least 6 characters"
                className="form-control bg-dark text-light border-secondary border-opacity-25 shadow-none"
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label text-light small fw-medium">Confirm password</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-25 text-secondary">
                <i className="bi bi-shield-lock"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="form-control bg-dark text-light border-secondary border-opacity-25 shadow-none"
                autoComplete="new-password"
              />
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
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="text-center pt-2 border-top border-secondary border-opacity-25">
          <span className="text-secondary small">Already have an account? </span>
          <Link to="/login" className="text-info text-decoration-none small fw-semibold hover-underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
