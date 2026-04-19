import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';
import { connectWallet } from '../utils/ethereum';
import './IssueCertificate.css';

export default function IssueCertificate({ account, onConnect }) {
  const [form, setForm] = useState({
    certificateId: '',
    studentName: '',
    courseName: '',
    issuer: '',
    recipientAddress: '',
    tokenURI: '',
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [txHash, setTxHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

      const tx = await contract.issueCertificate(
        form.certificateId,
        form.studentName,
        form.courseName,
        form.issuer,
        recipient,
        form.tokenURI || ''
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
      tokenURI: '',
    });
    setStatus(null);
    setTxHash('');
    setErrorMsg('');
  };

  return (
    <div className="issue-page">
      <div className="issue-container animate-fade-in-up">
        {/* Header */}
        <div className="page-header">
          <div className="page-icon">🎓</div>
          <h1>Issue Certificate</h1>
          <p className="page-desc">
            Create a tamper-proof certificate on the blockchain.
            Each certificate is minted as an ERC-721 NFT.
          </p>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div className="result-card glass success-card animate-fade-in-up">
            <div className="result-icon success-icon">✅</div>
            <h2>Certificate Issued Successfully!</h2>
            <p className="result-detail">
              Certificate <strong>{form.certificateId}</strong> has been permanently recorded on the blockchain.
            </p>
            {txHash && (
              <div className="tx-hash-box">
                <span className="tx-label">Transaction Hash:</span>
                <code className="tx-hash">{txHash}</code>
              </div>
            )}
            <button className="btn btn-primary" onClick={resetForm} id="issue-another-btn">
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

            <div className="form-group">
              <label htmlFor="tokenURI">
                IPFS Metadata URI
                <span className="optional-label">(optional)</span>
              </label>
              <input
                type="text"
                id="tokenURI"
                name="tokenURI"
                placeholder="ipfs://Qm..."
                value={form.tokenURI}
                onChange={handleChange}
              />
            </div>

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
