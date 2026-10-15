# E2E Test Infrastructure & Test Plan: Recruiter Outreach System

## 1. Test Philosophy & Principles

### 1.1 Opaque-Box, Requirement-Driven Verification
The Recruiter Outreach automation platform operates across multiple asynchronous surfaces: recruiter discovery, browser session automation (Chrome on macOS), message personalization with strict length boundaries, and Google Spreadsheet synchronization via Google Apps Script Webhooks.

Testing is structured strictly as **opaque-box and requirement-driven**:
- **Contract & Boundary Centric**: Tests evaluate observable outputs (JSON staging records, webhook payloads, Google Sheet rows, exit codes, and diagnostic messages) against the authoritative specifications defined in `ORIGINAL_REQUEST.md`, `PROJECT.md`, and `SKILL.md`.
- **Zero Coupling to Implementation Internals**: Test assertions do not inspect internal scraper variables or private browser hooks; they validate the fidelity of the resulting records, schema completeness, character limits, semantic tokens, and error handling protocols.
- **Progressive Testability & Independence**: Each test case is self-contained, isolated, and repeatable. Fixtures generate fresh state without execution-order dependencies or external side effects.

### 1.2 Authoritative Expected Output Derivation
All test assertions and expected values are derived from authoritative project contracts:
1. **Target Agencies Quota**: Exactly 10 tech recruiters for each of the 5 agencies (50 total records):
   - `TeamLease Digital`
   - `Randstad India`
   - `Adecco India`
   - `Michael Page India`
   - `Allegis Group / TEKsystems India`
2. **Profile Uniqueness**: 50 unique LinkedIn profile URLs (`https://www.linkedin.com/in/...`) with no duplicates.
3. **Negative Filter Rule**: Zero records containing campus hiring, university relations, payroll, statutory compliance, non-tech operations, or non-technical recruiting designations.
4. **Message Length Constraint**: For `Connection Request` notes, length must be **strictly less than 300 characters** (`len(message) < 300`, meaning maximum allowed length is 299 characters). A message of exactly 300 characters is rejected by LinkedIn's modal and must fail verification.
5. **Mandatory Candidate Tokens**: All personalized messages must embed:
   - Portfolio URL: `kausal.in` (case-insensitive)
   - Candidate Name: `Kaushal Kumar` (case-insensitive)
   - Experience: `3.5` or `3.5+` (years)
   - Primary Stack: `React` (or `React Native`)
6. **15-Column Schema Fidelity**: Every record must provide all 15 standardized columns in the exact order defined by `OUTREACH_HEADERS` in `SKILL.md`:
   - Column 1: `Agency`
   - Column 2: `Person Name`
   - Column 3: `LinkedIn Profile`
   - Column 4: `Current Designation`
   - Column 5: `Location`
   - Column 6: `Recruitment Domain`
   - Column 7: `Relevant Tech Roles`
   - Column 8: `Associated Companies`
   - Column 9: `Connection Status` (`Existing Connection` / `Not Connected`)
   - Column 10: `Outreach Type` (`1st-Degree Message` / `Connection Request`)
   - Column 11: `Personalized Message`
   - Column 12: `Outreach Status` (`Drafted` / `Pending Review` / `Sent` / `Skipped - Weekly Limit` / `Skipped - Email Required`)
   - Column 13: `Date Contacted` (ISO 8601: `YYYY-MM-DD`)
   - Column 14: `Follow-up Status` (`None` / `Follow-up Due` / `In Discussion`)
   - Column 15: `Notes`

---

## 2. Feature Inventory

Mapped from `ORIGINAL_REQUEST.md` and `PROJECT.md § Feature Inventory`:

| # | Feature ID | Feature Name | Source | Acceptance Criteria & Test Strategy | Test Tier |
|---|------------|--------------|--------|-------------------------------------|-----------|
| 1 | FEAT-01 | Sourcing - TeamLease Digital | `ORIGINAL_REQUEST §R1` | Exactly 10 IT recruiters verified currently at TeamLease Digital in India; specialized in SE/Frontend/FullStack. | Tier 1, 4 |
| 2 | FEAT-02 | Sourcing - Randstad India | `ORIGINAL_REQUEST §R1` | Exactly 10 IT recruiters verified currently at Randstad India; specialized in SE/Frontend/FullStack. | Tier 1, 4 |
| 3 | FEAT-03 | Sourcing - Adecco India | `ORIGINAL_REQUEST §R1` | Exactly 10 IT recruiters verified currently at Adecco India; specialized in SE/Frontend/FullStack. | Tier 1, 4 |
| 4 | FEAT-04 | Sourcing - Michael Page India | `ORIGINAL_REQUEST §R1` | Exactly 10 IT recruiters verified currently at Michael Page India; specialized in SE/Frontend/FullStack. | Tier 1, 4 |
| 5 | FEAT-05 | Sourcing - Allegis Group / TEKsystems | `ORIGINAL_REQUEST §R1` | Exactly 10 IT recruiters verified currently at Allegis Group / TEKsystems India; specialized in SE/Frontend/FullStack. | Tier 1, 4 |
| 6 | FEAT-06 | Strict Negative Filtering | `ORIGINAL_REQUEST §R1`, `SKILL.md` | Reject any title matching regex `\b(campus|university|fresher|payroll|compliance|sales|marketing|manufacturing|pharma|nurse|blue collar)\b`. | Tier 1, 2 |
| 7 | FEAT-07 | Connection Degree Audit | `ORIGINAL_REQUEST §R2` | Audit connection degree (`1st` vs `2nd/3rd+`); map `Existing Connection` -> `1st-Degree Message` and `Not Connected` -> `Connection Request`. | Tier 1, 3 |
| 8 | FEAT-08 | 1st-Degree Message Generation | `ORIGINAL_REQUEST §R2`, `SKILL.md` | Generate warm direct message referencing existing connection, candidate name, 3.5 yrs, React/React Native, trade settlement (Citi) or incident management (Marriott), and `kausal.in`. | Tier 1, 3 |
| 9 | FEAT-09 | 2nd/3rd-Degree Note Generation | `ORIGINAL_REQUEST §R2`, `SKILL.md` | Strictly `< 300` characters, featuring recipient name, agency name, Kaushal Kumar, 3.5+ yrs, React/React Native, and `kausal.in`. | Tier 1, 2 |
| 10 | FEAT-10 | Browser Outreach Automation | `ORIGINAL_REQUEST §R3` | Emulate modal navigation: Connect -> Add a note -> input note -> send. Handle DOM modal states and dismissal. | Tier 2, 3 |
| 11 | FEAT-11 | Weekly Invitation Limit Handling | `ORIGINAL_REQUEST §R3` | Detect LinkedIn weekly limit modal; halt gracefully, record status as `Skipped - Weekly Limit`, flush completed rows without crash. | Tier 2, 3 |
| 12 | FEAT-12 | Email Challenge Handling | `ORIGINAL_REQUEST §R3`, `Survey 3` | Detect private email prompt; cancel/dismiss, record `Skipped - Email Required`, and pull replacement candidate from backup queue. | Tier 2, 3 |
| 13 | FEAT-13 | Google Sheets Webhook Sync | `ORIGINAL_REQUEST §R4` | Payload matches `{"date": "Recruiter_Outreach", "headers": OUTREACH_HEADERS, "rows": records}`; handle HTTP 302 redirect. | Tier 1, 4 |
| 14 | FEAT-14 | Automated Verification Test Suite | `ORIGINAL_REQUEST §AC` | Standalone CLI & programmatic test engine asserting full dataset conformity across all 50 records. | Tier 1–4 |

---

## 3. Test Architecture & Directory Layout

### 3.1 Directory Layout
```text
quirky-babbage/
├── ORIGINAL_REQUEST.md             # Baseline requirements and acceptance criteria
├── PROJECT.md                      # Project master architecture and plan
├── TEST_INFRA.md                   # This document: Test architecture and specifications
├── TEST_READY.md                   # Test readiness certification and run commands
├── tracker_config.json             # Google Sheet IDs, Webhook URL, Candidate profile
├── verify_outreach.py              # Core verification engine, validators, and CLI runner
└── tests/
    ├── __init__.py                 # Test package initialization
    ├── fixtures.py                 # Golden 50-record datasets, generators, and mutations
    ├── test_tier1_feature_coverage.py   # Tier 1: Feature coverage (>=5 tests per feature)
    ├── test_tier2_boundary_corner.py    # Tier 2: Boundary & corner cases (299 vs 300, limits, etc.)
    ├── test_tier3_cross_feature.py      # Tier 3: Pairwise combinations and composite flows
    └── test_tier4_acceptance.py         # Tier 4: Golden 50-record acceptance & payload sync tests
```

### 3.2 Test Runner Architecture
- **Framework**: Standard Python `unittest` framework (zero external package dependencies).
- **Execution Interfaces**:
  1. **All Tiers via unittest discovery**:
     ```bash
     python3 -m unittest discover tests -v
     ```
  2. **All Tiers via Verification CLI**:
     ```bash
     python3 verify_outreach.py --test-all
     ```
  3. **Targeted Tier Execution**:
     ```bash
     python3 verify_outreach.py --tier 1
     python3 verify_outreach.py --tier 2
     python3 verify_outreach.py --tier 3
     python3 verify_outreach.py --tier 4
     ```
  4. **Dataset File Verification CLI**:
     ```bash
     python3 verify_outreach.py --file outreach_data.json
     ```
  5. **Live Sheet Verification CLI**:
     ```bash
     python3 verify_outreach.py --live-check
     ```

### 3.3 Test Fixtures & Synthetic Mutation Engine (`tests/fixtures.py`)
To enable rigorous opaque-box verification without flakiness:
- `generate_valid_record(...)`: Generates a single conforming 15-column record.
- `generate_valid_dataset(count=50)`: Generates a complete 50-record golden dataset (10 records per agency, alternating 1st and 2nd degree, conforming notes, valid dates, unique URLs).
- `mutate_record(record, **kwargs)`: Injects targeted anomalies (e.g. 300-char message, duplicate URL, disallowed designation) for negative testing.
- `build_webhook_payload(records)`: Packages records into the exact Google Apps Script Webhook payload structure.

---

## 4. Test Tiers & Specifications

### Tier 1: Feature Coverage (Core Requirements)
*Goal: Validate that every individual requirement works as specified across positive paths.*
- **Agency Sourcing Quota Tests (>=5 tests)**:
  - `test_teamlease_quota_satisfied`: 10 records for TeamLease Digital.
  - `test_randstad_quota_satisfied`: 10 records for Randstad India.
  - `test_adecco_quota_satisfied`: 10 records for Adecco India.
  - `test_michael_page_quota_satisfied`: 10 records for Michael Page India.
  - `test_teksystems_quota_satisfied`: 10 records for Allegis Group / TEKsystems India.
- **15-Column Schema Fidelity Tests (>=5 tests)**:
  - `test_schema_column_names_match_verbatim`: Validates exact column header strings in order.
  - `test_schema_row_length_matches_headers`: Each row has exactly 15 items.
  - `test_schema_non_empty_mandatory_fields`: Name, URL, Designation, Agency, Message are non-empty.
  - `test_schema_date_contacted_iso_format`: Validates `YYYY-MM-DD` date regex.
  - `test_schema_valid_enum_values`: Validates `Connection Status` and `Outreach Type` enums.
- **Candidate Token Inclusion Tests (>=5 tests)**:
  - `test_token_kausal_in_present`: Portfolio URL present in all messages.
  - `test_token_kaushal_kumar_present`: Candidate name present in all messages.
  - `test_token_experience_years_present`: "3.5" or "3.5+" present.
  - `test_token_react_present`: "React" or "React Native" present.
  - `test_token_case_insensitivity`: Tokens matched case-insensitively.
- **Connection Degree Handling Tests (>=5 tests)**:
  - `test_first_degree_mapping`: `Existing Connection` maps to `1st-Degree Message`.
  - `test_not_connected_mapping`: `Not Connected` maps to `Connection Request`.
  - `test_first_degree_message_warm_dm_content`: Mentions existing connection, Citi/Marriott domain.
  - `test_first_degree_message_length_flexibility`: Direct messages can exceed 300 chars without error.
  - `test_second_degree_strictly_under_300_chars`: Connection request note strictly < 300 chars.
- **Negative Filtering Tests (>=5 tests)**:
  - `test_reject_campus_recruiter`: Rejects "Campus Recruiter" / "University Relations".
  - `test_reject_payroll_specialist`: Rejects "Payroll Specialist" / "Payroll Analyst".
  - `test_reject_statutory_compliance`: Rejects "Statutory Compliance Manager".
  - `test_reject_non_tech_pharma`: Rejects "Pharma Recruiter" / "Healthcare Talent".
  - `test_accept_valid_it_recruiter`: Accepts "Senior Technical Recruiter - Frontend & Cloud".

### Tier 2: Boundary & Corner Cases
*Goal: Validate resilience against extreme inputs, platform limits, and edge conditions.*
- **Character Count Boundaries**:
  - `test_message_298_chars_passes`: Valid connection note of 298 chars passes.
  - `test_message_299_chars_passes`: Valid connection note of 299 chars passes.
  - `test_message_300_chars_fails`: Connection note of exactly 300 chars fails (strict `< 300` constraint).
  - `test_message_301_chars_fails`: Connection note of 301 chars fails.
  - `test_empty_message_fails`: Empty string or whitespace-only message fails.
- **Duplicate & Malformed URLs**:
  - `test_duplicate_url_detection`: Detects identical URLs across records.
  - `test_duplicate_url_with_trailing_slash_detection`: Normalizes and flags URL duplicates.
  - `test_malformed_url_rejected`: Rejects URLs not starting with `https://www.linkedin.com/in/`.
- **Field Completeness & Truncation**:
  - `test_missing_required_field`: None or empty values in required columns detected.
  - `test_whitespace_padded_values`: Whitespace stripped and validated.
  - `test_extra_or_fewer_columns`: Row with 14 or 16 columns flagged immediately.
- **Modal Event Triggers & Browser Guardrails**:
  - `test_email_challenge_triggers_status_update`: "Skipped - Email Required" handled correctly without crashing.
  - `test_email_challenge_pulls_backup_candidate`: Replacement candidate restores 10-count quota.
  - `test_weekly_limit_modal_triggers_status_update`: "Skipped - Weekly Limit" handled correctly.
  - `test_weekly_limit_halts_and_preserves_completed_records`: Ensures partial records are flusheable.

### Tier 3: Cross-Feature Interactions
*Goal: Validate that combinations of features behave coherently when executed together.*
- **Pairwise Agency x Connection Status**:
  - `test_pairwise_teamlease_first_degree`: TeamLease recruiter with 1st-degree warm DM.
  - `test_pairwise_teamlease_second_degree`: TeamLease recruiter with 2nd-degree note.
  - `test_pairwise_randstad_first_degree`: Randstad recruiter with 1st-degree warm DM.
  - `test_pairwise_randstad_second_degree`: Randstad recruiter with 2nd-degree note.
  - `test_pairwise_teksystems_second_degree`: TEKsystems recruiter with enterprise banking note.
  - `test_pairwise_michael_page_second_degree`: Michael Page recruiter with startup/product note.
  - `test_pairwise_adecco_second_degree`: Adecco recruiter with tech staffing note.
- **Composite Scenarios**:
  - `test_mixed_batch_5_first_degree_45_second_degree`: Mixed batch validation in single run.
  - `test_weekly_limit_interruption_during_specific_agency`: Rate limit hits during 3rd agency; previous 20 records marked `Sent`, current marked `Skipped - Weekly Limit`, remaining marked `Pending Review`.
  - `test_format_agnostic_validation`: Verifier accepts both list of dicts, list of lists (row array), and top-level webhook payload dict.

### Tier 4: Real-World Acceptance Scenarios
*Goal: End-to-end full run validation with complete 50-record dataset and live/staged payload.*
- `test_acceptance_full_golden_50_dataset`: Validates the complete 50-record dataset against all acceptance criteria.
- `test_acceptance_webhook_payload_structure`: Validates that `build_webhook_payload` produces the exact payload structure accepted by `update_sheet.py` / `outreach_tracker.py`.
- `test_acceptance_fault_injection_fails_entire_run`: Validates that introducing a single defect (e.g. 49 records, or a missing token in row 48) causes the verifier to report a clear failure and detailed diagnostics.
- `test_acceptance_agency_distribution_exactness`: Validates that a dataset with 50 total records but 11 from TeamLease and 9 from Randstad fails with per-agency error breakdown.
- `test_acceptance_roundtrip_json_serialization`: Validates reading from and writing to JSON without data corruption or escaping loss.

---

## 5. Coverage Thresholds & Quality Gates

| Metric | Target | Rationale |
|---|---|---|
| Feature Inventory Coverage | 100% (14/14 features) | All user-requested capabilities and safeguards must be verified |
| Minimum Tier 1 Test Cases | 25 tests | >=5 tests per core feature (Agencies, Schema, Tokens, Degrees, Negative Filter) |
| Minimum Tier 2 Test Cases | 15 tests | Strict validation of edge boundaries (299 vs 300 chars, modals, duplicates) |
| Minimum Tier 3 Test Cases | 10 tests | Pairwise matrix coverage and interrupted pipeline workflows |
| Minimum Tier 4 Test Cases | 5 tests | Full 50-record dataset end-to-end acceptance validation |
| Total Suite Test Count | >= 55 tests | Comprehensive regression barrier |
| Pass Rate Requirement | 100% | Zero tolerance for assertion failures in test suite execution |

---

## 6. How to Run the Tests

```bash
# 1. Run full unit test suite (All Tiers)
python3 -m unittest discover tests -v

# 2. Run via Verification CLI
python3 verify_outreach.py --test-all

# 3. Run individual Tiers
python3 verify_outreach.py --tier 1
python3 verify_outreach.py --tier 2
python3 verify_outreach.py --tier 3
python3 verify_outreach.py --tier 4

# 4. Verify a candidate dataset file (e.g., outreach_data.json)
python3 verify_outreach.py --file outreach_data.json
```
