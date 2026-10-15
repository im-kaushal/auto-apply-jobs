# Dispatch Assignment

## Working Directory
/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_worker_1

## Identity
Role: Full Stack Dataset & Verification Engineer
Archetype: teamwork_preview_worker

## Context & Inputs
- User Request: `/Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md` (read lines 48-96)
- Project Scope: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_orchestrator_2/PROJECT.md`
- Explorer 1 Report (Sheets & Webhook Specs): `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_survey_1/handoff.md`
- Explorer 2 Report (Candidate Profile & Schemas): `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_survey_2/handoff.md`
- Explorer 3 Report (42 Vetted Product Companies): `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_survey_3/handoff.md`
- Config: `/Users/a7970513448/Documents/antigravity/quirky-babbage/tracker_config.json`

## Exclusive File Ownership
You own:
- `/Users/a7970513448/Documents/antigravity/quirky-babbage/target_companies.json`
- `/Users/a7970513448/Documents/antigravity/quirky-babbage/sync_target_companies.py`
- `/Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py`

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Tasks
1. **Compile Verified Dataset (`target_companies.json`)**:
   - Curate exactly 35 high-caliber, verified product companies selected from Explorer 3's vetted candidate pool (including Nike, Samsung, Airtel, Cult.fit, Agoda, BookMyShow, Ixigo, Postman, BrowserStack, Groww, Slice, etc.).
   - Follow the 10-column canonical schema:
     `["Company Name", "Industry Domain", "Engineering Hubs", "Primary Stack Focus", "Headcount & Stability Tier", "Career Portal URL", "LinkedIn Jobs URL", "Ratings (Glassdoor / AmbitionBox)", "SDE-2 Compensation Band", "Why It Matches / Value Proposition"]`
   - Ensure 100% of companies have headcount >=100 (tiers `100-500`, `500-1000`, `1000-5000`, `5000+`).
   - Ensure 100% of companies require >=2 of {React, React Native, CI/CD, Angular}.
   - Ensure valid http/https URLs for portals and valid linkedin.com URLs.
   - Ensure realistic SDE-2 compensation bands (>= ₹18 LPA CTC floor).
   - Ensure tailored, substantial value propositions for Kaushal Kumar (3.5 YOE, React/RN/CI-CD/Angular, `kausal.in`).

2. **Implement & Execute Sync Script (`sync_target_companies.py`)**:
   - Build `sync_target_companies.py` using `tracker_config.json` webhook URL and `PostRedirectHandler` (see Explorer 1 specs).
   - Send payload: `{"date": "Target Companies", "headers": [...], "rows": [...]}`.
   - Run the script and verify that the Apps Script webhook responds with success.

3. **Implement & Execute Automated Verification Script (`verify_target_companies.py`)**:
   - Build a comprehensive, self-contained verification script that tests:
     - Record count is between 30 and 40 (exactly 35).
     - Unique, non-empty company names.
     - Headcount tiers are strictly >=100 (`100-500`, `500-1000`, `1000-5000`, `5000+`).
     - Core tech stack has >=2 of {React, React Native, CI/CD, Angular}.
     - Valid URL formats for career portal and LinkedIn jobs.
     - SDE-2 compensation bands meet quality threshold (>= ₹18 LPA).
     - Non-empty, personalized value propositions.
     - Google Sheet webhook synchronization check.
   - Run `python3 verify_target_companies.py` and ensure it exits with code 0.

4. **Handoff Report**:
   - Write your complete handoff report to `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_worker_1/handoff.md`.
   - Include terminal command outputs and results.
   - Send completion message to orchestrator.

## 2026-09-23T18:55:18Z
Read /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_worker_1/DISPATCH.md and /Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md.
Working Directory: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_worker_1.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task:
1. Compile verified dataset of 35 product companies into target_companies.json using 10-column canonical schema.
2. Implement and execute sync_target_companies.py to push records to Google Sheets "Target Companies" tab via Apps Script webhook.
3. Implement and execute verify_target_companies.py to programmatically assert all R1-R4 criteria and exit code 0.
4. Document all outputs and tests in /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_worker_1/handoff.md and send message back to orchestrator.
