// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/UWDiploma128.sol";

contract UWDiploma128Test is Test {
    UWDiploma128 internal diploma;

    address internal admin = address(0xA11CE);
    address internal registrar = address(0xB0B);
    address internal oracle = address(0xCAFE);
    address internal student = address(0xD00D);
    address internal outsider = address(0xE1E1);

    bytes32 internal constant RECEIPT_HASH = keccak256("joke-receipt");
    string internal constant CID = "ipfs://bafy-test-cid";

    function setUp() public {
        vm.prank(admin);
        diploma = new UWDiploma128();

        vm.startPrank(admin);
        diploma.grantRole(diploma.REGISTRAR_ROLE(), registrar);
        diploma.grantRole(diploma.ORACLE_ROLE(), oracle);
        vm.stopPrank();
    }

    function _register(address studentWallet) internal returns (bytes32 receiptId) {
        vm.prank(registrar);
        receiptId = diploma.registerReceipt(RECEIPT_HASH, CID, studentWallet);
    }

    function testAdminCanGrantRegistrarAndOracleRoles() public view {
        assertTrue(diploma.hasRole(diploma.REGISTRAR_ROLE(), registrar));
        assertTrue(diploma.hasRole(diploma.ORACLE_ROLE(), oracle));
    }

    function testUnauthorizedAccountCannotRegisterReceipt() public {
        vm.prank(outsider);
        vm.expectRevert();
        diploma.registerReceipt(RECEIPT_HASH, CID, student);
    }

    function testRegistrarCanRegisterReceiptAndExposeCanonicalId() public {
        bytes32 receiptId = _register(student);

        assertTrue(receiptId != bytes32(0));
        assertTrue(diploma.receiptExists(receiptId));
        assertEq(diploma.receiptStudent(receiptId), student);
        assertEq(diploma.receiptHashOf(receiptId), RECEIPT_HASH);
        assertEq(diploma.receiptIpfsCid(receiptId), CID);
    }

    function testRegistrarCannotSelfDeal() public {
        vm.prank(registrar);
        vm.expectRevert(bytes("Receipt: self deal"));
        diploma.registerReceipt(RECEIPT_HASH, CID, registrar);
    }

    function testStudentCannotSelfValidateEvenWithOracleRole() public {
        bytes32 receiptId = _register(student);
        bytes32 oracleRole = diploma.ORACLE_ROLE();

        vm.prank(admin);
        diploma.grantRole(oracleRole, student);

        vm.prank(student);
        vm.expectRevert(bytes("Receipt: self validation"));
        diploma.validateReceipt(receiptId);
    }

    function testUnauthorizedAccountCannotValidate() public {
        bytes32 receiptId = _register(student);

        vm.prank(outsider);
        vm.expectRevert();
        diploma.validateReceipt(receiptId);
    }

    function testOracleCanValidateExistingReceipt() public {
        bytes32 receiptId = _register(student);

        vm.prank(oracle);
        diploma.validateReceipt(receiptId);

        assertTrue(diploma.receiptValidated(receiptId));
    }

    function testMissingReceiptValidationReverts() public {
        vm.prank(oracle);
        vm.expectRevert(bytes("Receipt: not found"));
        diploma.validateReceipt(keccak256("missing"));
    }

    function testRevalidationReverts() public {
        bytes32 receiptId = _register(student);

        vm.prank(oracle);
        diploma.validateReceipt(receiptId);

        vm.prank(oracle);
        vm.expectRevert(bytes("Receipt: already validated"));
        diploma.validateReceipt(receiptId);
    }

    function testMintBeforeValidationReverts() public {
        bytes32 receiptId = _register(student);

        vm.prank(student);
        vm.expectRevert(bytes("Receipt: not validated"));
        diploma.mintDiploma(receiptId);
    }

    function testMintAfterValidationSucceedsOnce() public {
        bytes32 receiptId = _register(student);

        vm.prank(oracle);
        diploma.validateReceipt(receiptId);

        vm.prank(student);
        uint256 tokenId = diploma.mintDiploma(receiptId);

        assertEq(tokenId, 1);
        assertEq(diploma.ownerOf(tokenId), student);
        assertTrue(diploma.diplomaMinted(receiptId));
    }

    function testDoubleMintAndWrongStudentRevert() public {
        bytes32 receiptId = _register(student);

        vm.prank(oracle);
        diploma.validateReceipt(receiptId);

        vm.prank(outsider);
        vm.expectRevert(bytes("Caller not student"));
        diploma.mintDiploma(receiptId);

        vm.prank(student);
        diploma.mintDiploma(receiptId);

        vm.prank(student);
        vm.expectRevert(bytes("Diploma: already minted"));
        diploma.mintDiploma(receiptId);
    }
}
