# ⛓️ CertChain — Blockchain Certificate Verification DApp

<div align="center">

![Solidity](https://img.shields.io/badge/Solidity-^0.8.27-363636?style=for-the-badge&logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-2.x-FFF100?style=for-the-badge&logo=hardhat)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.x-2535a0?style=for-the-badge&logo=ethereum)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A decentralized application for issuing and verifying tamper-proof academic certificates on the Ethereum blockchain.**

Each certificate is minted as an **ERC-721 NFT** with **IPFS metadata**, enabling trustless, transparent, and permanent credential verification.

</div>

---

## 🚀 Features

- **🔒 Immutable Records** — Certificates stored on blockchain cannot be altered or deleted
- **🌐 Public Verification** — Anyone can verify a certificate without contacting the issuer
- **🎨 NFT Certificates** — Each certificate is minted as an ERC-721 token (OpenZeppelin)
- **📦 IPFS Metadata** — Certificate metadata follows NFT standards with auto-generated SVG images
- **📱 QR Code Sharing** — Generate QR codes linking directly to the verification page
- **🦊 MetaMask Integration** — Seamless wallet connection and transaction signing
- **🎯 Admin Access Control** — Only the contract deployer (owner) can issue certificates

## 🏗️ Architecture

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    React Frontend    │────▶│   ethers.js v6    │────▶│  Smart Contract │
│   (Vite + React 18) │     │  (BrowserProvider)│     │  (ERC-721 NFT)  │
└─────────────────────┘     └──────────────────┘     └─────────────────┘
         │                           │                        │
         │                           │                        │
    ┌────▼────┐              ┌───────▼──────┐        ┌───────▼───────┐
    │ QR Code │              │   MetaMask   │        │  Hardhat Node │
    │ qrcode  │              │   Wallet     │        │  (localhost)  │
    └─────────┘              └──────────────┘        └───────────────┘
```

## 📁 Project Structure

```
blockchain-certificate-verification-dapp/
│
├── contracts/
│   └── Certificate.sol          # ERC-721 smart contract
│
├── scripts/
│   └── deploy.js                # Deployment script (auto-saves address)
│
├── test/
│   └── Certificate.test.js      # 15 comprehensive tests
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Footer
│   │   ├── pages/               # Home, IssueCertificate, VerifyCertificate
│   │   ├── utils/               # ethereum.js, contract.js, ipfs.js
│   │   └── contracts/           # Auto-generated ABI + address (after deploy)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── hardhat.config.js
├── package.json
└── README.md
```

## 🛠️ Tech Stack

| Layer                  | Technology                        |
| ---------------------- | --------------------------------- |
| Smart Contract         | Solidity ^0.8.27                  |
| Contract Framework     | Hardhat 2.x + Hardhat Toolbox    |
| NFT Standard           | OpenZeppelin ERC-721 + URIStorage |
| Blockchain Interaction | ethers.js v6                      |
| Frontend               | React 18 + Vite                   |
| Wallet                 | MetaMask                          |
| QR Codes               | qrcode.react                      |
| Styling                | Custom CSS (glassmorphism + dark) |

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ and npm
- **MetaMask** browser extension
- **Git**

### 1. Clone & Install

```bash
git clone https://github.com/RAJ-VARUN13/blockchain-certificate-verification-dapp.git
cd blockchain-certificate-verification-dapp

# Install smart contract dependencies
npm install
```

### 2. Compile Smart Contract

```bash
npx hardhat compile
```

### 3. Run Tests

```bash
npx hardhat test
```

Expected output: **15 passing** tests covering deployment, issuing, verification, access control, and ERC-721 interface.

### 4. Start Local Blockchain

```bash
npx hardhat node
```

Keep this terminal open — it runs a local Ethereum node at `http://127.0.0.1:8545`.

### 5. Deploy Contract

In a **new terminal**:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

The deploy script automatically saves the contract address and ABI to `frontend/src/contracts/CertificateVerification.json`.

### 6. Configure MetaMask

1. Open MetaMask → **Add Network**
2. Enter:
   - **Network Name:** Hardhat Local
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency:** ETH
3. Import a Hardhat test account using one of the private keys printed when you ran `npx hardhat node`

### 7. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Smart Contract API

### `issueCertificate()`

Issues a new certificate and mints it as an ERC-721 NFT.

| Parameter        | Type      | Description                      |
| ---------------- | --------- | -------------------------------- |
| `_certificateId` | `string`  | Unique certificate identifier    |
| `_studentName`   | `string`  | Student's full name              |
| `_courseName`    | `string`  | Course or program name           |
| `_issuer`        | `string`  | Issuing organization             |
| `_recipient`     | `address` | Wallet address to receive NFT    |
| `_tokenURI`      | `string`  | IPFS metadata URI (optional)     |

**Access:** Owner only  
**Emits:** `CertificateIssued` event

### `verifyCertificate()`

Verifies a certificate by its ID (read-only, no gas needed).

| Parameter        | Type     | Description                   |
| ---------------- | -------- | ----------------------------- |
| `_certificateId` | `string` | Certificate ID to look up     |

**Returns:** `studentName`, `courseName`, `issuer`, `issueDate`, `exists`, `tokenId`

## 🎯 Blockchain Properties

| Property         | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| **Immutability** | Certificates cannot be modified or deleted once issued         |
| **Transparency** | All certificate data is publicly verifiable on-chain           |
| **Tamper-proof** | Blockchain consensus prevents unauthorized data changes        |
| **Trustless**    | Verification requires no third party — just a certificate ID   |
| **Ownership**    | NFT certificates prove cryptographic ownership via ERC-721     |

## 🧪 Test Coverage

```
CertificateVerification
  Deployment
    ✓ should set the right owner
    ✓ should have the correct name and symbol
  Certificate Issuing
    ✓ should issue a certificate successfully
    ✓ should emit CertificateIssued event
    ✓ should mint an NFT to the recipient
    ✓ should prevent duplicate certificate IDs
    ✓ should only allow owner to issue certificates
    ✓ should reject empty certificate ID
  Certificate Verification
    ✓ should return correct certificate data
    ✓ should return exists=false for non-existent certificate
    ✓ should return certificate count correctly
    ✓ should return certificate ID by index
    ✓ should return certificate ID by token ID
  ERC-721 Interface
    ✓ should support ERC-721 interface
    ✓ should support ERC-721 Metadata interface

15 passing
```

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Built with 💜 by [Varun Raj](https://github.com/RAJ-VARUN13)

**Solidity · Hardhat · React · ethers.js · MetaMask**

</div>
