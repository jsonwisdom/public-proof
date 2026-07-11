import fs from 'node:fs';

const requiredFiles = [
  'public/index.html',
  'public/governance.js',
  'public/governance-state.js',
  'public/governance.css'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) throw new Error(`MISSING_REQUIRED_FILE: ${file}`);
}

const index = fs.readFileSync('public/index.html', 'utf8');
const ui = fs.readFileSync('public/governance.js', 'utf8');
const state = fs.readFileSync('public/governance-state.js', 'utf8');

for (const token of ['/governance/pr/', 'governance.js', 'governance.css']) {
  if (!index.includes(token)) throw new Error(`INDEX_BINDING_MISSING: ${token}`);
}

for (const token of ['GateCard', 'GateDetailPanel', 'InvalidationBanner', 'HeadShaGuard', 'ReceiptTimeline', 'ObservationGatePanel', 'AUTHORITY = FALSE']) {
  if (!ui.includes(token)) throw new Error(`COMPONENT_MISSING: ${token}`);
}

for (const token of ['authority: AUTHORITY', 'HEAD_MISMATCH', 'REPLAY_DETECTED', 'RECEIPT_EXPIRED']) {
  if (!state.includes(token)) throw new Error(`STATE_INVARIANT_MISSING: ${token}`);
}

console.log('UGS-8 governance UI build validation: PASS');
