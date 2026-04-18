const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying CertificateVerification contract...\n");

  const CertificateVerification = await hre.ethers.getContractFactory(
    "CertificateVerification"
  );
  const contract = await CertificateVerification.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("✅ CertificateVerification deployed to:", contractAddress);

  // ────────────────────────────────────────────────
  // Auto-save contract address & ABI for the frontend
  // ────────────────────────────────────────────────
  const frontendDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  // Create directory if it doesn't exist
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  // Read the compiled ABI
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "Certificate.sol",
    "CertificateVerification.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Save contract config (address + ABI)
  const contractConfig = {
    address: contractAddress,
    abi: artifact.abi,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  };

  const configPath = path.join(frontendDir, "CertificateVerification.json");
  fs.writeFileSync(configPath, JSON.stringify(contractConfig, null, 2));

  console.log("📄 Contract config saved to:", configPath);
  console.log("\nDeployment complete! The frontend will automatically");
  console.log("pick up the contract address and ABI.\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
