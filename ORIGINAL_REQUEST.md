# Original User Request

## 2026-09-22T21:59:11Z

Find 10 verified technology recruiters from each of the first 5 agencies in the Google Sheet (TeamLease Digital, Randstad India, Adecco India, Michael Page India, and TEKsystems), generate personalized connection notes under 300 characters, send connection requests via the Chrome browser session, and record all 50 interactions into the Google Spreadsheet.

Working directory: /Users/a7970513448/Documents/antigravity/quirky-babbage
Integrity mode: development

## Requirements

### R1. Recruiter Sourcing Across Top 5 Agencies
- Source candidates from the first 5 agencies in the Agencies tab:
  1. TeamLease Digital
  2. Randstad India
  3. Adecco India
  4. Michael Page India
  5. Allegis Group / TEKsystems India
- For each agency, discover 10 active India-based IT recruiters / technical talent acquisition partners specializing in Software Engineering, Frontend (React/React Native), or Full Stack.
- Total target: 50 qualified recruiters.

### R2. Connection Status Audit & Message Personalization
- Inspect each profile in the logged-in Chrome session to determine connection degree (1st-degree vs 2nd/3rd-degree).
- If 1st-degree: queue a warm direct message referencing existing connection and kausal.in.
- If 2nd/3rd-degree: generate a personalized connection request note (<300 characters) mentioning Kaushal Kumar (3.5+ yrs React/React Native, kausal.in) and their agency's engineering hiring focus.

### R3. Automated Outreach Dispatch
- Execute the sending of connection requests and messages in the background via the active Chrome browser session.
- Handle modal popups, note text area inputs, and submission confirmations. Stop and report gracefully if LinkedIn's platform weekly invitation limit modal appears.

### R4. Google Spreadsheet Synchronization
- Update the Recruiter_Outreach tab in the Google Spreadsheet (https://docs.google.com/spreadsheets/d/1MUUvv4eULJP0uvcFAPoGP_B1y0AXyL0vhkTHoN1z_Po/edit?gid=10402156#gid=10402156) via the Apps Script Webhook.
- Populate all 15 standard tracking columns with recruiter names, profile URLs, agencies, personalized messages, and outreach statuses.

## Acceptance Criteria

### Sourcing & Verification
- [ ] Exactly 10 tech recruiters identified for each of the 5 agencies (50 total).
- [ ] All 50 profiles verified as currently employed at the respective agency in India.
- [ ] No generic campus HR, payroll, or non-technical staffing roles included.

### Execution & Delivery
- [ ] All 50 profiles attempted for connection request or direct message via the browser.
- [ ] Every request uses a personalized note under 300 characters linking to kausal.in.
- [ ] Recruiter_Outreach tab in Google Sheets updated with all 50 records.
- [ ] An automated verification script executes to confirm the rows in the Google Sheet.

## 2026-09-23T18:44:58Z

Research, vet, and compile a verified portfolio of 30 to 40 underrated, high-paying product companies (minimum 100+ employees, financially stable) hiring Software Engineers with expertise in React, React Native, CI/CD, and Angular, and synchronize the enriched dataset into the target companies tracker in the Google Sheet.

Working directory: /Users/a7970513448/Documents/antigravity/quirky-babbage
Integrity mode: development

## Requirements

### R1. Company Sourcing and Headcount Qualification
Identify and curate 30 to 40 high-caliber, underrated product companies (expanding upon examples such as Nike, Samsung, Airtel, Cult.fit, Agoda, BookMyShow, Ixigo):
- Must be established product companies with a verified minimum of 100+ full-time employees and financial stability.
- Sourced across Pan-India technology centers (Bengaluru, NCR/Gurugram, Hyderabad, Pune, Mumbai) and international remote-friendly product organizations.
- Exclude early-stage unproven startups (<100 headcount) and low-paying IT body shops / legacy staffing vendors.

### R2. Tech Stack and Compensation Verification
For every company identified, independently verify against LinkedIn, company career portals, job boards, AmbitionBox, Glassdoor, and Instahyre:
- Engineering hiring criteria: Active or recurring open requisitions for Software Engineer / Frontend / Mobile roles requiring React, React Native, CI/CD pipelines, or Angular.
- Compensation quality: Confirm competitive, above-market pay bands (evaluated against industry peer benchmarks for 2-5 years experience / SDE-2 tier).

### R3. Data Enrichment and Schema Standardization
Compile the verified companies with standardized attributes:
- Company Name
- Industry Domain / Product Category (e.g. TravelTech, FitnessTech, Media & Entertainment, Consumer Electronics, Enterprise SaaS)
- Engineering Hubs / Work Arrangements (e.g. Bengaluru, Gurugram, Hybrid, Pan-India / Global Remote)
- Primary Frontend & Mobile Stack Focus (React, React Native, Angular, CI/CD)
- Approximate Headcount & Stability Tier (100-500, 500-1000, 1000-5000, 5000+)
- Career Portal URL & LinkedIn Jobs URL
- Glassdoor / AmbitionBox Ratings and Compensation Assessment
- Why It Matches / Value Proposition for Candidate

### R4. Automated Synchronization & Verification
- Synchronize all records into the Google Sheet via the Apps Script Webhook (tracker_config.json) under the Target Companies tab.
- Provide an automated programmatic verification test script that inspects and validates the dataset against all constraints (count, headcount, skill tokens, URL validity, and column schema).

## Acceptance Criteria

### Research & Sourcing
- [ ] Exactly 30 to 40 distinct product companies documented.
- [ ] Zero companies with fewer than 100 employees; all companies have established business models and funding/revenue stability.
- [ ] 100% of companies confirmed to hire for at least two of the core target skills: React, React Native, CI/CD, or Angular.
- [ ] Documented compensation verification from AmbitionBox, Glassdoor, or Instahyre confirming strong pay bands for SDE-2 / Frontend roles.
- [ ] Scope encompasses both Pan-India technology hubs and Global Remote organizations.

### Data Delivery & Verification
- [ ] All company entries contain valid, live career portal links and LinkedIn job links.
- [ ] Google Sheet updated with all verified companies under the Target Companies tab with correct headers and clean formatting.
- [ ] Programmatic verification script runs and exits with code 0, confirming record count, field non-emptiness, URL format, and schema compliance.
