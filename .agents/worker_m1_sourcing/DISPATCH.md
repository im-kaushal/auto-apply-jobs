# Dispatch: Worker M1 (Recruiter Sourcing & Qualification)

**Role**: Recruiter Sourcing Worker (`teamwork_preview_worker`)
**Working Directory**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m1_sourcing`
**User Request**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md`
**Project Plan**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/PROJECT.md`
**Explorer Survey Handoff**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/explorer_survey_3/handoff.md`

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Write Ownership
You exclusively own:
- `/Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json`
- Files in your working directory `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m1_sourcing/`
Do NOT write to `verify_outreach.py`, `TEST_INFRA.md`, or `TEST_READY.md`.

## Task Objectives
1. Sourcing Scope: Discover and qualify exactly 10 active India-based IT recruiters / technical talent acquisition partners for each of the 5 agencies (50 total):
   1. TeamLease Digital (Digital/IT staffing)
   2. Randstad India (Randstad Technologies / IT staffing)
   3. Adecco India (Adecco Tech / Akkodis)
   4. Michael Page India (Technology & Digital practice)
   5. Allegis Group / TEKsystems India (Allegis Services India / TEKsystems)
2. Quality & Filtering:
   - Must be currently employed at the respective agency in India.
   - Must specialize in Software Engineering, Frontend (React/React Native), or Full Stack.
   - Strictly exclude campus/university recruiters, payroll, statutory compliance, non-IT recruiters, and inactive profiles.
3. Output Format:
   Save the qualified 50 records in `/Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json` as a JSON list of objects containing:
   - `agency`: Exact agency name from the 5 target agencies
   - `person_name`: Full name of recruiter
   - `linkedin_profile`: Unique, valid LinkedIn profile URL
   - `current_designation`: Exact IT recruiting job title
   - `location`: Indian tech hub city (Bengaluru, Hyderabad, Pune, Mumbai, Delhi-NCR, Chennai)
   - `recruitment_domain`: Target domain (e.g. Enterprise GCC & Banking Tech, Product Tech, etc.)
   - `relevant_tech_roles`: e.g. Frontend Engineer, React Developer, SDE-2, Full Stack
   - `associated_companies`: Client enterprises or GCCs (e.g. Citi, JPMC, Standard Chartered)
4. Validate that there are exactly 10 recruiters per agency (50 total) and 50 unique LinkedIn URLs.

## 2026-09-22T22:08:01Z
You are Worker M1 (teamwork_preview_worker) for Milestone 1: Recruiter Sourcing & Qualification.
Working directory: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m1_sourcing
User request: /Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md
Project plan: /Users/a7970513448/Documents/antigravity/quirky-babbage/PROJECT.md
Survey handoff: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/explorer_survey_3/handoff.md
Dispatch instructions: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m1_sourcing/DISPATCH.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write Ownership:
You exclusively own:
- /Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json
- Files in your working directory /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m1_sourcing/
Do NOT write to verify_outreach.py, TEST_INFRA.md, or TEST_READY.md.

Tasks:
1. Source and qualify exactly 10 active India-based technical recruiters / IT talent partners for EACH of the 5 agencies (50 total):
   - TeamLease Digital
   - Randstad India
   - Adecco India
   - Michael Page India
   - Allegis Group / TEKsystems India
2. Apply strict positive criteria (Software Engineering, Frontend React/React Native, Full Stack hiring focus) and strict negative filters (no campus recruiters, no payroll/compliance, no non-tech staffing).
3. Save the 50 structured records in /Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json matching the schema in DISPATCH.md.
4. Run validation checks to ensure 50 unique profile URLs, exactly 10 per agency, valid fields.
5. Report in handoff.md and send a message to parent when done.
