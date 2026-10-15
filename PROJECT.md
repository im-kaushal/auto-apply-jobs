# Project: Recruiter Outreach & Google Sheets Tracker Automation

## Architecture
- **Data Flow**:
  1. Recruiter Sourcing: Discover & qualify 10 active tech recruiters for each of the 5 agencies (50 total).
  2. Connection Degree Audit & Personalization: Inspect profiles in logged-in Chrome session to determine degree; generate personalized note (<300 chars) for 2nd/3rd degree or warm DM for 1st degree with kausal.in and candidate profile.
  3. Automated Outreach Dispatch: Execute connection requests and messages in active Chrome session, handling modals, inputs, and weekly invitation limits gracefully.
  4. Google Spreadsheet Synchronization: Push 50 records with all 15 columns to the `Recruiter_Outreach` tab via the Apps Script Webhook.
  5. E2E Automated Verification: Execute verification script confirming the rows, columns, tokens, and agency distributions in Google Sheets.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Sourcing - TeamLease Digital | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Sourcing - Randstad India | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Sourcing - Adecco India | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Sourcing - Michael Page India | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Sourcing - Allegis Group / TEKsystems India | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 | ORIGINAL_REQUEST §R1 |
| 6 | Negative Filtering | Exclude campus, payroll, compliance, non-tech, inactive profiles | M1 | ORIGINAL_REQUEST §R1, SKILL.md |
| 7 | Connection Degree Audit | Inspect profiles in logged-in Chrome session (1st vs 2nd/3rd) | M2 | ORIGINAL_REQUEST §R2 |
| 8 | 1st-Degree Message Generation | Warm DM with candidate baseline, Citi/Marriott projects, kausal.in | M2 | ORIGINAL_REQUEST §R2, SKILL.md |
| 9 | 2nd/3rd-Degree Note Generation | Strictly <300 chars note with Kaushal Kumar, 3.5+ yrs, React/RN, kausal.in, agency name | M2 | ORIGINAL_REQUEST §R2, SKILL.md |
| 10 | Browser Outreach Automation | Automate Connect -> Add note -> Input -> Send via active Chrome session | M3 | ORIGINAL_REQUEST §R3 |
| 11 | Weekly Invitation Limit Handling | Detect weekly limit modal, halt gracefully, record status without crash | M3 | ORIGINAL_REQUEST §R3 |
| 12 | Email Challenge Handling | Dismiss private email prompts, pull from backup candidates | M3 | ORIGINAL_REQUEST §R3, Survey |
| 13 | Google Sheets Webhook Sync | Format 50x15 records and push to Recruiter_Outreach tab via Apps Script Webhook | M4 | ORIGINAL_REQUEST §R4 |
| 14 | Automated Verification Test Suite | Execute verification script confirming all 50 records in Google Sheets | M5 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Recruiter Sourcing & Qualification | Source 50 verified technical recruiters (10 each across 5 agencies) with positive/negative filtering | none | DONE |
| M2 | Connection Audit & Message Personalization | Inspect connection degrees and generate compliant messages (<300 chars notes, warm DMs) | M1 | PLANNED |
| M3 | Browser Outreach Dispatch | Execute connection requests and DMs in logged-in Chrome session with safety guards | M2 | PLANNED |
| M4 | Google Spreadsheet Synchronization | Push 50 records across 15 columns to Google Sheet Recruiter_Outreach tab via Webhook | M3 | PLANNED |
| M5 | Final Milestone: Automated Verification & Coverage Hardening | Run verification test suite against Google Sheet records and verify all acceptance criteria | M4 | PLANNED |

## Interface Contracts
- **Sourcing -> Audit/Personalization**: List of 50 recruiter objects containing: `agency`, `name`, `profile_url`, `designation`, `location`, `recruitment_domain`, `relevant_roles`, `associated_companies`.
- **Audit/Personalization -> Browser Outreach**: List of 50 recruiter objects augmented with: `connection_status` (`Existing Connection` / `Not Connected`), `outreach_type` (`1st-Degree Message` / `Connection Request`), `personalized_message` (strictly <300 chars for requests, warm DM for 1st-degree).
- **Browser Outreach -> Spreadsheet Sync**: List of 50 recruiter objects augmented with: `outreach_status` (`Sent` / `Skipped - Weekly Limit`), `date_contacted` (`2026-09-23`), `follow_up_status` (`None`), `notes`.
- **Spreadsheet Sync -> Google Sheet**: Payload: `{"date": "Recruiter_Outreach", "headers": OUTREACH_HEADERS, "rows": records}` where `records` is 50 rows of 15 column values.
- **Verification Script Contract**: Input: sheet records or spreadsheet query; Output: boolean assertion pass across 50 records, 10/agency, unique URLs, token presence, length bounds, no disallowed titles.

## Code Layout
- `tracker_config.json`: Configuration for spreadsheet ID and candidate profile
- `.agents/skills/linkedin-recruitment-outreach-assistant/scripts/outreach_tracker.py`: Webhook synchronization script
- `verify_outreach.py`: Automated verification script
- `outreach_data.json`: Local staging data for 50 records
