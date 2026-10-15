# Dispatch Assignment

## Working Directory
/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_reviewer_1

## Identity
Role: Lead Data & Schema Reviewer
Archetype: teamwork_preview_reviewer

## Inputs
- User Request: `/Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md` (read lines 48-96)
- Project Scope: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_orchestrator_2/PROJECT.md`
- Worker 1 Handoff: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_worker_1/handoff.md`
- Target Companies JSON: `/Users/a7970513448/Documents/antigravity/quirky-babbage/target_companies.json`
- Sync Script: `/Users/a7970513448/Documents/antigravity/quirky-babbage/sync_target_companies.py`
- Verification Suite: `/Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py`

## Task
Independently review the target companies dataset and synchronization code against all requirements:
1. Validate dataset cardinality: Confirm exactly 35 companies (satisfies 30-40 requirement).
2. Validate 10-column canonical schema adherence: Company Name, Industry Domain, Engineering Hubs, Primary Stack Focus, Headcount & Stability Tier, Career Portal URL, LinkedIn Jobs URL, Ratings, SDE-2 Compensation Band, Why It Matches.
3. Validate company qualification: Verify zero companies <100 headcount, zero IT body shops, and all companies represent stable product organizations.
4. Validate tech stack: Confirm 100% of companies require >=2 of React, React Native, CI/CD, Angular.
5. Validate compensation bands: Confirm all documented bands meet SDE-2 above-market standards (>= ₹18 LPA CTC).
6. Issue a clear verdict: APPROVE or REQUEST_CHANGES.
7. Write your report to `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_reviewer_1/handoff.md` and send message to orchestrator.

## 2026-09-23T19:00:42Z
Read /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_reviewer_1/DISPATCH.md and /Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md.
Working Directory: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_reviewer_1.
Task: Independently review target_companies.json and verification code against R1-R4 requirements (count, 10-column canonical schema, headcount >=100, core skills >=2 of 4, SDE-2 compensation benchmarks, URLs, and tailored value propositions). Write report with explicit verdict (APPROVE or REQUEST_CHANGES) to /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_reviewer_1/handoff.md and message orchestrator.

