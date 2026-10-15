# Plan: Target Companies Portfolio & Google Sheets Sync

## Objective
Research, vet, compile, and synchronize 30 to 40 verified underrated, high-paying product companies (100+ headcount, financially stable) hiring for React, React Native, CI/CD, and Angular into the Target Companies Google Sheet tab, and verify programmatically.

## Milestones & Steps

### Step 1: Survey & Specification Mapping
- Spawn 3 Explorers in parallel:
  - `explorer_1`: Technical inspection of workspace, `tracker_config.json`, `update_sheet.py`, Google Sheet schema, and webhook payload structure.
  - `explorer_2`: Domain skill inspection (`frontend-job-search-tracker`) and candidate profile matching criteria.
  - `explorer_3`: Initial sourcing landscape for 30-40 underrated, high-paying product companies (100+ employees, Pan-India & Remote).
- Merge findings and create `PROJECT.md` at project root with Feature Inventory, Architecture, and Schemas.

### Step 2: Implementation - Sourcing, Tech Stack & Compensation Research
- Dispatch Worker to compile the verified 30-40 companies:
  - 100+ headcount confirmed.
  - >=2 core skills required (React, React Native, CI/CD, Angular).
  - Compensation data from AmbitionBox/Glassdoor/Instahyre.
  - Live career portal & LinkedIn jobs URLs.
  - Complete fields: Domain, Hubs, Stack, Headcount, URLs, Ratings, Value Prop.

### Step 3: Google Sheets Sync & Automated Test Script
- Dispatch Worker to:
  - Implement and execute sync script pushing verified records to the "Target Companies" tab via webhook (`tracker_config.json`).
  - Create automated programmatic verification test script (`verify_target_companies.py`) checking all constraints and exit code 0.

### Step 4: Multi-Agent Review, Adversarial Stress Testing & Forensic Audit
- Spawn 2 Reviewers to independently verify data completeness, schema accuracy, and sheet update.
- Spawn 2 Challengers to adversarially test live URLs, headcount bounds, skill token coverage, and compensation claims.
- Spawn 1 Forensic Auditor to verify no hardcoding, fake data, or test tampering.

### Step 5: Gate Evaluation & Reporting
- Evaluate GATE_STATUS.md.
- Write handoff.md.
- Send completion message to parent (Sentinel).
