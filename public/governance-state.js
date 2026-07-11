export const AUTHORITY = false;

export const GATES = [
  { id: 1, key: 'REVIEWED', title: 'Independent Review', role: 'INDEPENDENT_REVIEWER' },
  { id: 2, key: 'DEPLOYER_DECLARED', title: 'Public Deployer / Safe', role: 'OPERATOR' },
  { id: 3, key: 'SIGNER_REVIEWED', title: 'Signing Method Review', role: 'SIGNER_REVIEWER' },
  { id: 4, key: 'FRESH_CI', title: 'Fresh CI / HEAD', role: 'CI_WITNESS' },
  { id: 5, key: 'MERGE_AUTHORIZED', title: 'Explicit Merge Authorization', role: 'HUMAN_AUTHORIZER' },
  { id: 6, key: 'MERGE_OBSERVED', title: 'Merge Observed', role: 'OBSERVER' },
  { id: 7, key: 'SIMULATION_PASSED', title: 'Transaction Simulation', role: 'SIMULATION_WITNESS' },
  { id: 8, key: 'BROADCAST_AUTHORIZED', title: 'Broadcast Authorization', role: 'HUMAN_AUTHORIZER' },
  { id: 9, key: 'BROADCAST_OBSERVED', title: 'Broadcast Observed', role: 'OBSERVER' },
  { id: 10, key: 'DEPLOYED_OBSERVED', title: 'Deployment Observed', role: 'OBSERVER' }
];

export function normalizeReceipt(receipt) {
  return {
    gateId: Number(receipt.gateId),
    signerRole: String(receipt.signerRole || ''),
    signerIdentifier: String(receipt.signerIdentifier || ''),
    headSha: String(receipt.headSha || '').toLowerCase(),
    priorReceiptsHash: String(receipt.priorReceiptsHash || ''),
    timestamp: Number(receipt.timestamp || 0),
    expiresAt: receipt.expiresAt == null ? null : Number(receipt.expiresAt),
    nonce: String(receipt.nonce || ''),
    receiptHash: String(receipt.receiptHash || ''),
    rejectionReason: receipt.rejectionReason ? String(receipt.rejectionReason) : null,
    authority: false
  };
}

export function deriveGovernanceState({ expectedHeadSha, observedHeadSha, receipts = [], now = Date.now() / 1000 }) {
  const expected = String(expectedHeadSha || '').toLowerCase();
  const observed = String(observedHeadSha || '').toLowerCase();
  const headMatches = expected.length >= 7 && expected === observed;
  const normalized = receipts.map(normalizeReceipt).sort((a, b) => a.gateId - b.gateId || a.timestamp - b.timestamp);
  const seenNonces = new Set();
  const seenHashes = new Set();
  const gates = [];
  let progressionOpen = headMatches;
  let currentGate = 1;

  for (const gate of GATES) {
    const receipt = normalized.find((item) => item.gateId === gate.id);
    let status = 'PENDING';
    let reason = null;

    if (!headMatches) {
      status = 'BLACK';
      reason = 'HEAD_MISMATCH';
    } else if (!progressionOpen) {
      status = 'BLACK';
      reason = 'PRIOR_GATE_INVALID';
    } else if (!receipt) {
      status = 'PENDING';
      currentGate = gate.id;
      progressionOpen = false;
    } else if (receipt.rejectionReason) {
      status = 'BLACK';
      reason = receipt.rejectionReason;
      progressionOpen = false;
    } else if (receipt.signerRole !== gate.role) {
      status = 'BLACK';
      reason = 'ROLE_NOT_PERMITTED';
      progressionOpen = false;
    } else if (receipt.headSha !== expected) {
      status = 'BLACK';
      reason = 'HEAD_MISMATCH';
      progressionOpen = false;
    } else if (receipt.expiresAt !== null && receipt.expiresAt <= now) {
      status = 'GREY';
      reason = 'RECEIPT_EXPIRED';
      progressionOpen = false;
    } else if (!receipt.nonce || seenNonces.has(receipt.nonce) || !receipt.receiptHash || seenHashes.has(receipt.receiptHash)) {
      status = 'BLACK';
      reason = 'REPLAY_DETECTED';
      progressionOpen = false;
    } else {
      status = 'GREEN';
      seenNonces.add(receipt.nonce);
      seenHashes.add(receipt.receiptHash);
      currentGate = Math.min(10, gate.id + 1);
    }

    gates.push({ ...gate, status, reason, receipt: receipt || null, authority: false });
  }

  return {
    authority: AUTHORITY,
    expectedHeadSha: expected,
    observedHeadSha: observed,
    headMatches,
    currentGate,
    progressionBlocked: gates.some((gate) => gate.status === 'BLACK' || gate.status === 'GREY'),
    workflowComplete: gates.every((gate) => gate.status === 'GREEN'),
    broadcastAuthorized: gates[7]?.status === 'GREEN',
    broadcastObserved: gates[8]?.status === 'GREEN',
    deploymentObserved: gates[9]?.status === 'GREEN',
    gates,
    receipts: normalized
  };
}
