// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificateVerification
 * @dev A decentralized certificate verification system with NFT (ERC-721) support.
 * Organizations can issue tamper-proof certificates on blockchain.
 * Each certificate is minted as an NFT with optional IPFS metadata.
 */
contract CertificateVerification is ERC721, ERC721URIStorage, Ownable {
    /// @dev Counter for generating unique NFT token IDs
    uint256 private _nextTokenId;

    /// @dev Structure representing a certificate
    struct Certificate {
        string studentName;
        string courseName;
        string issuer;
        uint256 issueDate;
        bool exists;
        uint256 tokenId;
    }

    /// @dev Mapping from certificate ID (string) to Certificate data
    mapping(string => Certificate) private certificates;

    /// @dev Mapping from NFT token ID to certificate ID (for reverse lookup)
    mapping(uint256 => string) private tokenToCertificateId;

    /// @dev Array of all certificate IDs for enumeration
    string[] private allCertificateIds;

    // ──────────────────────────────────────────────
    // Events
    // ──────────────────────────────────────────────

    event CertificateIssued(
        string certificateId,
        string studentName,
        string courseName,
        string issuer,
        uint256 issueDate,
        uint256 tokenId
    );

    // ──────────────────────────────────────────────
    // Constructor
    // ──────────────────────────────────────────────

    constructor()
        ERC721("AcademicCertificate", "CERT")
        Ownable(msg.sender)
    {
        _nextTokenId = 1;
    }

    // ──────────────────────────────────────────────
    // Core Functions
    // ──────────────────────────────────────────────

    /**
     * @notice Issue a new certificate and mint it as an NFT
     * @param _certificateId Unique identifier for the certificate
     * @param _studentName Name of the student
     * @param _courseName Name of the course
     * @param _issuer Name of the issuing organization
     * @param _recipient Address to receive the NFT certificate
     * @param _tokenURI IPFS URI for the certificate metadata
     */
    function issueCertificate(
        string memory _certificateId,
        string memory _studentName,
        string memory _courseName,
        string memory _issuer,
        address _recipient,
        string memory _tokenURI
    ) public onlyOwner {
        require(!certificates[_certificateId].exists, "Certificate already exists");
        require(bytes(_certificateId).length > 0, "Certificate ID cannot be empty");
        require(bytes(_studentName).length > 0, "Student name cannot be empty");
        require(bytes(_courseName).length > 0, "Course name cannot be empty");
        require(bytes(_issuer).length > 0, "Issuer cannot be empty");
        require(_recipient != address(0), "Recipient cannot be zero address");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        // Mint NFT to recipient
        _safeMint(_recipient, tokenId);

        // Set IPFS metadata URI if provided
        if (bytes(_tokenURI).length > 0) {
            _setTokenURI(tokenId, _tokenURI);
        }

        // Store certificate data on-chain
        certificates[_certificateId] = Certificate({
            studentName: _studentName,
            courseName: _courseName,
            issuer: _issuer,
            issueDate: block.timestamp,
            exists: true,
            tokenId: tokenId
        });

        // Reverse mapping for token → certificate lookup
        tokenToCertificateId[tokenId] = _certificateId;

        // Add to enumeration array
        allCertificateIds.push(_certificateId);

        emit CertificateIssued(
            _certificateId,
            _studentName,
            _courseName,
            _issuer,
            block.timestamp,
            tokenId
        );
    }

    /**
     * @notice Verify a certificate by its ID
     * @param _certificateId The certificate ID to look up
     * @return studentName The student's name
     * @return courseName The course name
     * @return issuer The issuing organization
     * @return issueDate The timestamp when the certificate was issued
     * @return exists Whether the certificate exists
     * @return tokenId The NFT token ID associated with this certificate
     */
    function verifyCertificate(string memory _certificateId)
        public
        view
        returns (
            string memory studentName,
            string memory courseName,
            string memory issuer,
            uint256 issueDate,
            bool exists,
            uint256 tokenId
        )
    {
        Certificate memory cert = certificates[_certificateId];
        return (
            cert.studentName,
            cert.courseName,
            cert.issuer,
            cert.issueDate,
            cert.exists,
            cert.tokenId
        );
    }

    /**
     * @notice Get total number of certificates issued
     * @return count The total certificate count
     */
    function getCertificateCount() public view returns (uint256 count) {
        return allCertificateIds.length;
    }

    /**
     * @notice Get certificate ID by its index
     * @param index Index in the certificates array
     * @return certificateId The certificate ID at the given index
     */
    function getCertificateIdByIndex(uint256 index)
        public
        view
        returns (string memory certificateId)
    {
        require(index < allCertificateIds.length, "Index out of bounds");
        return allCertificateIds[index];
    }

    /**
     * @notice Get certificate ID linked to a specific NFT token
     * @param _tokenId The NFT token ID
     * @return certificateId The associated certificate ID
     */
    function getCertificateByTokenId(uint256 _tokenId)
        public
        view
        returns (string memory certificateId)
    {
        require(bytes(tokenToCertificateId[_tokenId]).length > 0, "No certificate for this token");
        return tokenToCertificateId[_tokenId];
    }

    // ──────────────────────────────────────────────
    // Overrides (required by Solidity for ERC721URIStorage)
    // ──────────────────────────────────────────────

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
