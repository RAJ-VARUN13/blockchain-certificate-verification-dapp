/**
 * Ethereum/MetaMask utility functions
 * Handles wallet connection, network checks, and provider management
 */

import { ethers } from 'ethers';

const HARDHAT_CHAIN_ID = '0x7a69'; // 31337 in hex
const HARDHAT_NETWORK = {
  chainId: HARDHAT_CHAIN_ID,
  chainName: 'Hardhat Local',
  rpcUrls: ['http://127.0.0.1:8545'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
};

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Connect MetaMask wallet and return { provider, signer, address }
 */
export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to use this DApp.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);

  if (accounts.length === 0) {
    throw new Error('No accounts found. Please unlock MetaMask.');
  }

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
}

/**
 * Switch MetaMask to the Hardhat local network
 */
export async function switchToHardhat() {
  if (!isMetaMaskInstalled()) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: HARDHAT_CHAIN_ID }],
    });
  } catch (switchError) {
    // Chain not added yet — add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [HARDHAT_NETWORK],
      });
    } else {
      throw switchError;
    }
  }
}

/**
 * Get current connected chain ID
 */
export async function getChainId() {
  if (!isMetaMaskInstalled()) return null;
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  return chainId;
}

/**
 * Format an Ethereum address for display (0x1234...abcd)
 */
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format a Unix timestamp to a readable date
 */
export function formatDate(timestamp) {
  if (!timestamp || timestamp === 0n) return 'N/A';
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Listen for account and chain changes
 */
export function onAccountsChanged(callback) {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on('accountsChanged', callback);
  return () => window.ethereum.removeListener('accountsChanged', callback);
}

export function onChainChanged(callback) {
  if (!isMetaMaskInstalled()) return;
  window.ethereum.on('chainChanged', callback);
  return () => window.ethereum.removeListener('chainChanged', callback);
}
