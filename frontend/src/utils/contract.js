/**
 * Contract utility — loads the deployed contract address and ABI
 * The deploy script auto-saves this config to ../contracts/CertificateVerification.json
 */

import { ethers } from 'ethers';
import contractConfig from '../contracts/CertificateVerification.json';

const isDeployed = contractConfig.address && contractConfig.address.length > 0;

/**
 * Get a read-only contract instance (no signer needed)
 */
export function getReadOnlyContract(provider) {
  if (!isDeployed) {
    throw new Error('Contract not deployed. Run: npx hardhat run scripts/deploy.js --network localhost');
  }
  return new ethers.Contract(contractConfig.address, contractConfig.abi, provider);
}

/**
 * Get a writable contract instance (signer required for transactions)
 */
export function getContract(signer) {
  if (!isDeployed) {
    throw new Error('Contract not deployed. Run: npx hardhat run scripts/deploy.js --network localhost');
  }
  return new ethers.Contract(contractConfig.address, contractConfig.abi, signer);
}

/**
 * Get the contract address
 */
export function getContractAddress() {
  return isDeployed ? contractConfig.address : null;
}

/**
 * Check if contract has been deployed (config file has a valid address)
 */
export function isContractDeployed() {
  return isDeployed;
}
