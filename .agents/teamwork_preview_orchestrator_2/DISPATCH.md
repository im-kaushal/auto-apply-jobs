## 2026-09-23T18:46:22Z

You are the Project Orchestrator (teamwork_preview_orchestrator) for this task.

Working Directory: /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/teamwork_preview_orchestrator_2
Project / Workspace Directory: /Users/a7970513448/Documents/antigravity/quirky-babbage
Original Request File: /Users/a7970513448/Documents/antigravity/quirky-babbage/ORIGINAL_REQUEST.md (see header ## 2026-09-23T18:44:58Z)

TASK:
Research, vet, and compile a verified portfolio of 30 to 40 underrated, high-paying product companies (minimum 100+ employees, financially stable) hiring Software Engineers with expertise in React, React Native, CI/CD, and Angular, and synchronize the enriched dataset into the target companies tracker in the Google Sheet.

Requirements & Acceptance Criteria:
R1. Company Sourcing and Headcount Qualification:
- Identify and curate 30 to 40 high-caliber, underrated product companies (expanding upon examples such as Nike, Samsung, Airtel, Cult.fit, Agoda, BookMyShow, Ixigo).
- Must be established product companies with a verified minimum of 100+ full-time employees and financial stability.
- Sourced across Pan-India technology centers (Bengaluru, NCR/Gurugram, Hyderabad, Pune, Mumbai) and international remote-friendly product organizations.
- Exclude early-stage unproven startups (<100 headcount) and low-paying IT body shops / legacy staffing vendors.

R2. Tech Stack and Compensation Verification:
- For every company identified, independently verify against LinkedIn, company career portals, job boards, AmbitionBox, Glassdoor, and Instahyre.
- Engineering hiring criteria: Active or recurring open requisitions for Software Engineer / Frontend / Mobile roles requiring React, React Native, CI/CD pipelines, or Angular. (100% of companies must hire for at least two of the core target skills: React, React Native, CI/CD, or Angular).
- Compensation quality: Confirm competitive, above-market pay bands (evaluated against industry peer benchmarks for 2-5 years experience / SDE-2 tier) documented from AmbitionBox, Glassdoor, or Instahyre.

R3. Data Enrichment and Schema Standardization:
Compile the verified companies with standardized attributes:
- Company Name
- Industry Domain / Product Category (e.g. TravelTech, FitnessTech, Media & Entertainment, Consumer Electronics, Enterprise SaaS)
- Engineering Hubs / Work Arrangements (e.g. Bengaluru, Gurugram, Hybrid, Pan-India / Global Remote)
- Primary Frontend & Mobile Stack Focus (React, React Native, Angular, CI/CD)
- Approximate Headcount & Stability Tier (100-500, 500-1000, 1000-5000, 5000+)
- Career Portal URL & LinkedIn Jobs URL (valid, live links)
- Glassdoor / AmbitionBox Ratings and Compensation Assessment
- Why It Matches / Value Proposition for Candidate

R4. Automated Synchronization & Verification:
- Synchronize all records into the Google Sheet via the Apps Script Webhook (tracker_config.json) under the Target Companies tab.
- Provide an automated programmatic verification test script that inspects and validates the dataset against all constraints (count, headcount, skill tokens, URL validity, and column schema) and exits with code 0.

Available Skills and Files:
- Skill: frontend-job-search-tracker at /Users/a7970513448/Documents/antigravity/quirky-babbage/.agents/skills/frontend-job-search-tracker/SKILL.md
- tracker_config.json at /Users/a7970513448/Documents/antigravity/quirky-babbage/tracker_config.json
- Reference update_sheet.py for webhook push payload structure (payload format: {"date": "Target Companies", "headers": [...], "rows": [...]}).

Lifecycle & Coordination:
- Create and maintain your BRIEFING.md, plan.md, and progress.md in your working directory.
- Dispatch subagents as needed for research, enrichment, script generation, and testing.
- When done, run the verification script, ensure all criteria are met, write handoff.md, and report victory to Sentinel.
