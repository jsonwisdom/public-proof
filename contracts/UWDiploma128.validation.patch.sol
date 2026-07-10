// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 * PATCH ONLY — not a complete deployable contract.
 * Apply these members to the existing UWDiploma128 implementation after
 * verifying that `_receipts` and `ORACLE_ROLE` use compatible types.
 *
 * AUTHORITY_FALSE
 */

// Add near existing events:
event ReceiptValidated(bytes32 indexed receiptId, address indexed oracle);

// Add to the public read surface:
function receiptValidated(bytes32 receiptId) external view returns (bool) {
    return _receipts[receiptId].isValidated;
}

// Add to the oracle-only mutation surface:
function validateReceipt(bytes32 receiptId) external onlyRole(ORACLE_ROLE) {
    require(_receipts[receiptId].exists, "Receipt: not found");
    require(!_receipts[receiptId].isValidated, "Receipt: already validated");

    // State changes before external observation through the emitted event.
    _receipts[receiptId].isValidated = true;

    emit ReceiptValidated(receiptId, msg.sender);
}
