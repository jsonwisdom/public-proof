#!/usr/bin/env python3

import hashlib
import json
import pathlib
import sys


def fail(message: str) -> None:
    print(f"::error::{message}")
    print("status=STRUCTURAL_FAIL", file=open(pathlib.Path.cwd() / "github-proof-output.txt", "w"))
    raise SystemExit(1)


def load_json(path: pathlib.Path) -> dict:
    if not path.is_file():
        fail(f"missing file: {path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"invalid JSON in {path}: {exc}")


def main() -> None:
    if len(sys.argv) != 3:
        fail("expected manifest path and allocation-policy path")

    manifest_path = pathlib.Path(sys.argv[1])
    policy_path = pathlib.Path(sys.argv[2])
    manifest = load_json(manifest_path)
    policy = load_json(policy_path)

    if manifest.get("authority") is not False:
        fail("manifest authority must be false")
    if manifest.get("no_fake_green") is not True:
        fail("manifest no_fake_green must be true")
    if policy.get("authority") is not False:
        fail("allocation policy authority must be false")
    if policy.get("automation", {}).get("mode") != "VERIFY_ONLY":
        fail("marketplace automation must remain VERIFY_ONLY")

    manifest_sha256 = hashlib.sha256(manifest_path.read_bytes()).hexdigest()
    policy_sha256 = hashlib.sha256(policy_path.read_bytes()).hexdigest()

    receipt = {
        "artifact_type": "GITHUB_PROOF_MARKETPLACE_VERIFICATION_RECEIPT",
        "version": "0.1",
        "status": "STRUCTURALLY_VALID_NOT_FACTUALLY_PROVEN",
        "manifest": str(manifest_path),
        "manifest_sha256": manifest_sha256,
        "allocation_policy": str(policy_path),
        "allocation_policy_sha256": policy_sha256,
        "wallet_control": manifest.get("public_identity", {}).get("wallet_control", "UNOBSERVED"),
        "marketplace_publication": "UNOBSERVED",
        "payout_automation": "DISABLED",
        "authority": False,
        "no_fake_green": True,
        "no_fake_red": True,
    }

    out = pathlib.Path("github-proof-marketplace-receipt.json")
    out.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")

    github_output = pathlib.Path(sys.environ["GITHUB_OUTPUT"]) if False else None
    output_path = __import__("os").environ.get("GITHUB_OUTPUT")
    if output_path:
        with open(output_path, "a", encoding="utf-8") as handle:
            handle.write("status=STRUCTURALLY_VALID_NOT_FACTUALLY_PROVEN\n")
            handle.write("authority=false\n")

    print(json.dumps(receipt, indent=2))


if __name__ == "__main__":
    main()
