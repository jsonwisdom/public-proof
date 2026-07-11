import assert from 'node:assert/strict';
import { AUTHORITY, GATES, deriveGovernanceState } from '../public/governance-state.js';

const sha = '680cca5d2aea0177051e73da735c9461232f4559';
const base = 1_800_000_000;
const receipts = GATES.map((gate, index) => ({
  gateId: gate.id,
  signerRole: gate.role,
  signerIdentifier: `signer-${gate.id}`,
  headSha: sha,
  priorReceiptsHash: index === 0 ? 'GENESIS' : `prior-${gate.id - 1}`,
  timestamp: base + gate.id,
  expiresAt: base + 86_400,
  nonce: `nonce-${gate.id}`,
  receiptHash: `receipt-${gate.id}`,
  authority: false
}));

assert.equal(AUTHORITY, false);

const complete = deriveGovernanceState({ expectedHeadSha: sha, observedHeadSha: sha, receipts, now: base + 100 });
assert.equal(complete.workflowComplete, true);
assert.equal(complete.deploymentObserved, true);
assert.equal(complete.authority, false);
assert.ok(complete.gates.every((gate) => gate.status === 'GREEN'));

const mismatch = deriveGovernanceState({ expectedHeadSha: sha, observedHeadSha: 'deadbeef', receipts, now: base + 100 });
assert.equal(mismatch.headMatches, false);
assert.equal(mismatch.gates[0].reason, 'HEAD_MISMATCH');
assert.equal(mismatch.authority, false);

const expiredReceipts = receipts.map((receipt) => ({ ...receipt }));
expiredReceipts[2].expiresAt = base + 10;
const expired = deriveGovernanceState({ expectedHeadSha: sha, observedHeadSha: sha, receipts: expiredReceipts, now: base + 100 });
assert.equal(expired.gates[2].status, 'GREY');
assert.equal(expired.gates[3].reason, 'PRIOR_GATE_INVALID');
assert.equal(expired.receipts.length, 10);

const replayReceipts = receipts.map((receipt) => ({ ...receipt }));
replayReceipts[4].nonce = replayReceipts[3].nonce;
const replay = deriveGovernanceState({ expectedHeadSha: sha, observedHeadSha: sha, receipts: replayReceipts, now: base + 100 });
assert.equal(replay.gates[4].reason, 'REPLAY_DETECTED');
assert.equal(replay.workflowComplete, false);

const missingGate = deriveGovernanceState({ expectedHeadSha: sha, observedHeadSha: sha, receipts: receipts.slice(0, 4), now: base + 100 });
assert.equal(missingGate.currentGate, 5);
assert.equal(missingGate.gates[4].status, 'PENDING');
assert.equal(missingGate.gates[5].status, 'BLACK');

console.log('UGS-8 governance state tests: PASS');
