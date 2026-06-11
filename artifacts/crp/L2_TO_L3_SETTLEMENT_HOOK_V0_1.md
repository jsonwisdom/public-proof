# L2_TO_L3_SETTLEMENT_HOOK_V0_1

## Purpose

This artifact defines the first lawful automation hook in the CRP replay stack.

The hook is located at the L2 to L3 boundary, where a media artifact becomes a settled graph event eligible for replay.

JSONWisdom does not listen to raw mints.
JSONWisdom receives verified transitions.

## Core Definition

{
  "artifact": "L2_TO_L3_SETTLEMENT_HOOK_V0_1",
  "layer_from": "L2_MEDIA_ARTIFACT",
  "layer_to": "L3_GRAPH_EVENT",
  "trigger": "successful_zora_mint_or_transfer",
  "authority": false,
  "no_fake_green": true,
  "input_required": [
    "cid",
    "creator",
    "recipient",
    "tx_hash",
    "contract",
    "block_number"
  ],
  "output": "replay_candidate"
}

## Gate Rule

The hook emits a replay candidate only if all six required fields are present.

If any field is missing, the state remains:

PENDING_SETTLEMENT_EVIDENCE

## JSONWisdom Role

JSONWisdom is downstream and append-only.

It creates:

- witness
- receipt
- replay_object
- lineage_edge

It does not watch:

- raw mints
- raw media uploads
- popularity
- market activity
- likes

It watches only verified state transitions.

## Witness #001 Replay Candidate

{
  "event": "L2_TO_L3_TRANSITION",
  "asset": "Task Accomplished Goblin",
  "cid": "bafkreibqiygakkptmt6q7tmj7vgel23amg537fjlznv4zihbdoa5z37uwu",
  "tx_hash": "0x40ee01206b0b138c1382e3c4552771b61ee8d991d7e26279b36f137f14366511",
  "recipient": "jaywisdom.base.eth",
  "state": "SETTLED",
  "authority": false
}

## L5 Metric

{
  "metric": "ACCOMPLISHMENT_PROPAGATION",
  "definition": "How many future verified actions became possible because this action existed?",
  "rejects": [
    "mint_count",
    "transaction_count",
    "likes",
    "market_cap",
    "popularity"
  ]
}

## Constitutional Invariants

{
  "authority": false,
  "no_fake_green": true,
  "jsonwisdom_role": "downstream_receiver",
  "hook_role": "border_guard",
  "state": "DEFINED"
}
