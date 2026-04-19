/**
 * IPFS Metadata Utility
 * Generates ERC-721 compatible metadata JSON for certificate NFTs.
 * 
 * In production, you'd upload this to IPFS via Pinata, Infura, or web3.storage.
 * For local development, this generates the metadata structure that would be stored.
 */

/**
 * Generate ERC-721 compatible metadata for a certificate
 * @param {Object} params Certificate parameters
 * @returns {Object} ERC-721 metadata object
 */
export function generateCertificateMetadata({
  certificateId,
  studentName,
  courseName,
  issuer,
  issueDate = new Date().toISOString(),
}) {
  return {
    name: `${courseName} Certificate - ${studentName}`,
    description: `This is an official certificate issued by ${issuer} to ${studentName} for completing ${courseName}. Certificate ID: ${certificateId}. This certificate is permanently stored on the Ethereum blockchain as an ERC-721 NFT.`,
    image: generateCertificateImage(studentName, courseName, issuer),
    external_url: `${window.location.origin}/verify?id=${encodeURIComponent(certificateId)}`,
    attributes: [
      {
        trait_type: 'Student Name',
        value: studentName,
      },
      {
        trait_type: 'Course',
        value: courseName,
      },
      {
        trait_type: 'Issuer',
        value: issuer,
      },
      {
        trait_type: 'Certificate ID',
        value: certificateId,
      },
      {
        display_type: 'date',
        trait_type: 'Issue Date',
        value: Math.floor(new Date(issueDate).getTime() / 1000),
      },
      {
        trait_type: 'Type',
        value: 'Academic Certificate',
      },
    ],
  };
}

/**
 * Generate a data URI SVG image for the certificate
 * This serves as the NFT preview image
 */
function generateCertificateImage(studentName, courseName, issuer) {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a1a"/>
      <stop offset="100%" style="stop-color:#1a1a3e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00d4ff"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bg)" rx="16"/>
  <rect x="20" y="20" width="560" height="360" fill="none" stroke="url(#accent)" stroke-width="1" rx="12" opacity="0.3"/>
  <text x="300" y="60" fill="url(#accent)" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="bold" letter-spacing="4">BLOCKCHAIN CERTIFICATE</text>
  <line x1="200" y1="80" x2="400" y2="80" stroke="url(#accent)" stroke-width="1" opacity="0.5"/>
  <text x="300" y="140" fill="#e8e8f0" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="bold">${escapeXml(studentName)}</text>
  <text x="300" y="180" fill="#9090b0" text-anchor="middle" font-family="Arial,sans-serif" font-size="14">has successfully completed</text>
  <text x="300" y="220" fill="#00d4ff" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="bold">${escapeXml(courseName)}</text>
  <text x="300" y="290" fill="#9090b0" text-anchor="middle" font-family="Arial,sans-serif" font-size="12">Issued by</text>
  <text x="300" y="315" fill="#e8e8f0" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="bold">${escapeXml(issuer)}</text>
  <text x="300" y="365" fill="#606080" text-anchor="middle" font-family="Arial,sans-serif" font-size="10">Verified on Ethereum Blockchain · ERC-721 NFT</text>
</svg>`.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Simulate uploading metadata to IPFS (returns a mock IPFS URI for local dev)
 * In production, replace this with actual Pinata/web3.storage upload
 */
export async function uploadToIPFS(metadata) {
  // In production, you would use:
  // const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
  //   method: 'POST',
  //   headers: { 'Authorization': 'Bearer YOUR_PINATA_JWT', 'Content-Type': 'application/json' },
  //   body: JSON.stringify(metadata),
  // });
  // const { IpfsHash } = await response.json();
  // return `ipfs://${IpfsHash}`;

  // For local development, we create a data URI with the metadata
  const json = JSON.stringify(metadata);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return `data:application/json;base64,${base64}`;
}
