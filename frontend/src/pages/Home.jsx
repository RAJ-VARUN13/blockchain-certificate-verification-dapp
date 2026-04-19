import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-orb hero-orb-1"></div>
        <div className="hero-bg-orb hero-orb-2"></div>

        <div className="hero-content animate-fade-in-up">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Powered by Ethereum Blockchain
          </div>
          <h1 className="hero-title">
            Tamper-Proof
            <br />
            <span className="hero-gradient-text">Certificate Verification</span>
          </h1>
          <p className="hero-subtitle">
            Issue and verify academic certificates on the blockchain.
            Immutable, transparent, and decentralized — no middleman required.
          </p>
          <div className="hero-actions">
            <Link to="/issue" className="btn btn-primary" id="hero-issue-btn">
              <span>🎓</span> Issue Certificate
            </Link>
            <Link to="/verify" className="btn btn-secondary" id="hero-verify-btn">
              <span>🔍</span> Verify Certificate
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features-section">
        <h2 className="section-title">Why CertChain?</h2>
        <div className="features-grid">
          <div className="feature-card glass animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="feature-icon">🔒</div>
            <h3>Immutable Records</h3>
            <p>Once a certificate is issued on the blockchain, it cannot be altered or deleted by anyone.</p>
          </div>
          <div className="feature-card glass animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="feature-icon">🌐</div>
            <h3>Public Verification</h3>
            <p>Anyone can verify a certificate anytime, anywhere — no need to contact the issuer.</p>
          </div>
          <div className="feature-card glass animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="feature-icon">🎨</div>
            <h3>NFT Certificates</h3>
            <p>Each certificate is minted as an ERC-721 NFT with IPFS metadata — truly ownable credentials.</p>
          </div>
          <div className="feature-card glass animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="feature-icon">📱</div>
            <h3>QR Code Sharing</h3>
            <p>Generate QR codes linking directly to the verification page for instant sharing.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="step-number">01</div>
            <div className="step-content">
              <h3>Connect Wallet</h3>
              <p>Link your MetaMask wallet to authenticate as an issuer.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="step-number">02</div>
            <div className="step-content">
              <h3>Issue Certificate</h3>
              <p>Fill in the details and submit — the certificate is permanently stored on-chain.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="step-number">03</div>
            <div className="step-content">
              <h3>Verify Anytime</h3>
              <p>Enter the certificate ID to instantly verify its authenticity.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
