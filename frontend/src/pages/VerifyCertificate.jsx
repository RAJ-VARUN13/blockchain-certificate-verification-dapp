import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getReadOnlyContract } from '../utils/contract';
import { formatDate } from '../utils/ethereum';
import { QRCodeSVG } from 'qrcode.react';
import './VerifyCertificate.css';

export default function VerifyCertificate() {
  const [certificateId, setCertificateId] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null); // null | 'loading' | 'found' | 'not-found' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    setShowQR(false);

    try {
      // Use a JSON-RPC provider for read-only calls (no wallet needed)
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const contract = getReadOnlyContract(provider);

      const [studentName, courseName, issuer, issueDate, exists, tokenId] =
        await contract.verifyCertificate(certificateId.trim());

      if (exists) {
        setResult({
          studentName,
          courseName,
          issuer,
          issueDate,
          tokenId: Number(tokenId),
        });
        setStatus('found');
      } else {
        setStatus('not-found');
      }
    } catch (err) {
      console.error('Verify error:', err);
      setStatus('error');
      if (err.message?.includes('Contract not deployed')) {
        setErrorMsg('Contract not deployed. Please deploy the smart contract first.');
      } else {
        setErrorMsg('Failed to connect to blockchain. Is the Hardhat node running?');
      }
    }
  };

  const verificationUrl = `${window.location.origin}/verify?id=${encodeURIComponent(certificateId)}`;

  return (
    <div className="verify-page">
      <div className="verify-container animate-fade-in-up">
        {/* Header */}
        <div className="page-header">
          <div className="page-icon">🔍</div>
          <h1>Verify Certificate</h1>
          <p className="page-desc">
            Enter a certificate ID to check its authenticity on the blockchain.
            No wallet connection required.
          </p>
        </div>

        {/* Search Form */}
        <form className="verify-form glass" onSubmit={handleVerify} id="verify-form">
          <div className="search-bar">
            <input
              type="text"
              id="verify-input"
              placeholder="Enter Certificate ID (e.g., CERT-2024-001)"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              required
            />
            <button
              type="submit"
              className="search-btn"
              disabled={status === 'loading'}
              id="verify-submit-btn"
            >
              {status === 'loading' ? (
                <span className="spinner"></span>
              ) : (
                '→'
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        {status === 'found' && result && (
          <div className="certificate-card glass animate-fade-in-up" id="certificate-result">
            {/* Verified Badge */}
            <div className="verified-badge">
              <span className="verified-icon">✅</span>
              <span>Blockchain Verified</span>
            </div>

            {/* Certificate Info */}
            <div className="cert-header">
              <h2 className="cert-title">{result.courseName}</h2>
              <p className="cert-subtitle">Certificate of Completion</p>
            </div>

            <div className="cert-details">
              <div className="cert-field">
                <span className="field-label">Student Name</span>
                <span className="field-value">{result.studentName}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">Course</span>
                <span className="field-value">{result.courseName}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">Issued By</span>
                <span className="field-value">{result.issuer}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">Issue Date</span>
                <span className="field-value">{formatDate(result.issueDate)}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">NFT Token ID</span>
                <span className="field-value token-id">#{result.tokenId}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">Certificate ID</span>
                <span className="field-value cert-id">{certificateId}</span>
              </div>
            </div>

            {/* QR Code Toggle */}
            <div className="cert-actions">
              <button
                className="btn btn-secondary qr-toggle"
                onClick={() => setShowQR(!showQR)}
                id="qr-toggle-btn"
              >
                {showQR ? '🔽 Hide QR Code' : '📱 Show QR Code'}
              </button>
            </div>

            {showQR && (
              <div className="qr-section animate-fade-in">
                <div className="qr-wrapper">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={180}
                    bgColor="transparent"
                    fgColor="#00d4ff"
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <p className="qr-hint">Scan to verify this certificate</p>
              </div>
            )}
          </div>
        )}

        {/* Not Found */}
        {status === 'not-found' && (
          <div className="result-card glass not-found-card animate-fade-in-up" id="not-found-result">
            <div className="result-icon">❌</div>
            <h2>Certificate Not Found</h2>
            <p className="result-detail">
              No certificate with ID <strong>"{certificateId}"</strong> exists on the blockchain.
              Please check the ID and try again.
            </p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="error-box animate-fade-in">
            <span className="error-icon">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
