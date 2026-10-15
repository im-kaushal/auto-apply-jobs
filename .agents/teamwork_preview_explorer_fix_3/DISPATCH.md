# Dispatch Assignment: Remediation Explorer 3 (Webhook & Live Sync Specialist)

## Working Directory
/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_fix_3

## Identity
Role: Webhook Sync & Verification Strategist
Archetype: teamwork_preview_explorer

## Context & Inputs
- User Request: `/Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md` (read lines 48-96)
- Project Scope: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_orchestrator_2/PROJECT.md`
- Sync Script: `/Users/a7970513448/Documents/antigravity/quirky-babbage/sync_target_companies.py`
- Reviewer 2 Handoff: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_reviewer_2/handoff.md`
- Config: `/Users/a7970513448/Documents/antigravity/quirky-babbage/tracker_config.json`

## Review Feedback to Address
1. Reviewer 2 finding: Live Google Sheet "Target Companies" tab has not been updated (currently has 142 legacy rows in 5 columns).
2. Reviewer 2 finding: `sync_target_companies.py` does not parse `response_body` for Apps Script JSON error messages or HTML error pages.

## Task
1. Formulate the exact fix strategy for `sync_target_companies.py`:
   - Fortify response body parsing to detect `{"status": "error"}` or unexpected HTML.
   - Design automated post-sync verification that fetches the live CSV from Google Sheets (`export?format=csv&sheet=Target%20Companies`) and confirms the 10 headers and 35 company rows are live.
2. Outline the step-by-step execution protocol for the downstream worker.
3. Write your complete analysis and recommended changes to `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_explorer_fix_3/handoff.md` and message orchestrator.
