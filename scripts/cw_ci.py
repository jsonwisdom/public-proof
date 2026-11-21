#!/usr/bin/env python3
"""Computer Wisdom CI-FIRST v0.1: deterministic static build and independent live parity.
Python stdlib only. No normalization, signing or evidence adjudication.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import sys
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "bbp-pages-output"
BASE_URL = "https://press.jsonwisdom.com"
STATE_IDS = ("MN", "NY")
PREFIX = b"CW-STATE-LEAF-v0.1\0"
NODE_PREFIX = b"CW-MERKLE-NODE-v0.1\0"

def fail(message):
    raise SystemExit("CI_FIRST_FAIL " + message)

def sha(data):
    return hashlib.sha256(data).hexdigest()

def canonical(obj):
    return json.dumps(obj, sort_keys=True, ensure_ascii=False,
                      separators=(",", ":"), allow_nan=False).encode("utf-8")

def verified_sources():
    docs = []
    for path in ("proof/site.json", "proof/states/MN.json", "proof/states/NY.json"):
        spec = json.loads((ROOT / path).read_text(encoding="utf-8"))
        source = ROOT / spec["source_path"]
        actual = sha(source.read_bytes())
        expected = spec["source_sha256"]
        if actual != expected:
            fail(f"{path} source SHA-256 mismatch expected={expected} actual={actual}")
        if spec.get("witness_signature") is not None:
            fail(f"{path} witness signature requires independent verification; not configured")
        if path.startswith("proof/states/"):
            state = Path(path).stem
            if spec.get("state") != state or spec.get("schema") != "cw-state-proof-v0.1":
                fail(f"{path} state/schema mismatch")
            if spec.get("evidence_status") not in ("HOLD", "UNKNOWN", "FAIL"):
                fail(f"{path} unsupported evidence claim (unsigned)")
            if spec.get("public_path") != f"/states/{state.lower()}/":
                fail(f"{path} public route mismatch")
        else:
            if spec.get("schema") != "cw-site-proof-v0.1" or spec.get("public_path") != "/":
                fail("Site manifest mismatch")
        docs.append((spec, source))
    if sorted(spec["state"] for spec, _ in docs if "state" in spec) != list(STATE_IDS):
        fail("state membership mismatch")
    return docs

def merkle_receipt(docs):
    leaves = []
    for spec, _ in docs:
        if "state" in spec:
            leaves.append((spec["state"], hashlib.sha256(PREFIX + canonical(spec)).digest()))
    leaves.sort(key=lambda x: x[0])
    level = [x[1] for x in leaves]
    while len(level) > 1:
        if len(level) % 2:
            level.append(level[-1])
        level = [hashlib.sha256(NODE_PREFIX + level[i] + level[i+1]).digest()
                 for i in range(0, len(level), 2)]
    return {"schema":"cw-merkle-preview-v0.1","states":[{"state":s,"leaf_sha256":h.hex()} for s,h in leaves],
            "root_sha256":level[0].hex(),"signature_status":"UNSIGNED_HOLD",
            "canonicalization":"Python json.dumps(sort_keys=True,ensure_ascii=False,separators,allow_nan=False) UTF-8",
            "purpose":"Integrity commitment only; no source authenticity or wrongdoing finding"}

def build():
    docs = verified_sources()
    if OUT.exists():
        shutil.rmtree(OUT)
    for spec, source in docs:
        public = spec["public_path"]
        dest = OUT / public.lstrip("/") / "index.html"
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, dest)
        if sha(dest.read_bytes()) != spec["source_sha256"]:
            fail(f"Build byte mismatch: {dest}")
    legacy = ROOT / "audits/ny/AF_NYC_JOSHUA005_ACT4_PUBLIC_CHECKPOINT_2026-11-20.json"
    if not legacy.is_file():
        fail("Previously published NY checkpoint missing")
    target = OUT / "audits/ny"
    target.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(legacy, target / legacy.name)
    shutil.copyfile(ROOT / "audits/ny/ny-sadc-oversight-2026.html",
                    target / "ny-sadc-oversight-2026.html")
    receipt = merkle_receipt(docs)
    (OUT / "proof").mkdir(exist_ok=True)
    (OUT / "proof/merkle-preview.json").write_bytes(canonical(receipt) + b"\n")
    print("CI_FIRST_BUILD_PASS",receipt["root_sha256"],"unsigned; evidence HOLD")
    return docs

def verify_live():
    docs = verified_sources()
    results = []
    for spec, source in docs:
        url = BASE_URL + spec["public_path"]
        request = urllib.request.Request(url, headers={
            "Accept-Encoding": "identity", "User-Agent": "ComputerWisdom-CI-First/0.1",
            "Cache-Control": "no-cache"})
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                status = response.status
                body = response.read()
                encoding = response.headers.get("Content-Encoding", "identity")
                content_type = response.headers.get("Content-Type","")
        except (urllib.error.URLError, TimeoutError) as e:
            fail(f"{url} fetch failure {e}")
        actual = sha(body)
        if status != 200 or encoding.lower() != "identity" or "text/html" not in content_type.lower():
            fail(f"{url} response invalid status={status} encoding={encoding} type={content_type}")
        if actual != spec["source_sha256"]:
            fail(f"{url} BYTE_PARITY_FAIL expected={spec['source_sha256']} actual={actual} bytes={len(body)}")
        results.append({"url":url,"source":str(source.relative_to(ROOT)),"sha256":actual,
                        "bytes":len(body),"status":"PASS"})
        print("CI_FIRST_LIVE_PASS", url, actual, len(body))
    print("CI_FIRST_ALL_PASS", len(results), "paths", "(unsigned manifests remain HOLD)")
    return results

def selftest():
    assert sha(b"abc") == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    assert canonical({"z":1,"a":2}) == b'{"a":2,"z":1}'
    assert hashlib.sha256(PREFIX + canonical({"state":"NY"})).digest() != hashlib.sha256(PREFIX + canonical({"state":"MN"})).digest()
    docs = verified_sources()
    assert len(docs) == 3
    print("CI_FIRST_SELFTEST_PASS", "SHA256, canonicalization, domain separation, 3 pinned sources")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["build","verify-live","selftest"])
    args = parser.parse_args()
    {"build":build,"verify-live":verify_live,"selftest":selftest}[args.command]()
