import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">⛓️ Cert<span className="logo-accent">Chain</span></span>
          <p className="footer-tagline">Decentralized certificate verification powered by blockchain.</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/RAJ-VARUN13/blockchain-certificate-verification-dapp" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <span className="footer-divider">•</span>
          <span className="footer-tech">Solidity · Hardhat · React · ethers.js</span>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} CertChain. Built with 💜 on Ethereum.
        </div>
      </div>
    </footer>
  );
}
