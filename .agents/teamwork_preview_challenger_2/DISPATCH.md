# Dispatch Assignment

## Working Directory
/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_challenger_2

## Identity
Role: Adversarial Code & Skill Matrix Challenger
Archetype: teamwork_preview_challenger

## Inputs
- User Request: `/Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md` (read lines 48-96)
- Project Scope: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_orchestrator_2/PROJECT.md`
- Target Companies JSON: `/Users/a7970513448/Documents/antigravity/quirky-babbage/target_companies.json`
- Sync Script: `/Users/a7970513448/Documents/antigravity/quirky-babbage/sync_target_companies.py`
- Verification Suite: `/Users/a7970513448/Documents/antigravity/quirky-babbage/verify_target_companies.py`

## Task
Adversarially challenge the technical stack, compensation claims, and verification logic:
1. Challenge Core Skill Logic: Test whether any company falsely claims 2 skills (e.g. testing regex boundaries between "React" and "React Native"). Ensure every company genuinely hires for at least 2 distinct target skills {React, React Native, CI/CD, Angular}.
2. Challenge Compensation Claims: Stress-test compensation claims against industry benchmarks for SDE-2 (2-5 YOE). Verify no company falls below ₹18 LPA CTC floor.
3. Challenge Automated Test Robustness: Review `verify_target_companies.py` for false positives, edge-case bypasses, or loose assertions.
4. Execute empirical verification.
5. Issue an explicit verdict: APPROVE or REJECT.
6. Write your report to `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_challenger_2/handoff.md` and send message to orchestrator.

## 2026-09-23T19:00:42Z
Read /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_challenger_2/DISPATCH.md and /Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md.
Working Directory: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_challenger_2.
Task: Adversarially challenge core skill logic (>=2 of React, React Native, CI/CD, Angular with boundary checks), compensation floor (>= ₹18 LPA CTC), and test harness robustness in verify_target_companies.py. Write report with explicit verdict (APPROVE or REJECT) to /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_challenger_2/handoff.md and message orchestrator.

