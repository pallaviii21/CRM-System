import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Lock, Mail, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { register, isAuthenticated, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setError(null);
    setLocalError('');
  }, [setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setLocalError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="register-page">
      <Link to="/" className="back-home-link-center">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div className="register-container animate-fade">
        <div className="register-logo">
          <div className="logo-icon">C</div>
          <span className="logo-text">CRM<span>System</span></span>
        </div>

        <div className="form-header text-center">
          <h2>Create Your Account</h2>
          <p>Set up your workspace in less than a minute.</p>
        </div>

        {(localError || error) && (
          <div className="auth-alert">
            <AlertCircle size={18} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="input-icon-wrapper">
              <User className="input-icon-left" size={18} />
              <input
                type="text"
                id="name"
                className="form-control input-with-icon"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Work Email</label>
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
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon-left" size={18} />
              <input
                type="password"
                id="password"
                className="form-control input-with-icon"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon-left" size={18} />
              <input
                type="password"
                id="confirmPassword"
                className="form-control input-with-icon"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group terms-checkbox-group">
            <input
              type="checkbox"
              id="terms"
              className="terms-checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="terms" className="terms-label">
              I agree to the <a href="#terms" onClick={() => alert('Terms of Service: This is a demo project.')}>Terms of Service</a> and <a href="#privacy" onClick={() => alert('Privacy Policy: We protect your data.')}>Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="auth-redirect text-center">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          background-color: var(--bg-primary);
          position: relative;
        }

        .back-home-link-center {
          position: absolute;
          top: 1.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-medium);
        }
        .back-home-link-center:hover {
          color: var(--brand-primary);
        }

        .register-container {
          width: 100%;
          max-width: 440px;
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
        }

        .register-logo {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.4rem;
          color: var(--brand-dark);
        }

        .text-center {
          text-align: center;
        }

        .terms-checkbox-group {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .terms-checkbox {
          margin-top: 0.25rem;
          cursor: pointer;
          accent-color: var(--brand-primary);
        }

        .terms-label {
          font-size: 0.825rem;
          color: var(--text-medium);
          line-height: 1.4;
          cursor: pointer;
        }

        .terms-label a {
          color: var(--brand-primary);
          font-weight: 600;
        }

        .terms-label a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
