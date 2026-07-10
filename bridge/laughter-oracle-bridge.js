"use strict";

require("dotenv").config();
const { ethers } = require("ethers");

const REQUIRED_ENV = [
  "BASE_RPC_URL",
  "ORACLE_PRIVATE_KEY",
  "DIPLOMA_CONTRACT_ADDRESS",
  "EAS_CONTRACT_ADDRESS",
  "LAUGHTER_SCHEMA_UID",
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const CONFIRMATIONS = Number(process.env.CONFIRMATIONS ?? "5");
const VALIDATE_JOKE = 1;

if (!Number.isSafeInteger(CONFIRMATIONS) || CONFIRMATIONS < 1) {
  throw new Error("CONFIRMATIONS must be a positive integer");
}

const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);
const signer = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY, provider);

const DIPLOMA_ABI = [
  "function validateReceipt(bytes32 receiptId) external",
  "function receiptValidated(bytes32 receiptId) view returns (bool)",
  "event ReceiptValidated(bytes32 indexed receiptId,address indexed oracle)",
];

const EAS_ABI = [
  "event Attested(address indexed recipient,address indexed attester,bytes32 uid,bytes32 indexed schemaUID)",
  "function getAttestation(bytes32 uid) view returns ((bytes32 uid,bytes32 schemaUID,uint64 time,uint64 expirationTime,uint64 revocationTime,bytes32 refUID,address recipient,address attester,bool revocable,bytes data))",
];

const diploma = new ethers.Contract(
  process.env.DIPLOMA_CONTRACT_ADDRESS,
  DIPLOMA_ABI,
  signer,
);

const eas = new ethers.Contract(
  process.env.EAS_CONTRACT_ADDRESS,
  EAS_ABI,
  provider,
);

const schemaCoder = new ethers.AbiCoder();

function emit(state, fields = {}) {
  console.log(JSON.stringify({ state, authority: false, ...fields }));
}

function decodeLaughterReceipt(data) {
  const [receiptId, studentWallet, action, evidenceHash] = schemaCoder.decode(
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

async function processAttestation(uid, eventLog) {
  const baseReceipt = {
    uid,
    blockNumber: eventLog.blockNumber,
    txHash: eventLog.transactionHash,
  };

  try {
    const currentBlock = await provider.getBlockNumber();
    const confirmations = currentBlock - eventLog.blockNumber + 1;

    if (confirmations < CONFIRMATIONS) {
      emit("WAITING_FOR_CONFIRMATIONS", {
        ...baseReceipt,
        confirmations,
        requiredConfirmations: CONFIRMATIONS,
      });
      return;
    }

    const attestation = await eas.getAttestation(uid);

    if (attestation.uid === ethers.ZeroHash) {
      throw new Error("Attestation not found");
    }

    if (
      attestation.schemaUID.toLowerCase() !==
      process.env.LAUGHTER_SCHEMA_UID.toLowerCase()
    ) {
      emit("IGNORED_WRONG_SCHEMA", baseReceipt);
      return;
    }

    if (attestation.revocationTime !== 0n) {
      emit("REJECTED_REVOKED", baseReceipt);
      return;
    }

    if (
      attestation.expirationTime !== 0n &&
      BigInt(Math.floor(Date.now() / 1000)) >= attestation.expirationTime
    ) {
      emit("REJECTED_EXPIRED", baseReceipt);
      return;
    }

    const decoded = decodeLaughterReceipt(attestation.data);

    if (decoded.action !== VALIDATE_JOKE) {
      emit("IGNORED_WRONG_ACTION", {
        ...baseReceipt,
        action: decoded.action,
      });
      return;
    }

    const attester = ethers.getAddress(attestation.attester);
    const recipient = ethers.getAddress(attestation.recipient);

    if (attester === decoded.studentWallet) {
      emit("REJECTED_SELF_ATTESTATION", baseReceipt);
      return;
    }

    if (recipient !== decoded.studentWallet) {
      emit("REJECTED_RECIPIENT_MISMATCH", baseReceipt);
      return;
    }

    if (await diploma.receiptValidated(decoded.receiptId)) {
      emit("ALREADY_VALIDATED", {
        ...baseReceipt,
        receiptId: decoded.receiptId,
      });
      return;
    }

    const tx = await diploma.validateReceipt(decoded.receiptId);

    emit("VALIDATION_SUBMITTED", {
      ...baseReceipt,
      receiptId: decoded.receiptId,
      validationTxHash: tx.hash,
    });

    const txReceipt = await tx.wait(CONFIRMATIONS);

    emit("VALIDATED", {
      ...baseReceipt,
      receiptId: decoded.receiptId,
      evidenceHash: decoded.evidenceHash,
      validationTxHash: tx.hash,
      validationBlockNumber: txReceipt.blockNumber,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        ...baseReceipt,
        state: "PROCESSING_FAILED",
        error: error instanceof Error ? error.message : String(error),
        authority: false,
      }),
    );
  }
}

async function backfill(fromBlock, toBlock = "latest") {
  const filter = eas.filters.Attested(
    null,
    null,
    null,
    process.env.LAUGHTER_SCHEMA_UID,
  );

  const logs = await eas.queryFilter(filter, fromBlock, toBlock);

  for (const log of logs) {
    await processAttestation(log.args.uid, log);
  }
}

async function listen() {
  const network = await provider.getNetwork();

  if (network.chainId !== 8453n) {
    throw new Error(
      `Wrong network: expected Base mainnet chain 8453, received ${network.chainId}`,
    );
  }

  emit("LISTENING", {
    chainId: network.chainId.toString(),
    diplomaContract: process.env.DIPLOMA_CONTRACT_ADDRESS,
    easContract: process.env.EAS_CONTRACT_ADDRESS,
    schemaUID: process.env.LAUGHTER_SCHEMA_UID,
    oracleAddress: signer.address,
    confirmations: CONFIRMATIONS,
  });

  const filter = eas.filters.Attested(
    null,
    null,
    null,
    process.env.LAUGHTER_SCHEMA_UID,
  );

  eas.on(filter, async (...args) => {
    const event = args.at(-1);
    await processAttestation(event.args.uid, event.log);
  });
}

async function main() {
  if (process.env.BACKFILL_FROM_BLOCK) {
    const fromBlock = Number(process.env.BACKFILL_FROM_BLOCK);
    if (!Number.isSafeInteger(fromBlock) || fromBlock < 0) {
      throw new Error("BACKFILL_FROM_BLOCK must be a non-negative integer");
    }
    await backfill(fromBlock);
  }

  await listen();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
