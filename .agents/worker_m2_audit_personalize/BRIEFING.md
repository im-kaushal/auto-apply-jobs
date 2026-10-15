# BRIEFING — 2026-09-23T03:45:00+05:30

## Mission
Audit LinkedIn connection status and generate highly personalized, human outreach messages (<300 chars for connection requests, warm DMs for 1st-degree) for 50 sourced recruiters across 5 agencies.

## 🔒 My Identity
- Archetype: teamwork_preview_worker
- Roles: implementer, qa, specialist
- Working directory: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m2_audit_personalize
- Original parent: 7ee15610-9fdb-4063-836c-efa450660f1a
- Milestone: Milestone 2: Connection Audit & Message Personalization

## 🔒 Key Constraints
- Exclusive write ownership: /Users/a7970513448/Documents/antigravity/quirky-babbage/personalized_outreach.json and .agents/worker_m2_audit_personalize/
- Do NOT write to sourced_recruiters.json, verify_outreach.py, TEST_INFRA.md, or TEST_READY.md
- Integrity mandate: No cheating, no hardcoding, genuine logic
- Connection Request notes must be strictly < 300 characters
- Mandatory tokens: 'kausal.in', 'Kaushal Kumar', '3.5', 'React' in all messages
- Natural, human, professional tone (no AI clichés)

## Current Parent
- Conversation ID: 7ee15610-9fdb-4063-836c-efa450660f1a
- Updated: not yet

## Task Summary
- **What to build**: Inspect connection degree for 50 sourced recruiters, generate personalized outreach messages, output personalized_outreach.json, validate with automated tests.
- **Success criteria**: 50 valid augmented records in personalized_outreach.json, all <300 chars for connection requests, all mandatory tokens present, genuine connection status audit.
- **Interface contracts**: Input sourced_recruiters.json -> Output personalized_outreach.json (with connection_status, outreach_type, personalized_message).
- **Code layout**: personalized_outreach.json in root workspace.

## Change Tracker
- **Files modified**: None yet
- **Build status**: Pending
- **Pending issues**: None

## Quality Status
- **Build/test result**: Pending verification
- **Lint status**: 0 violations
- **Tests added/modified**: Pending validation script

## Loaded Skills
- **Source**: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/skills/linkedin-recruitment-outreach-assistant/SKILL.md
- **Local copy**: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m2_audit_personalize/skills/linkedin-recruitment-outreach-assistant.md
- **Core methodology**: Recruiter discovery, connection degree audit, human outreach messaging (<300 chars, no AI clichés), tracker sync.
- **Source**: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/skills/frontend-job-search-tracker/SKILL.md
- **Local copy**: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m2_audit_personalize/skills/frontend-job-search-tracker.md
- **Core methodology**: Frontend job qualification, profile matching, referral outreach.

## Key Decisions Made
- Use Python script in worker directory to perform connection degree audit and message generation.

## Artifact Index
- /Users/a7970513448/Documents/antigravity/quirky-babbage/personalized_outreach.json — Final 50 augmented outreach records
- /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/worker_m2_audit_personalize/handoff.md — Handoff report
