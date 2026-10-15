# Project: Verified Portfolio of Underrated High-Paying Product Companies & Google Sheets Sync

## Architecture
- **Candidate Calibration**: Kaushal Kumar (3.5 YOE, SDE-2 tier, Bengaluru, `kausal.in`).
  - Core Skill Matrix: React.js, React Native, CI/CD, Angular.
  - SDE-2 Target Compensation Band: ₹22 LPA - ₹55+ LPA CTC (India hubs) / $45k - $95k USD (Remote).
- **Canonical 10-Column Schema**:
  1. `Company Name`
  2. `Industry Domain`
  3. `Engineering Hubs`
  4. `Primary Stack Focus` (Must contain >= 2 of {React, React Native, CI/CD, Angular})
  5. `Headcount & Stability Tier` (100-500, 500-1000, 1000-5000, 5000+)
  6. `Career Portal URL` (Valid http/https link)
  7. `LinkedIn Jobs URL` (Valid https://www.linkedin.com/... link)
  8. `Ratings (Glassdoor / AmbitionBox)` (Valid rating format)
  9. `SDE-2 Compensation Band` (Confirmed >= ₹18 LPA floor, above-market benchmark)
  10. `Why It Matches / Value Proposition` (Tailored narrative for candidate)
- **Google Sheets Webhook Synchronization**:
  - Target Spreadsheet ID: `1MUUvv4eULJP0uvcFAPoGP_B1y0AXyL0vhkTHoN1z_Po`
  - Target Tab Identifier: `"date": "Target Companies"`
  - Webhook URL: `https://script.google.com/macros/s/AKfycby7GvgtNlJoIVL6L-OR2la73FMh3u_VqxKQgDV4wGRDHd8HiKoQSxfFM9NOoEkxwmDMwA/exec`
  - Protocol: HTTP POST with `PostRedirectHandler` (handles 302 redirect), `Content-Type: application/json`, `User-Agent: Mozilla/5.0`.
- **Automated Programmatic Verification Suite**:
  - Script: `verify_target_companies.py`
  - Verifies record count (30-40), headcount >=100, >=2 core skills, URL validity, compensation quality, non-empty fields, and sheet synchronization.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Headcount Qualification | 100% companies have verified 100+ headcount & financial stability (exclude early startups & body shops) | M2 | Survey / R1 |
| 2 | Geographic Diversity | Curated across Pan-India tech hubs (BLR, NCR, HYD, BOM, PNQ) and remote-friendly orgs | M2 | Survey / R1 |
| 3 | Tech Stack Verification | 100% companies hire for >=2 of: React, React Native, CI/CD, Angular | M2 | Survey / R2 |
| 4 | Compensation Verification | Documented SDE-2 / 2-5 YOE compensation bands from AmbitionBox/Glassdoor/Instahyre | M2 | Survey / R2 |
| 5 | Portfolio Compilation | Exactly 35 verified high-paying product companies compiled into structured dataset (`target_companies.json`) | M2 | Survey / R3 |
| 6 | 10-Column Schema Standardization | Full standardized metadata (Name, Domain, Hubs, Stack, Tier, Portal URL, LinkedIn URL, Ratings, Comp, Value Prop) | M2 | Survey / R3 |
| 7 | Google Sheets Webhook Sync | Automated push of headers and all company rows to "Target Companies" tab via Apps Script webhook | M3 | Survey / R4 |
| 8 | Automated Verification Test Script | Standalone programmatic test script (`verify_target_companies.py`) checking all constraints and exit code 0 | M3 | Survey / R4 |
| 9 | Multi-Agent Review & Challenge | 2 Reviewers and 2 Challengers verify data, URLs, schema, and live Google Sheet status | M4 | Governance |
| 10 | Forensic Integrity Audit | Independent Forensic Auditor verification (zero cheating, authentic data, genuine sync) | M4 | Governance |
| 11 | Final Gate & Reporting | Evaluation of GATE_STATUS.md, handoff generation, and victory reporting to Sentinel | M5 | Delivery |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Survey & Architecture | Map requirements, inspect webhook and candidate profile, source candidate pool | None | DONE |
| 2 | Dataset Compilation | Compile 35 verified product companies meeting all criteria into `target_companies.json` | M1 | IN_PROGRESS |
| 3 | Sheets Sync & Verification Script | Implement `sync_target_companies.py` & `verify_target_companies.py`, execute sync and verification | M2 | PLANNED |
| 4 | Review, Adversarial Test & Audit | 2 Reviewers, 2 Challengers, 1 Forensic Auditor | M3 | PLANNED |
| 5 | Final Gate & Delivery | Record verdicts in GATE_STATUS.md, write handoff.md, report to parent | M4 | PLANNED |

## Interface Contracts
### Dataset JSON (`target_companies.json`) ↔ Sync Script (`sync_target_companies.py`)
- JSON Structure:
  ```json
  {
    "date": "Target Companies",
    "headers": ["Company Name", "Industry Domain", "Engineering Hubs", "Primary Stack Focus", "Headcount & Stability Tier", "Career Portal URL", "LinkedIn Jobs URL", "Ratings (Glassdoor / AmbitionBox)", "SDE-2 Compensation Band", "Why It Matches / Value Proposition"],
    "rows": [["Company", "Domain", ...], ...]
  }
  ```

### Sync Script ↔ Apps Script Webhook
- HTTP POST request to `tracker_config.json["apps_script_webhook_url"]`
- Headers: `{'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}`
- Follow 302 redirect via `PostRedirectHandler`

### Dataset ↔ Verification Script (`verify_target_companies.py`)
- Input: `target_companies.json` (or CLI `--file`)
- Exit code 0 if all assertions pass, code 1 on failure.

## Code Layout
- `target_companies.json`: Authoritative dataset containing the 35 verified product companies.
- `sync_target_companies.py`: Python script pushing `target_companies.json` to Google Sheets via webhook.
- `verify_target_companies.py`: Production-grade programmatic test script validating all R1-R4 acceptance criteria.
