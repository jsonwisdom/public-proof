import React, { useEffect, useMemo, useState } from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
import { deriveGovernanceState } from './governance-state.js';

const h = React.createElement;
const REPO = 'jsonwisdom/public-proof';
const PR_NUMBER = 4;

function shaFromPath() {
  const match = location.pathname.match(/^\/governance\/pr\/([0-9a-fA-F]{7,40})\/?$/);
  return match ? match[1].toLowerCase() : null;
}

async function fetchObservedHead() {
  const response = await fetch(`https://api.github.com/repos/${REPO}/pulls/${PR_NUMBER}`, {
    headers: { Accept: 'application/vnd.github+json' }
  });
  if (!response.ok) throw new Error(`GITHUB_HEAD_FETCH_FAILED_${response.status}`);
  const payload = await response.json();
  return String(payload?.head?.sha || '').toLowerCase();
}

async function bindPortalCourtroomLink() {
  const link = document.querySelector('a[href^="/governance/pr/"]');
  if (!link) return;
  link.setAttribute('aria-disabled', 'true');
  link.textContent = 'Courtroom · checking HEAD';
  try {
    const liveHead = await fetchObservedHead();
    if (!/^[0-9a-f]{40}$/.test(liveHead)) throw new Error('LIVE_HEAD_INVALID');
    link.href = `/governance/pr/${liveHead}`;
    link.textContent = 'Courtroom';
    link.removeAttribute('aria-disabled');
  } catch (error) {
    link.removeAttribute('href');
    link.textContent = 'Courtroom · HEAD unobserved';
    link.title = String(error?.message || error);
  }
}

export function useGovernanceState(expectedHeadSha) {
  const [observedHeadSha, setObservedHeadSha] = useState('');
  const [receipts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchObservedHead()
      .then((sha) => active && setObservedHeadSha(sha))
      .catch((reason) => active && setError(String(reason?.message || reason)));
    return () => { active = false; };
  }, [expectedHeadSha]);

  const state = useMemo(() => deriveGovernanceState({
    expectedHeadSha,
    observedHeadSha,
    receipts,
    now: Date.now() / 1000
  }), [expectedHeadSha, observedHeadSha, receipts]);

  return { ...state, loading: !observedHeadSha && !error, error };
}

export function ReplayModeBadge() {
  return h('div', { className: 'ugs8-badge' }, 'REPLAY MODE · AUTHORITY = FALSE');
}

export function HeadShaGuard({ state }) {
  const text = state.loading ? 'Checking live PR head…' : state.error ? state.error : state.headMatches ? 'HEAD MATCH' : 'HEAD MISMATCH';
  return h('section', { className: `ugs8-panel ${state.headMatches ? 'GREEN' : 'BLACK'}` },
    h('strong', null, 'Head SHA Guard'),
    h('p', { className: 'ugs8-meta ugs8-sha' }, `Expected: ${state.expectedHeadSha || 'ABSENT'}`),
    h('p', { className: 'ugs8-meta ugs8-sha' }, `Observed: ${state.observedHeadSha || 'UNOBSERVED'}`),
    h('strong', null, text)
  );
}

export function GateCard({ gate, onSelect }) {
  return h('button', { className: `ugs8-card ${gate.status}`, onClick: () => onSelect(gate), type: 'button' },
    h('div', { className: 'ugs8-row' },
      h('strong', null, `Gate ${gate.id} · ${gate.title}`),
      h('span', { className: 'ugs8-status' }, gate.status)
    ),
    h('p', { className: 'ugs8-meta' }, `Permitted role: ${gate.role}`),
    h('p', { className: 'ugs8-meta' }, gate.reason ? `Reason: ${gate.reason}` : `Required prior gates: ${Math.max(0, gate.id - 1)}`)
  );
}

export function GateDetailPanel({ gate }) {
  if (!gate) return h('section', { className: 'ugs8-panel ugs8-empty' }, 'Select a gate to inspect its rules.');
  const signerFlow = gate.id === 3
    ? 'Safe: verify threshold and owners → collect required Safe signatures. Ledger: connect stable hardware wallet → verify address → sign attestation. Managed signer: verify policy and audit surface.'
    : 'Receipt must satisfy role, prior receipt chain, runtime head SHA, expiry, nonce, and replay checks.';
  return h('section', { className: 'ugs8-panel' },
    h('h2', null, `Gate ${gate.id}: ${gate.title}`),
    h('p', null, signerFlow),
    h('p', { className: 'ugs8-meta' }, `State: ${gate.status}`),
    h('p', { className: 'ugs8-meta' }, `Rejection: ${gate.reason || 'NONE'}`),
    h('p', null, 'Address declaration does not prove control. A signed attestation does not authorize merge or broadcast unless this gate explicitly represents that human decision.')
  );
}

export function InvalidationBanner({ state }) {
  const invalid = state.gates.find((gate) => gate.status === 'BLACK' || gate.status === 'GREY');
  if (!invalid) return null;
  return h('section', { className: 'ugs8-banner' },
    h('strong', null, 'PROGRESSION BLOCKED'),
    h('p', null, `Gate ${invalid.id}: ${invalid.reason || invalid.status}`),
    h('p', { className: 'ugs8-meta' }, 'Historical receipts remain visible. No EVM revert is claimed unless an on-chain transaction actually reverted.')
  );
}

export function ReceiptTimeline({ receipts }) {
  return h('section', { className: 'ugs8-timeline' },
    h('h2', null, 'Receipt Timeline'),
    receipts.length === 0
      ? h('p', { className: 'ugs8-empty' }, 'No validated gate receipts observed. Specification and PR comments are not gate attestations.')
      : receipts.map((receipt) => h('article', { className: 'ugs8-receipt', key: receipt.receiptHash },
          h('strong', null, `Gate ${receipt.gateId}`),
          h('p', { className: 'ugs8-meta' }, `${receipt.signerRole} · ${receipt.receiptHash}`)
        ))
  );
}

export function ObservationGatePanel({ state }) {
  return h('section', { className: 'ugs8-observation' },
    h('h2', null, 'Observation Gates 9–10'),
    h('p', null, state.broadcastAuthorized
      ? 'Gate 8 is valid. Broadcast and deployment observations may now be evaluated independently.'
      : 'Locked until Gate 8 is valid. Authorization is not broadcast, and broadcast is not deployment.'),
    h('p', { className: 'ugs8-meta' }, `Broadcast observed: ${state.broadcastObserved} · Deployment observed: ${state.deploymentObserved}`)
  );
}

function Courtroom({ expectedHeadSha }) {
  const state = useGovernanceState(expectedHeadSha);
  const [selected, setSelected] = useState(null);
  return h('main', { className: 'ugs8-shell' }, h('div', { className: 'ugs8-wrap' },
    h('header', { className: 'ugs8-top' },
      h('div', null,
        h('div', { className: 'ugs8-meta' }, 'REPLAY101 · UGS-8 v1.0.1'),
        h('h1', null, 'The Governance Courtroom'),
        h('p', { className: 'ugs8-sub' }, 'Spec is the summons. Code is the witness. Preview is the testimony. Merge is the verdict. The gavel remains in the box until the receipts exist.')
      ),
      h(ReplayModeBadge)
    ),
    h(HeadShaGuard, { state }),
    h(InvalidationBanner, { state }),
    h('section', { className: 'ugs8-grid' }, state.gates.map((gate) => h(GateCard, { gate, onSelect: setSelected, key: gate.id }))),
    h(GateDetailPanel, { gate: selected }),
    h(ObservationGatePanel, { state }),
    h(ReceiptTimeline, { receipts: state.receipts })
  ));
}

const expectedHeadSha = shaFromPath();
if (expectedHeadSha) {
  document.title = 'UGS-8 Governance Courtroom';
  document.body.innerHTML = '<div id="ugs8-root"></div>';
  createRoot(document.getElementById('ugs8-root')).render(h(Courtroom, { expectedHeadSha }));
} else {
  bindPortalCourtroomLink();
}
