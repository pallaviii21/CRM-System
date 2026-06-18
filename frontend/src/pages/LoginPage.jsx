import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, isAuthenticated, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on load
  useEffect(() => {
    setError(null);
    setLocalError('');
  }, [setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-split-page">
      {/* Back to Home button */}
      <Link to="/" className="back-home-link">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      {/* Left Panel - Brand Showcase */}
      <div className="login-left-panel">
        <div className="left-panel-content">
          <div className="brand-logo logo-light">
            <div className="logo-icon logo-icon-white">C</div>
            <span className="logo-text text-white">CRM<span>System</span></span>
          </div>
          <h2 className="panel-title">Welcome back —<br />your pipeline awaits.</h2>
          <p className="panel-text">
            Pick up right where you left off. Track leads, nurture customers, and close deals faster with the CRM platform built for modern sales teams.
          </p>
          <div className="panel-badges">
            <span>🛡️ Enterprise-grade security</span>
            <span>⚡ Real-time updates</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-right-panel">
        <div className="login-form-container animate-fade">
          <div className="form-header">
            <h2>Sign In to Your Account</h2>
            <p>Enter your credentials to access your dashboard</p>
          </div>

          {(localError || error) && (
            <div className="auth-alert">
              <AlertCircle size={18} />
              <span>{localError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon-left" size={18} />
                <input
                  type="email"
                  id="email"
                  className="form-control input-with-icon"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label className="form-label" htmlFor="password">Password</label>
                <a href="#forgot" className="forgot-password-link" onClick={() => alert('Password reset is not configured for this demo.')}>
                  Forgot password?
                </a>
              </div>
              <div className="input-icon-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input
                  type="password"
                  id="password"
                  className="form-control input-with-icon"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Logging In...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            onClick={() => alert('Google authentication is not configured for this demo.')}
            className="btn btn-secondary btn-block google-signin-btn"
            disabled={loading}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <p className="auth-redirect">
            New to CRM System? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>

      <style>{`
        .login-split-page {
          display: flex;
          min-height: 100vh;
          position: relative;
        }
        
        .back-home-link {
          position: absolute;
          top: 1.5rem;
          right: 2rem;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-medium);
          z-index: 10;
        }
        .back-home-link:hover {
          color: var(--brand-primary);
        }

        /* Left Panel */
        .login-left-panel {
          flex: 1;
          background: linear-gradient(135deg, #0a3d21 0%, #0c4b2b 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }
        @media (max-width: 900px) {
          .login-left-panel {
            display: none;
          }
        }
        .left-panel-content {
          max-width: 460px;
        }
        .logo-light {
          margin-bottom: 3rem;
        }
        .logo-icon-white {
          background-color: white;
          color: var(--brand-dark);
        }
        .text-white {
          color: white !important;
        }
        .panel-title {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.2;
          color: white;
          margin-bottom: 1.5rem;
        }
        .panel-text {
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 2.5rem;
        }
        .panel-badges {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Right Panel */
        .login-right-panel {
          flex: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          background-color: var(--bg-primary);
        }
        .login-form-container {
          width: 100%;
          max-width: 420px;
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
        }
        .form-header {
          margin-bottom: 2rem;
        }
        .form-header h2 {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 0.375rem;
        }
        .form-header p {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        /* Inputs & Icons */
        .input-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon-left {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          pointer-events: none;
        }
        .input-with-icon {
          padding-left: 2.5rem !important;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.375rem;
        }
        .forgot-password-link {
          font-size: 0.775rem;
          font-weight: 500;
          color: var(--brand-primary);
        }
        .forgot-password-link:hover {
          color: var(--brand-primary-hover);
          text-decoration: underline;
        }

        /* Submit blocks */
        .btn-block {
          width: 100%;
        }
        .auth-submit {
          margin-top: 1.5rem;
          padding: 0.75rem;
          border-radius: 8px;
        }
        .auth-alert {
          background-color: var(--danger-bg);
          color: var(--danger-text);
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        /* Dividers */
        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.5rem 0;
          color: var(--text-muted);
          font-size: 0.825rem;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }
        .auth-divider:not(:empty)::before {
          margin-right: .5em;
        }
        .auth-divider:not(:empty)::after {
          margin-left: .5em;
        }

        .google-signin-btn {
          border-radius: 8px;
          padding: 0.75rem;
          background: white;
          border: 1px solid var(--border-color);
          color: var(--text-medium);
        }
        .google-signin-btn:hover {
          background-color: #f8fafc;
          color: var(--text-dark);
        }
        .google-icon {
          margin-right: 0.5rem;
        }

        .auth-redirect {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .auth-redirect a {
          color: var(--brand-primary);
          font-weight: 600;
        }
        .auth-redirect a:hover {
          color: var(--brand-primary-hover);
          text-decoration: underline;
        }

        /* Loading spinner */
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
