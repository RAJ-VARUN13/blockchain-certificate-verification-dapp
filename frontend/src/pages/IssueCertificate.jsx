import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';
import { connectWallet } from '../utils/ethereum';
import { generateCertificateMetadata, uploadToIPFS } from '../utils/ipfs';
import { QRCodeSVG } from 'qrcode.react';
import './IssueCertificate.css';

export default function IssueCertificate({ account, onConnect }) {
  const [form, setForm] = useState({
    certificateId: '',
    studentName: '',
    courseName: '',
    issuer: '',
    recipientAddress: '',
  });
  const [autoGenerateIPFS, setAutoGenerateIPFS] = useState(true);
  const [customTokenURI, setCustomTokenURI] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    setTxHash('');

    try {
      // Connect if not connected
      let signer;
      if (!account) {
        const wallet = await connectWallet();
        signer = wallet.signer;
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }

      const contract = getContract(signer);

      // Use the connected wallet address as recipient if not specified
      const recipient = form.recipientAddress || (await signer.getAddress());

      // Generate IPFS metadata if auto-generate is enabled
      let tokenURI = customTokenURI;
      if (autoGenerateIPFS) {
        const metadata = generateCertificateMetadata({
          certificateId: form.certificateId,
          studentName: form.studentName,
          courseName: form.courseName,
          issuer: form.issuer,
        });
        tokenURI = await uploadToIPFS(metadata);
      }

      const tx = await contract.issueCertificate(
        form.certificateId,
        form.studentName,
        form.courseName,
        form.issuer,
        recipient,
        tokenURI || ''
      );

      setTxHash(tx.hash);
      await tx.wait();
      setStatus('success');
    } catch (err) {
      console.error('Issue certificate error:', err);
      setStatus('error');
      if (err.reason) {
        setErrorMsg(err.reason);
      } else if (err.message?.includes('user rejected')) {
        setErrorMsg('Transaction was rejected by user.');
      } else {
        setErrorMsg(err.message || 'An unknown error occurred.');
      }
    }
  };

  const resetForm = () => {
    setForm({
      certificateId: '',
      studentName: '',
      courseName: '',
      issuer: '',
      recipientAddress: '',
    });
    setCustomTokenURI('');
    setStatus(null);
    setTxHash('');
    setErrorMsg('');
    setShowQR(false);
  };

  const verificationUrl = `${window.location.origin}/verify?id=${encodeURIComponent(form.certificateId)}`;

  return (
    <div className="issue-page">
      <div className="issue-container animate-fade-in-up">
        {/* Header */}
        <div className="page-header">
          <div className="page-icon">🎓</div>
          <h1>Issue Certificate</h1>
          <p className="page-desc">
            Create a tamper-proof certificate on the blockchain.
            Each certificate is minted as an ERC-721 NFT with IPFS metadata.
          </p>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div className="result-card glass success-card animate-fade-in-up">
            <div className="result-icon success-icon">✅</div>
            <h2>Certificate Issued Successfully!</h2>
            <p className="result-detail">
              Certificate <strong>{form.certificateId}</strong> has been permanently recorded on the blockchain as an NFT.
            </p>
            {txHash && (
              <div className="tx-hash-box">
                <span className="tx-label">Transaction Hash:</span>
                <code className="tx-hash">{txHash}</code>
              </div>
            )}

            {/* QR Code for sharing */}
            <div className="success-actions">
              <button
                className="btn btn-secondary qr-toggle"
                onClick={() => setShowQR(!showQR)}
                id="success-qr-toggle"
              >
                {showQR ? '🔽 Hide QR Code' : '📱 Share via QR'}
              </button>
            </div>

            {showQR && (
              <div className="qr-section animate-fade-in">
                <div className="qr-wrapper">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={160}
                    bgColor="transparent"
                    fgColor="#22c55e"
                    level="M"
                  />
                </div>
                <p className="qr-hint">Share this QR for instant certificate verification</p>
              </div>
            )}

            <button className="btn btn-primary" onClick={resetForm} id="issue-another-btn" style={{ marginTop: '16px' }}>
              Issue Another Certificate
            </button>
          </div>
        ) : (
          /* Form */
          <form className="issue-form glass" onSubmit={handleSubmit} id="issue-form">
            <div className="form-group">
              <label htmlFor="certificateId">Certificate ID</label>
              <input
                type="text"
                id="certificateId"
                name="certificateId"
                placeholder="e.g., CERT-2024-001"
                value={form.certificateId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentName">Student Name</label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  placeholder="e.g., Varun Raj"
                  value={form.studentName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="courseName">Course Name</label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  placeholder="e.g., Blockchain Development"
                  value={form.courseName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="issuer">Issuing Organization</label>
              <input
                type="text"
                id="issuer"
                name="issuer"
                placeholder="e.g., IIIT Ranchi"
                value={form.issuer}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="recipientAddress">
                Recipient Wallet Address
                <span className="optional-label">(optional — defaults to your wallet)</span>
              </label>
              <input
                type="text"
                id="recipientAddress"
                name="recipientAddress"
                placeholder="0x..."
                value={form.recipientAddress}
                onChange={handleChange}
              />
            </div>

            {/* IPFS Toggle */}
            <div className="ipfs-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={autoGenerateIPFS}
                  onChange={(e) => setAutoGenerateIPFS(e.target.checked)}
                  id="ipfs-auto-toggle"
                />
                <span className="toggle-switch"></span>
                <span className="toggle-text">Auto-generate IPFS metadata (NFT)</span>
              </label>
            </div>

            {!autoGenerateIPFS && (
              <div className="form-group animate-fade-in">
                <label htmlFor="customTokenURI">
                  Custom Token URI
                  <span className="optional-label">(IPFS or data URI)</span>
                </label>
                <input
                  type="text"
                  id="customTokenURI"
                  placeholder="ipfs://Qm..."
                  value={customTokenURI}
                  onChange={(e) => setCustomTokenURI(e.target.value)}
                />
              </div>
            )}

            {/* Error Message */}
            {status === 'error' && (
              <div className="error-box animate-fade-in">
                <span className="error-icon">❌</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary submit-btn ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading'}
              id="submit-issue-btn"
            >
              {status === 'loading' ? (
                <>
                  <span className="spinner"></span>
                  Processing Transaction...
                </>
              ) : (
                <>
                  <span>⛓️</span>
                  Issue on Blockchain
                </>
              )}
            </button>

            {txHash && status === 'loading' && (
              <p className="tx-pending">
                Tx: <code>{txHash.slice(0, 20)}...</code> — waiting for confirmation...
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
