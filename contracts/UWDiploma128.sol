// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract UWDiploma128 is ERC721, AccessControl {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    uint256 private _receiptCounter;
    uint256 private _tokenCounter;

    struct ComedyReceipt {
        bytes32 receiptHash;
        string ipfsCid;
        address studentWallet;
        bool isValidated;
        bool exists;
    }

    mapping(bytes32 => ComedyReceipt) private _receipts;
    mapping(bytes32 => bool) public diplomaMinted;

    event ReceiptRegistered(
        bytes32 indexed receiptId,
        bytes32 indexed receiptHash,
        address indexed studentWallet
    );
    event ReceiptValidated(bytes32 indexed receiptId, address indexed oracle);
    event DiplomaMinted(
        uint256 indexed tokenId,
        bytes32 indexed receiptId,
        address indexed student
    );

    constructor() ERC721("University of Wisdom - COM128 Diploma", "UW-C128") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function registerReceipt(
        bytes32 receiptHash,
        string calldata ipfsCid,
        address studentWallet
    ) external onlyRole(REGISTRAR_ROLE) returns (bytes32 receiptId) {
        require(receiptHash != bytes32(0), "Receipt: empty hash");
        require(studentWallet != address(0), "Receipt: zero student");
        require(studentWallet != msg.sender, "Receipt: self deal");

        unchecked {
            _receiptCounter += 1;
        }

        receiptId = keccak256(
            abi.encode(
                block.chainid,
                address(this),
                _receiptCounter,
                receiptHash,
                studentWallet
            )
        );

        require(!_receipts[receiptId].exists, "Receipt: already exists");

        _receipts[receiptId] = ComedyReceipt({
            receiptHash: receiptHash,
            ipfsCid: ipfsCid,
            studentWallet: studentWallet,
            isValidated: false,
            exists: true
        });

        emit ReceiptRegistered(receiptId, receiptHash, studentWallet);
    }

    function validateReceipt(bytes32 receiptId) external onlyRole(ORACLE_ROLE) {
        ComedyReceipt storage receipt = _receipts[receiptId];
        require(receipt.exists, "Receipt: not found");
        require(msg.sender != receipt.studentWallet, "Receipt: self validation");
        require(!receipt.isValidated, "Receipt: already validated");

        receipt.isValidated = true;

        emit ReceiptValidated(receiptId, msg.sender);
    }

    function receiptValidated(bytes32 receiptId) external view returns (bool) {
        return _receipts[receiptId].isValidated;
    }

    function receiptExists(bytes32 receiptId) external view returns (bool) {
        return _receipts[receiptId].exists;
    }

    function receiptStudent(bytes32 receiptId) external view returns (address) {
        return _receipts[receiptId].studentWallet;
    }

    function receiptHashOf(bytes32 receiptId) external view returns (bytes32) {
        return _receipts[receiptId].receiptHash;
    }

    function receiptIpfsCid(bytes32 receiptId) external view returns (string memory) {
        return _receipts[receiptId].ipfsCid;
    }

    function mintDiploma(bytes32 receiptId) external returns (uint256 tokenId) {
        ComedyReceipt storage receipt = _receipts[receiptId];
        require(receipt.exists, "Receipt: not found");
        require(receipt.isValidated, "Receipt: not validated");
        require(!diplomaMinted[receiptId], "Diploma: already minted");
        require(msg.sender == receipt.studentWallet, "Caller not student");

        diplomaMinted[receiptId] = true;

        unchecked {
            _tokenCounter += 1;
        }
        tokenId = _tokenCounter;

        _safeMint(msg.sender, tokenId);

        emit DiplomaMinted(tokenId, receiptId, msg.sender);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
