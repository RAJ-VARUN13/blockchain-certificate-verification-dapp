import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';
import { connectWallet } from '../utils/ethereum';
import { generateCertificateMetadata, uploadToIPFS } from '../utils/ipfs';
import './IssueCertificate.css';

export default function IssueCertificate({ account, onConnect }) {
  const [form, setForm] = useState({
    certificateId: '',
    studentName: '',
    courseName: '',
    issuer: '',
    recipientAddress: '',
  });
  const [status, setStatus] = useState(null);
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
      let signer;
      if (!account) {
        const wallet = await connectWallet();
        signer = wallet.signer;
      } else {
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      }

      const contract = getContract(signer);
      const recipient = form.recipientAddress || (await signer.getAddress());

      // Generate IPFS metadata
      const metadata = generateCertificateMetadata({
        certificateId: form.certificateId,
        studentName: form.studentName,
        courseName: form.courseName,
        issuer: form.issuer,
      });
      const tokenURI = await uploadToIPFS(metadata);

      const tx = await contract.issueCertificate(
        form.certificateId,
        form.studentName,
        form.courseName,
        form.issuer,
        recipient,
        tokenURI
      );

      setTxHash(tx.hash);
      await tx.wait();
      setStatus('success');
    } catch (err) {
      console.error('Issue error:', err);
      setStatus('error');
      if (err.reason) setErrorMsg(err.reason);
      else if (err.message?.includes('user rejected')) setErrorMsg('Transaction rejected.');
      else setErrorMsg(err.message || 'Something went wrong.');
    }
  };

  const resetForm = () => {
    setForm({ certificateId: '', studentName: '', courseName: '', issuer: '', recipientAddress: '' });
    setStatus(null);
    setTxHash('');
    setErrorMsg('');
  };

  return (
    <div className="page-container">
      <div className="page-content fade-in">
        <div className="page-header">
          <h1>Issue Certificate</h1>
          <p>Create a new certificate on the blockchain. It will be minted as an ERC-721 NFT.</p>
        </div>

        {status === 'success' ? (
          <div className="card success-card fade-in">
            <div className="success-marker">Issued</div>
            <h2>Certificate recorded on-chain</h2>
            <p className="success-id">{form.certificateId}</p>
            {txHash && (
              <div className="tx-row">
                <span className="tx-label">Tx</span>
                <code className="tx-value">{txHash}</code>
              </div>
            )}
            <button className="btn-ghost" onClick={resetForm} id="issue-another-btn" style={{ marginTop: 20 }}>
              Issue another
            </button>
          </div>
        ) : (
          <form className="card" onSubmit={handleSubmit} id="issue-form">
            <div className="field">
              <label htmlFor="certificateId">Certificate ID</label>
              <input type="text" id="certificateId" name="certificateId" placeholder="CERT-2024-001" value={form.certificateId} onChange={handleChange} required />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="studentName">Student name</label>
                <input type="text" id="studentName" name="studentName" placeholder="Varun Raj" value={form.studentName} onChange={handleChange} required />
              </div>
              <div className="field">
                <label htmlFor="courseName">Course</label>
                <input type="text" id="courseName" name="courseName" placeholder="Blockchain Development" value={form.courseName} onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="issuer">Issuing organization</label>
              <input type="text" id="issuer" name="issuer" placeholder="IIIT Ranchi" value={form.issuer} onChange={handleChange} required />
            </div>

            <div className="field">
              <label htmlFor="recipientAddress">Recipient address <span className="hint">optional</span></label>
              <input type="text" id="recipientAddress" name="recipientAddress" placeholder="0x... (defaults to your wallet)" value={form.recipientAddress} onChange={handleChange} />
            </div>

            {status === 'error' && (
              <div className="error-msg fade-in">{errorMsg}</div>
            )}

            <button type="submit" className="btn-primary submit-btn" disabled={status === 'loading'} id="submit-issue-btn">
              {status === 'loading' ? 'Sending transaction...' : 'Issue certificate'}
            </button>

            {txHash && status === 'loading' && (
              <p className="tx-pending">Confirming <code>{txHash.slice(0, 16)}...</code></p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
