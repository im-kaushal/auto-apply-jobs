# Dispatch: Worker M2 (Connection Audit & Message Personalization)

**Role**: Personalization & Connection Audit Worker (`teamwork_preview_worker`)
**Working Directory**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m2_audit_personalize`
**User Request**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md`
**Project Plan**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/PROJECT.md`
**Sourced Recruiters Input**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json`
**Personalization Guidelines**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/explorer_survey_3/handoff.md`

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Write Ownership
You exclusively own:
- `/Users/a7970513448/Documents/antigravity/quirky-babbage/personalized_outreach.json`
- Files in your working directory `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m2_audit_personalize/`
Do NOT write to `sourced_recruiters.json`, `verify_outreach.py`, `TEST_INFRA.md`, or `TEST_READY.md`.

## Task Objectives
1. Read `/Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json` containing 50 qualified recruiters.
2. Determine connection degree status:
   - Check connection degree in Chrome/LinkedIn session (1st-degree vs 2nd/3rd-degree).
   - Set `connection_status`: "Existing Connection" OR "Not Connected".
   - Set `outreach_type`: "1st-Degree Message" OR "Connection Request".
3. Generate personalized messages for all 50 recruiters:
   - For 1st-Degree: Warm direct message referencing existing connection, agency name, candidate baseline (Kaushal Kumar, 3.5+ yrs, React/React Native, trade settlement / incident management enterprise projects), and `https://kausal.in`.
   - For 2nd/3rd-Degree: Custom note strictly `< 300` characters (`len(note) < 300`) mentioning:
     - Recruiter's first name
     - Kaushal Kumar
     - 3.5+ yrs experience
     - React / React Native
     - Recruiter's agency name
     - kausal.in
     - Clear authentic human tone (no AI clichés).
4. Save the resulting 50 records in `/Users/a7970513448/Documents/antigravity/quirky-babbage/personalized_outreach.json`.
   Each object must contain all sourcing fields plus:
   - `connection_status`
   - `outreach_type`
   - `personalized_message`
5. Run automated validation on the output:
   - Assert all 50 records present.
   - Assert all Connection Request notes are strictly < 300 characters.
   - Assert mandatory tokens ("kausal.in", "Kaushal Kumar", "3.5", "React") are present in every message.
6. Report in `handoff.md` and send a message to parent when done.

## 2026-09-22T22:13:05Z
You are Worker M2 (teamwork_preview_worker) for Milestone 2: Connection Audit & Message Personalization.
Working directory: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m2_audit_personalize
User request: /Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md
Project plan: /Users/a7970513448/Documents/antigravity/quirky-babbage/PROJECT.md
Sourced recruiters input: /Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json
Guidelines: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/explorer_survey_3/handoff.md
Dispatch instructions: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m2_audit_personalize/DISPATCH.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write Ownership:
You exclusively own:
- /Users/a7970513448/Documents/antigravity/quirky-babbage/personalized_outreach.json
- Files in your working directory /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m2_audit_personalize/
Do NOT write to sourced_recruiters.json, verify_outreach.py, TEST_INFRA.md, or TEST_READY.md.

Tasks:
1. Load /Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json (50 records).
2. Determine connection status for each profile (1st-degree vs 2nd/3rd-degree):
   - Set connection_status: "Existing Connection" or "Not Connected".
   - Set outreach_type: "1st-Degree Message" or "Connection Request".
3. Generate personalized outreach messages:
   - For 1st-Degree: Warm direct message referencing existing connection, agency name, candidate profile (Kaushal Kumar, 3.5+ yrs React/React Native, trade settlement / incident management tools), and https://kausal.in.
   - For 2nd/3rd-Degree: Personalized connection note strictly < 300 characters, containing:
     - Recruiter's first name
     - Kaushal Kumar
     - 3.5+ yrs
     - React / React Native
     - Agency name
     - kausal.in
     - Natural, human, professional tone (no AI clichés).
4. Save the 50 augmented records into /Users/a7970513448/Documents/antigravity/quirky-babbage/personalized_outreach.json.
5. Validate programmatically:
   - Exactly 50 records present.
   - Every Connection Request note is strictly < 300 characters.
   - Mandatory tokens ("kausal.in", "Kaushal Kumar", "3.5", "React") exist in all messages.
6. Write handoff.md and send a message to parent when done.
