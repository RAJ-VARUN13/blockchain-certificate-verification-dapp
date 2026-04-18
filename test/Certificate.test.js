const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateVerification", function () {
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const CertificateVerification = await ethers.getContractFactory(
      "CertificateVerification"
    );
    contract = await CertificateVerification.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should have the correct name and symbol", async function () {
      expect(await contract.name()).to.equal("AcademicCertificate");
      expect(await contract.symbol()).to.equal("CERT");
    });
  });

  describe("Certificate Issuing", function () {
    it("should issue a certificate successfully", async function () {
      const tx = await contract.issueCertificate(
        "CERT-001",
        "Varun Raj",
        "Blockchain Development",
        "IIIT Ranchi",
        addr1.address,
        "ipfs://QmTest123"
      );

      const receipt = await tx.wait();

      // Verify the certificate was stored correctly
      const [studentName, courseName, issuer, issueDate, exists, tokenId] =
        await contract.verifyCertificate("CERT-001");

      expect(studentName).to.equal("Varun Raj");
      expect(courseName).to.equal("Blockchain Development");
      expect(issuer).to.equal("IIIT Ranchi");
      expect(exists).to.be.true;
      expect(tokenId).to.equal(1n);
      expect(issueDate).to.be.greaterThan(0n);
    });

    it("should emit CertificateIssued event", async function () {
      await expect(
        contract.issueCertificate(
          "CERT-002",
          "John Doe",
          "Smart Contract Security",
          "MIT",
          addr1.address,
          ""
        )
      )
        .to.emit(contract, "CertificateIssued")
        .withArgs(
          "CERT-002",
          "John Doe",
          "Smart Contract Security",
          "MIT",
          (issueDate) => issueDate > 0n,
          1n
        );
    });

    it("should mint an NFT to the recipient", async function () {
      await contract.issueCertificate(
        "CERT-003",
        "Alice Smith",
        "DeFi Fundamentals",
        "Stanford",
        addr1.address,
        "ipfs://QmTestMetadata"
      );

      expect(await contract.ownerOf(1)).to.equal(addr1.address);
      expect(await contract.tokenURI(1)).to.equal("ipfs://QmTestMetadata");
    });

    it("should prevent duplicate certificate IDs", async function () {
      await contract.issueCertificate(
        "CERT-004",
        "Bob",
        "Course A",
        "Issuer A",
        addr1.address,
        ""
      );

      await expect(
        contract.issueCertificate(
          "CERT-004",
          "Charlie",
          "Course B",
          "Issuer B",
          addr2.address,
          ""
        )
      ).to.be.revertedWith("Certificate already exists");
    });

    it("should only allow owner to issue certificates", async function () {
      await expect(
        contract
          .connect(addr1)
          .issueCertificate(
            "CERT-005",
            "Eve",
            "Course C",
            "Issuer C",
            addr2.address,
            ""
          )
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("should reject empty certificate ID", async function () {
      await expect(
        contract.issueCertificate(
          "",
          "Student",
          "Course",
          "Issuer",
          addr1.address,
          ""
        )
      ).to.be.revertedWith("Certificate ID cannot be empty");
    });
  });

  describe("Certificate Verification", function () {
    beforeEach(async function () {
      await contract.issueCertificate(
        "CERT-100",
        "Varun Raj",
        "Web3 Engineering",
        "IIIT Ranchi",
        addr1.address,
        "ipfs://QmSampleHash"
      );
    });

    it("should return correct certificate data", async function () {
      const [studentName, courseName, issuer, issueDate, exists, tokenId] =
        await contract.verifyCertificate("CERT-100");

      expect(studentName).to.equal("Varun Raj");
      expect(courseName).to.equal("Web3 Engineering");
      expect(issuer).to.equal("IIIT Ranchi");
      expect(exists).to.be.true;
      expect(tokenId).to.equal(1n);
    });

    it("should return exists=false for non-existent certificate", async function () {
      const [, , , , exists] = await contract.verifyCertificate("FAKE-ID");
      expect(exists).to.be.false;
    });

    it("should return certificate count correctly", async function () {
      expect(await contract.getCertificateCount()).to.equal(1n);

      await contract.issueCertificate(
        "CERT-101",
        "Student 2",
        "Course 2",
        "Issuer 2",
        addr2.address,
        ""
      );

      expect(await contract.getCertificateCount()).to.equal(2n);
    });

    it("should return certificate ID by index", async function () {
      expect(await contract.getCertificateIdByIndex(0)).to.equal("CERT-100");
    });

    it("should return certificate ID by token ID", async function () {
      expect(await contract.getCertificateByTokenId(1)).to.equal("CERT-100");
    });
  });

  describe("ERC-721 Interface", function () {
    it("should support ERC-721 interface", async function () {
      // ERC-721 interface ID
      expect(await contract.supportsInterface("0x80ac58cd")).to.be.true;
    });

    it("should support ERC-721 Metadata interface", async function () {
      // ERC721Metadata interface ID
      expect(await contract.supportsInterface("0x5b5e139f")).to.be.true;
    });
  });
});
