import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import IssueCertificate from './pages/IssueCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import { connectWallet, onAccountsChanged, onChainChanged } from './utils/ethereum';

export default function App() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const { address } = await connectWallet();
      setAccount(address);
    } catch (err) {
      console.error('Wallet connection failed:', err);
      alert(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    // Auto-connect if previously connected
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        })
        .catch(console.error);
    }

    // Listen for account/chain changes
    const cleanupAccounts = onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
      } else {
        setAccount(accounts[0]);
      }
    });

    const cleanupChain = onChainChanged(() => {
      window.location.reload();
    });

    return () => {
      if (cleanupAccounts) cleanupAccounts();
      if (cleanupChain) cleanupChain();
    };
  }, []);

  return (
    <>
      <Navbar account={account} onConnect={handleConnect} isConnecting={isConnecting} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issue" element={<IssueCertificate account={account} onConnect={handleConnect} />} />
          <Route path="/verify" element={<VerifyCertificate />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
