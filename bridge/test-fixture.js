"use strict";

const assert = require("node:assert/strict");
const { ethers } = require("ethers");

const VALIDATE_JOKE = 1;
const WRONG_ACTION = 2;

const STUDENT = "0x1111111111111111111111111111111111111111";
const ORACLE = "0x2222222222222222222222222222222222222222";
const OTHER = "0x3333333333333333333333333333333333333333";
const RECEIPT_ID = ethers.keccak256(ethers.toUtf8Bytes("fixture-receipt-001"));
const EVIDENCE_HASH = ethers.keccak256(ethers.toUtf8Bytes("fixture-evidence-001"));

const coder = ethers.AbiCoder.defaultAbiCoder();

function decodeLaughterReceipt(data) {
  const [receiptId, studentWallet, action, evidenceHash] = coder.decode(
    ["bytes32", "address", "uint8", "bytes32"],
    data,
  );

  return {
    receiptId,
    studentWallet: ethers.getAddress(studentWallet),
    action: Number(action),
    evidenceHash,
  };
}

function evaluateFixture({
  attestation,
  expectedSchemaUID,
  currentBlock,
  requiredConfirmations,
  nowSeconds,
  alreadyValidated,
}) {
  const confirmations = currentBlock - attestation.blockNumber + 1;

  if (confirmations < requiredConfirmations) {
    return "WAITING_FOR_CONFIRMATIONS";
  }

  if (attestation.schemaUID.toLowerCase() !== expectedSchemaUID.toLowerCase()) {
    return "IGNORED_WRONG_SCHEMA";
  }

  if (attestation.revocationTime !== 0n) {
    return "REJECTED_REVOKED";
  }

  if (
    attestation.expirationTime !== 0n &&
    BigInt(nowSeconds) >= attestation.expirationTime
  ) {
    return "REJECTED_EXPIRED";
  }

  const decoded = decodeLaughterReceipt(attestation.data);

  if (decoded.action !== VALIDATE_JOKE) {
    return "IGNORED_WRONG_ACTION";
  }

  const attester = ethers.getAddress(attestation.attester);
  const recipient = ethers.getAddress(attestation.recipient);

  if (attester === decoded.studentWallet) {
    return "REJECTED_SELF_ATTESTATION";
  }

  if (recipient !== decoded.studentWallet) {
    return "REJECTED_RECIPIENT_MISMATCH";
  }

  if (alreadyValidated) {
    return "ALREADY_VALIDATED";
  }

  return "ELIGIBLE_FOR_VALIDATE_RECEIPT";
}

function encodeData({ action = VALIDATE_JOKE, studentWallet = STUDENT } = {}) {
  return coder.encode(
    ["bytes32", "address", "uint8", "bytes32"],
    [RECEIPT_ID, studentWallet, action, EVIDENCE_HASH],
  );
}

const SCHEMA_UID = ethers.keccak256(ethers.toUtf8Bytes("laughter-schema-v0.1"));
const OTHER_SCHEMA_UID = ethers.keccak256(ethers.toUtf8Bytes("other-schema"));
const NOW = 1_750_000_000;

function baseAttestation(overrides = {}) {
  return {
    schemaUID: SCHEMA_UID,
    attester: ORACLE,
    recipient: STUDENT,
    data: encodeData(),
    revocationTime: 0n,
    expirationTime: 0n,
    blockNumber: 100,
    ...overrides,
  };
}

function runCase(name, expected, overrides = {}, context = {}) {
  const result = evaluateFixture({
    attestation: baseAttestation(overrides),
    expectedSchemaUID: SCHEMA_UID,
    currentBlock: 110,
    requiredConfirmations: 5,
    nowSeconds: NOW,
    alreadyValidated: false,
    ...context,
  });

  assert.equal(result, expected, `${name}: expected ${expected}, received ${result}`);
  console.log(JSON.stringify({ test: name, result: "PASS", state: result, authority: false }));
}

const decoded = decodeLaughterReceipt(encodeData());
assert.equal(decoded.receiptId, RECEIPT_ID);
assert.equal(decoded.studentWallet, ethers.getAddress(STUDENT));
assert.equal(decoded.action, VALIDATE_JOKE);
assert.equal(decoded.evidenceHash, EVIDENCE_HASH);
console.log(JSON.stringify({ test: "decode", result: "PASS", authority: false }));

runCase("eligible", "ELIGIBLE_FOR_VALIDATE_RECEIPT");
runCase(
  "waiting-confirmations",
  "WAITING_FOR_CONFIRMATIONS",
  { blockNumber: 109 },
  { currentBlock: 110, requiredConfirmations: 5 },
);
runCase("wrong-schema", "IGNORED_WRONG_SCHEMA", { schemaUID: OTHER_SCHEMA_UID });
runCase("revoked", "REJECTED_REVOKED", { revocationTime: 1n });
runCase("expired", "REJECTED_EXPIRED", { expirationTime: BigInt(NOW) });
runCase(
  "wrong-action",
  "IGNORED_WRONG_ACTION",
  { data: encodeData({ action: WRONG_ACTION }) },
);
runCase(
  "self-attestation",
  "REJECTED_SELF_ATTESTATION",
  { attester: STUDENT },
);
runCase(
  "recipient-mismatch",
  "REJECTED_RECIPIENT_MISMATCH",
  { recipient: OTHER },
);
runCase(
  "already-validated",
  "ALREADY_VALIDATED",
  {},
  { alreadyValidated: true },
);

console.log(
  JSON.stringify({
    fixture_suite: "PASS",
    cases: 10,
    live_keys_used: false,
    live_rpc_used: false,
    contract_transaction_sent: false,
    authority: false,
  }),
);
