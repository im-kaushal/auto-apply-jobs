# Dispatch: E2E Test Writer (E2E Testing Track)

**Role**: E2E Test Suite Creator (`teamwork_preview_test_writer`)
**Working Directory**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/test_writer_e2e_1`
**User Request**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md`
**Project Plan**: `/Users/a7970513448/Documents/antigravity/quirky-babbage/PROJECT.md`

## Mission
Design and implement an end-to-end, opaque-box, requirement-driven test suite for the recruiter outreach system across Tiers 1–4, and publish `TEST_INFRA.md` and `TEST_READY.md`.

## Deliverables
1. `TEST_INFRA.md` at project root `/Users/a7970513448/Documents/antigravity/quirky-babbage/TEST_INFRA.md` following the template:
   - Test Philosophy (opaque-box, requirement-driven)
   - Feature Inventory mapping all requirements from `ORIGINAL_REQUEST.md`
   - Test Architecture (runner, test case format, directory layout)
   - Real-World Application Scenarios (Tier 4)
   - Coverage Thresholds
2. Automated Test Script:
   - Create `verify_outreach.py` in the project root that can independently validate the 50 outreach records against all acceptance criteria:
     - Record count exactly 50
     - Exactly 10 tech recruiters for each of the 5 agencies: TeamLease Digital, Randstad India, Adecco India, Michael Page India, Allegis Group / TEKsystems India
     - All 50 profile URLs unique LinkedIn URLs
     - Negative filter enforcement: strictly no campus, payroll, compliance, non-tech titles
     - Message length constraint: strictly < 300 characters for Connection Requests
     - Mandatory tokens present in messages: "kausal.in", "Kaushal Kumar", "3.5", "React"
     - All 15 columns populated according to schema
     - Validation against both staged JSON and Google Sheets API/webhook responses
3. Comprehensive test suite runner with unit tests for each tier (Tier 1: Feature Coverage, Tier 2: Boundary & Corner cases such as 299 vs 300 char limits, email challenge modals, weekly limit stops, Tier 3: Cross-feature combinations, Tier 4: Real-world acceptance scenarios).
4. Publish `TEST_READY.md` at project root `/Users/a7970513448/Documents/antigravity/quirky-babbage/TEST_READY.md` summarizing the test runner command, tiers, and feature checklist.
5. Report completion and test execution results in `handoff.md` in your working directory.

## 2026-09-22T22:08:01Z
You are the E2E Test Suite Creator (teamwork_preview_test_writer) for the E2E Testing Track.
Working directory: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/test_writer_e2e_1
User request: /Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md
Project plan: /Users/a7970513448/Documents/antigravity/quirky-babbage/PROJECT.md
Dispatch instructions: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/test_writer_e2e_1/DISPATCH.md

Your tasks:
1. Create /Users/a7970513448/Documents/antigravity/quirky-babbage/TEST_INFRA.md following the specification in DISPATCH.md and Project Pattern.
2. Implement /Users/a7970513448/Documents/antigravity/quirky-babbage/verify_outreach.py and the test suite across Tiers 1-4:
   - Tier 1: Feature Coverage (>=5 test cases per feature for 5 agencies, schema, candidate tokens, degree handling)
   - Tier 2: Boundary & Corner Cases (exact 300 char boundaries, 299 vs 300 chars, empty fields, duplicate URLs, email challenge modal triggers, weekly limit triggers)
   - Tier 3: Cross-Feature Interactions (pairwise combinations: e.g. 1st-degree with TeamLease, 2nd-degree with TEKsystems, weekly limit stop during Randstad processing)
   - Tier 4: Real-World Acceptance Scenarios (end-to-end full run validation with 50 live records)
3. Execute the test runner to verify test harness correctness and pass/fail behaviors.
4. Publish /Users/a7970513448/Documents/antigravity/quirky-babbage/TEST_READY.md when complete.
5. Write your handoff.md and send a message to parent when done.
