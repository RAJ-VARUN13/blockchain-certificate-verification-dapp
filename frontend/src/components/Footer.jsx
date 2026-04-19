import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-inner">
        <span className="footer-text">CertChain</span>
        <span className="footer-sep">·</span>
        <span className="footer-text">Built on Ethereum</span>
        <span className="footer-sep">·</span>
        <a
          href="https://github.com/RAJ-VARUN13/blockchain-certificate-verification-dapp"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Source
        </a>
      </div>
    </footer>
  );
}
