import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <p className="hero-tag">On-chain credential verification</p>
        <h1 className="hero-title">
          Certificates that<br />can't be faked.
        </h1>
        <p className="hero-desc">
          Issue and verify academic credentials on Ethereum.
          Every certificate is stored as an immutable NFT — no databases,
          no middlemen, no tampering.
        </p>
        <div className="hero-actions">
          <Link to="/issue" className="btn-primary" id="hero-issue-btn">
            Issue a certificate
          </Link>
          <Link to="/verify" className="btn-ghost" id="hero-verify-btn">
            Verify a certificate
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Immutable</h3>
          <p>Certificates live on the blockchain. Once issued, they can never be altered or deleted.</p>
        </div>
        <div className="feature">
          <h3>Verifiable</h3>
          <p>Anyone can verify a certificate with just an ID. No need to contact the issuing organization.</p>
        </div>
        <div className="feature">
          <h3>Owned</h3>
          <p>Each certificate is an ERC-721 NFT. Recipients have cryptographic proof of ownership.</p>
        </div>
      </section>
    </div>
  );
}
