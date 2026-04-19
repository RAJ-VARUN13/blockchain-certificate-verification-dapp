import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatAddress } from '../utils/ethereum';
import './Navbar.css';

export default function Navbar({ account, onConnect, isConnecting }) {
  const location = useLocation();

  return (
    <nav className="navbar glass-strong" id="main-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-brand" id="navbar-logo">
          <span className="logo-icon">⛓️</span>
          <span className="logo-text">
            Cert<span className="logo-accent">Chain</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            id="nav-home"
          >
            Home
          </Link>
          <Link
            to="/issue"
            className={`nav-link ${location.pathname === '/issue' ? 'active' : ''}`}
            id="nav-issue"
          >
            Issue
          </Link>
          <Link
            to="/verify"
            className={`nav-link ${location.pathname === '/verify' ? 'active' : ''}`}
            id="nav-verify"
          >
            Verify
          </Link>
        </div>

        {/* Wallet Button */}
        <button
          className={`wallet-btn ${account ? 'connected' : ''}`}
          onClick={onConnect}
          disabled={isConnecting}
          id="wallet-connect-btn"
        >
          {isConnecting ? (
            <>
              <span className="spinner"></span>
              Connecting...
            </>
          ) : account ? (
            <>
              <span className="wallet-dot"></span>
              {formatAddress(account)}
            </>
          ) : (
            <>
              <span className="wallet-icon">🦊</span>
              Connect Wallet
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
