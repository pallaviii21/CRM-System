import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, BarChart2, MessageSquare, ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div className="brand-logo">
            <div className="logo-icon">C</div>
            <span className="logo-text">CRM<span>System</span></span>
          </div>
          <nav className="header-nav">
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#about">About</a>
          </nav>
          <div className="header-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            ) : (
              <Link to="/login" className="btn btn-secondary login-btn-header">Login</Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge animate-fade">
            <span className="badge-sparkle">✨</span> Trusted by 10,000+ growing teams
          </div>
          <h1 className="hero-title animate-fade">
            Manage Your Customer<br />Relationships Like Never Before
          </h1>
          <p className="hero-subtitle animate-fade">
            Streamline your sales, track every lead, and close deals faster with an all-in-one CRM built for teams that demand excellence.
          </p>
          <div className="hero-buttons animate-fade">
            <button onClick={handleGetStarted} className="btn btn-light-hero btn-lg">
              Get Started Free <ArrowRight size={16} />
            </button>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-outline-hero btn-lg">
                Login
              </Link>
            )}
          </div>
          <p className="hero-footnote animate-fade">No credit card required • 14-day free trial</p>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L120 105C240 90 480 60 720 60C960 60 1200 90 1320 105L1440 120V180H1320C1200 180 960 180 720 180C480 180 240 180 120 180H0V120Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="section-title">Everything you need to grow</h2>
          <p className="section-subtitle">Powerful features that work together to help your team sell smarter.</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Users className="feature-icon" size={24} />
              </div>
              <h3 className="feature-title">Contact Management</h3>
              <p className="feature-desc">Organize every contact, company, and conversation in one searchable hub.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <TrendingUp className="feature-icon" size={24} />
              </div>
              <h3 className="feature-title">Sales Pipeline</h3>
              <p className="feature-desc">Visualize every lead stage and customize pipeline tracking in real time.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <BarChart2 className="feature-icon" size={24} />
              </div>
              <h3 className="feature-title">Analytics</h3>
              <p className="feature-desc">Interactive dashboard metrics reveal what's driving your revenue growth.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <MessageSquare className="feature-icon" size={24} />
              </div>
              <h3 className="feature-title">Lead Management</h3>
              <p className="feature-desc">Track status transitions seamlessly: New, Contacted, and Converted leads.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="section-title">Loved by teams everywhere</h2>
          <p className="section-subtitle">See what our customers have to say about CRM System.</p>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"I love how intuitive they make it to track leads. We saw a 30% increase in our first quarter!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">SC</div>
                <div>
                  <h4 className="author-name">Sarah Connor</h4>
                  <p className="author-role">VP of Sales, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"The pipeline view is a game changer. Our whole team finally knows exactly who to follow up with!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div>
                  <h4 className="author-name">Joshua Davis</h4>
                  <p className="author-role">Founder, Scaleups Co</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"Onboarding new reps used to take weeks, now they're productive within days. Highly recommended!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">AA</div>
                <div>
                  <h4 className="author-name">Anna Adams</h4>
                  <p className="author-role">Operations, FlowForce</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="brand-logo footer-logo">
            <div className="logo-icon footer-logo-icon">C</div>
            <span className="logo-text text-light">CRM<span>System</span></span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="footer-copy">&copy; {new Date().getFullYear()} CRM System. All rights reserved.</p>
        </div>
      </footer>

      {/* Styles local to Landing Page */}
      <style>{`
        .landing-page {
          background-color: var(--bg-primary);
        }
        .landing-header {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          z-index: 100;
          height: var(--header-height);
        }
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 1.5rem;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.35rem;
          color: var(--brand-dark);
        }
        .logo-icon {
          background-color: var(--brand-primary);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.15rem;
        }
        .logo-text span {
          color: var(--brand-primary);
        }
        .header-nav {
          display: flex;
          gap: 2rem;
        }
        .header-nav a {
          color: var(--text-medium);
          font-weight: 500;
          font-size: 0.95rem;
        }
        .header-nav a:hover {
          color: var(--brand-primary);
        }
        .login-btn-header {
          padding: 0.5rem 1.25rem;
        }
        
        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #0a3d21 0%, #00a859 100%);
          color: white;
          padding: 6rem 1.5rem 5rem;
          text-align: center;
          position: relative;
        }
        .hero-container {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          font-size: 0.825rem;
          font-weight: 500;
          margin-bottom: 2rem;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          backdrop-filter: blur(4px);
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          color: white;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2.5rem;
          max-width: 600px;
          line-height: 1.6;
        }
        .hero-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .btn-light-hero {
          background-color: white;
          color: var(--brand-dark);
          padding: 0.8rem 1.75rem;
          font-size: 1rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }
        .btn-light-hero:hover {
          background-color: #f8fafc;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .btn-outline-hero {
          border: 2px solid rgba(255, 255, 255, 0.5);
          color: white;
          padding: 0.8rem 1.75rem;
          font-size: 1rem;
        }
        .btn-outline-hero:hover {
          border-color: white;
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        .hero-footnote {
          font-size: 0.825rem;
          color: rgba(255, 255, 255, 0.75);
        }
        .hero-wave {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          line-height: 0;
        }
        .hero-wave svg {
          width: 100%;
          height: auto;
        }

        /* Features Section */
        .features-section {
          padding: 6rem 1.5rem 4rem;
        }
        .features-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .section-title {
          text-align: center;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .section-subtitle {
          text-align: center;
          color: var(--text-muted);
          margin-bottom: 4rem;
          font-size: 1.05rem;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(0, 168, 89, 0.2);
        }
        .feature-icon-wrapper {
          width: 48px;
          height: 48px;
          background-color: var(--brand-light);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-primary);
          margin-bottom: 1.25rem;
        }
        .feature-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .feature-desc {
          color: var(--text-muted);
          font-size: 0.925rem;
          line-height: 1.5;
        }

        /* Testimonials Section */
        .testimonials-section {
          background-color: #f1f5f9;
          padding: 5rem 1.5rem;
        }
        .testimonials-container {
          max-width: 1100px;
          margin: 0 auto;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .testimonial-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: var(--shadow-sm);
        }
        .rating {
          margin-bottom: 1rem;
        }
        .testimonial-text {
          font-style: italic;
          color: var(--text-medium);
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        .author-avatar {
          width: 44px;
          height: 44px;
          background-color: var(--brand-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .author-name {
          font-size: 0.95rem;
          font-weight: 600;
        }
        .author-role {
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        /* Footer */
        .landing-footer {
          background-color: var(--brand-dark);
          color: white;
          padding: 3rem 1.5rem;
        }
        .footer-container {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .footer-logo-icon {
          background-color: white;
          color: var(--brand-dark);
        }
        .text-light {
          color: white;
        }
        .footer-links {
          display: flex;
          gap: 2rem;
        }
        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
        .footer-links a:hover {
          color: white;
        }
        .footer-copy {
          font-size: 0.825rem;
          color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.25rem;
          }
          .header-nav {
            display: none;
          }
          .hero-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 280px;
          }
          .btn-lg {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
