import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { getReadOnlyContract } from '../utils/contract';
import { formatDate } from '../utils/ethereum';
import { QRCodeSVG } from 'qrcode.react';
import './VerifyCertificate.css';

export default function VerifyCertificate() {
  const [searchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState(searchParams.get('id') || '');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showQR, setShowQR] = useState(false);

  // Auto-verify if id is in URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setCertificateId(id);
      handleVerify(null, id);
    }
  }, []);

  const handleVerify = async (e, idOverride) => {
    if (e) e.preventDefault();
    const id = idOverride || certificateId.trim();
    if (!id) return;

    setStatus('loading');
    setResult(null);
    setErrorMsg('');
    setShowQR(false);

    try {
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const contract = getReadOnlyContract(provider);

      const [studentName, courseName, issuer, issueDate, exists, tokenId] =
        await contract.verifyCertificate(id);

      if (exists) {
        setResult({ studentName, courseName, issuer, issueDate, tokenId: Number(tokenId) });
        setStatus('found');
      } else {
        setStatus('not-found');
      }
    } catch (err) {
      console.error('Verify error:', err);
      setStatus('error');
      setErrorMsg('Could not connect to the blockchain. Is the Hardhat node running?');
    }
  };

  const verificationUrl = `${window.location.origin}/verify?id=${encodeURIComponent(certificateId)}`;

  return (
    <div className="page-container">
      <div className="page-content fade-in">
        <div className="page-header">
          <h1>Verify Certificate</h1>
          <p>Look up a certificate on the blockchain. No wallet needed.</p>
        </div>

        <form className="search-form" onSubmit={handleVerify} id="verify-form">
          <input
            type="text"
            id="verify-input"
            placeholder="Certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            required
          />
          <button type="submit" className="search-btn" disabled={status === 'loading'} id="verify-submit-btn">
            {status === 'loading' ? '...' : 'Verify'}
          </button>
        </form>

        {status === 'found' && result && (
          <div className="cert-card card fade-in" id="certificate-result">
            <div className="cert-status">
              <span className="status-dot"></span>
              Verified on-chain
            </div>

            <div className="cert-grid">
              <div className="cert-row">
                <span className="cert-label">Student</span>
                <span className="cert-value">{result.studentName}</span>
              </div>
              <div className="cert-row">
                <span className="cert-label">Course</span>
                <span className="cert-value">{result.courseName}</span>
              </div>
              <div className="cert-row">
                <span className="cert-label">Issuer</span>
                <span className="cert-value">{result.issuer}</span>
              </div>
              <div className="cert-row">
                <span className="cert-label">Date</span>
                <span className="cert-value">{formatDate(result.issueDate)}</span>
              </div>
              <div className="cert-row">
                <span className="cert-label">Token</span>
                <span className="cert-value mono">#{result.tokenId}</span>
              </div>
            </div>

            <button className="qr-btn" onClick={() => setShowQR(!showQR)} id="qr-toggle-btn">
              {showQR ? 'Hide QR' : 'Share QR'}
            </button>

            {showQR && (
              <div className="qr-box fade-in">
                <QRCodeSVG value={verificationUrl} size={140} bgColor="transparent" fgColor="#a1a1aa" level="M" />
                <p className="qr-label">Scan to verify</p>
              </div>
            )}
          </div>
        )}

        {status === 'not-found' && (
          <div className="card not-found fade-in" id="not-found-result">
            <p>No certificate found for <code>{certificateId}</code></p>
          </div>
        )}

        {status === 'error' && (
          <div className="error-msg fade-in">{errorMsg}</div>
        )}
      </div>
    </div>
  );
}
