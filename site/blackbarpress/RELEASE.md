# Computer Wisdom CI-FIRST release gate

Production destination: https://press.jsonwisdom.com/

Source files:
- NY: audits/ny/ny-sadc-oversight-2026.html
- MN: audits/mn/mn-eidbi-oversight-2026.html
- State picker: site/blackbarpress/index.html

Build: `python3 -B scripts/cw_ci.py selftest && python3 -B scripts/cw_ci.py build`

Verify production bytes independently: `python3 -B scripts/cw_ci.py verify-live`

Source pins: proof/site.json and proof/states/{NY,MN}.json
Unsigned Merkle commitment preview: /proof/merkle-preview.json

Important: A successfully generated Merkle preview does not authenticate government records and
is NOT an Ed25519 signature. Original case evidence remains HOLD until independently proved.
The GitHub workflow verifies sources on pushes and production HTML during schedule/manual dispatch.
No release may be called Standard 1.0 until both production byte parity and witness signature checks PASS.
