import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatAddress } from '../utils/ethereum';
import './Navbar.css';

export default function Navbar({ account, onConnect, isConnecting }) {
  const location = useLocation();

  return (
    <nav className="nav" id="main-navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" id="navbar-logo">
          CertChain
        </Link>

        <div className="nav-links">
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

        <button
          className={`connect-btn ${account ? 'connected' : ''}`}
          onClick={onConnect}
          disabled={isConnecting}
          id="wallet-connect-btn"
        >
          {isConnecting
            ? 'Connecting...'
            : account
            ? formatAddress(account)
            : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
}
