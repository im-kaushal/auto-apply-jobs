/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RepoFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const repoFiles: RepoFile[] = [
  {
    name: 'Kaushal_Kumar_Resume.md',
    path: 'public/Kaushal_Kumar_Resume.md',
    language: 'markdown',
    description: 'Kaushal Kumar\'s authentic 3.5+ YOE software engineering resume document.',
    content: `# Kaushal Kumar
Bangalore, India 560037 | +91 7970513448 | work.kaushal@yahoo.com
linkedin.com/in/im-kaushal | github.com/im-kaushal | kausal.in

## PROFESSIONAL SUMMARY
Frontend Software Engineer with 3.5+ years of experience building responsive web and mobile applications using React, Angular, React Native, and TypeScript. Expertise in frontend architecture, Core Web Vitals performance tuning, state management, and automated testing across banking, hospitality, and insurance domains. Proven track record of delivering enterprise-grade solutions for clients including Marriott, Citi Bank, and Colina Insurance.

## TECHNICAL SKILLS
- Frontend & Mobile: React.js, Angular, React Native, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Xcode, Android Studio
- State & Data Management: Redux Toolkit, Context API, TanStack Query (React Query), Kafka, Apache Flink, Helm
- Testing & Tools: Jest, React Testing Library, Jasmine, Karma, Webpack, Storybook, SonarQube, Git, Gradle, Maven, GitHub Copilot, Claude
- Cloud, DevOps & Storage: AWS (EC2, S3, Lambda), Docker, Jenkins, Harness, Firebase, MongoDB, PostgreSQL, Redis, JFrog, OpenShift, CI/CD

## PROFESSIONAL EXPERIENCE
### Software Engineer I – HashedIn by Deloitte (Jul 2024 – Present)
- Developed enterprise web application features using React.js and Angular, creating reusable component libraries to enforce design system standards across teams.
- Increased unit and integration test coverage to 90%+ using Jasmine and React Testing Library, reducing production bugs and ensuring WCAG accessibility compliance.
- Optimized frontend web performance, reducing average page load time from 4.1 seconds to 2.6 seconds by implementing code splitting, lazy loading, and Core Web Vitals fixes.
- Mentored 50+ software engineering interns on React and Angular core principles, conducted regular code reviews, and led on-boarding sessions.

### Software Engineer Trainee – Damco Solutions (Jan 2023 – Feb 2024)
- Built React Native component library using robust Systems Design patterns and accurate Technical Estimation, leveraging RAD and Agile Sprint Execution.
- Deployed 3 production React Native applications to the iOS App Store and Google Play Store, integrating Firebase, Realm DB, Redux, and JWT authentication.
- Resolved 180+ critical UI and API integration defects during development cycles, achieving stable UAT releases.

## KEY PROJECTS
- Marriott – mTrust Incident Management (Mar 2026 – Present): React.js, TanStack Query, Context API, Webpack, ServiceNow REST APIs
- Citi Bank Financial Applications (Jan 2025 – Feb 2026): Angular, Spring Boot, Helm, Kafka, Gradle, Jenkins, Harness, OpenShift, Gherkin
- Colina Insurance Mobile Application (Jul 2023 – Feb 2024): React Native, TypeScript, Redux Toolkit, Firebase, Realm

## CERTIFICATIONS
- Claude Certified Architect – Foundations – Anthropic (Jun 2026)
- AWS Certified Developer Associate – Amazon Web Services (Apr 2026)
- JavaScript Security Specialization – Coursera (Infosec) (Mar 2025)
- AWS Certified Cloud Practitioner – Amazon Web Services (May 2025)

## AWARDS
- Excellence Award (Deloitte, Jun 2026)
- Excellence Award (Deloitte, Jan 2026)
- Rising Star Award (HashedIn By Deloitte, May 2025)

## EDUCATION
- Bachelor of Technology in Computer Science (CGPA: 7.61) 2019 – 2023, Lovely Professional University`
  },
  {
    name: 'PROJECT.md',
    path: 'PROJECT.md',
    language: 'markdown',
    description: 'System architecture, milestones, feature inventory, and interface contracts.',
    content: `# Project: Recruiter Outreach & Google Sheets Tracker Automation

## Architecture
- **Data Flow**:
  1. Recruiter Sourcing: Discover & qualify 10 active tech recruiters for each of the 5 agencies (50 total).
  2. Connection Degree Audit & Personalization: Inspect profiles in logged-in Chrome session to determine degree; generate personalized note (<300 chars) for 2nd/3rd degree or warm DM for 1st degree with kausal.in and candidate profile.
  3. Automated Outreach Dispatch: Execute connection requests and messages in active Chrome session, handling modals, inputs, and weekly invitation limits gracefully.
  4. Google Spreadsheet Synchronization: Push 50 records with all 15 columns to the \`Recruiter_Outreach\` tab via the Apps Script Webhook.
  5. E2E Automated Verification: Execute verification script confirming the rows, columns, tokens, and agency distributions in Google Sheets.

## Feature Inventory
| # | Feature | Description | Milestone |
|---|---------|-------------|-----------|
| 1 | Sourcing - TeamLease Digital | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 |
| 2 | Sourcing - Randstad India | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 |
| 3 | Sourcing - Adecco India | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 |
| 4 | Sourcing - Michael Page India | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 |
| 5 | Sourcing - Allegis Group / TEKsystems India | 10 verified IT recruiters in India specializing in SE/Frontend/FullStack | M1 |
| 6 | Negative Filtering | Exclude campus, payroll, compliance, non-tech, inactive profiles | M1 |
| 7 | Connection Degree Audit | Inspect profiles in logged-in Chrome session (1st vs 2nd/3rd) | M2 |
| 8 | 1st-Degree Message Generation | Warm DM with candidate baseline, Citi/Marriott projects, kausal.in | M2 |
| 9 | 2nd/3rd-Degree Note Generation | Strictly <300 chars note with Kaushal Kumar, 3.5+ yrs, React/RN, kausal.in, agency name | M2 |
| 10 | Browser Outreach Automation | Automate Connect -> Add note -> Input -> Send via active Chrome session | M3 |
| 11 | Weekly Invitation Limit Handling | Detect weekly limit modal, halt gracefully, record status without crash | M3 |
| 12 | Email Challenge Handling | Dismiss private email prompts, pull from backup candidates | M3 |
| 13 | Google Sheets Webhook Sync | Format 50x15 records and push to Recruiter_Outreach tab via Apps Script Webhook | M4 |
| 14 | Automated Verification Test Suite | Execute verification script confirming all 50 records in Google Sheets | M5 |

## Interface Contracts
- **Sourcing -> Audit/Personalization**: List of 50 recruiter objects containing: agency, name, profile_url, designation, location, recruitment_domain, relevant_roles, associated_companies.
- **Audit/Personalization -> Browser Outreach**: List of 50 recruiter objects augmented with: connection_status (Existing Connection / Not Connected), outreach_type (1st-Degree Message / Connection Request), personalized_message (strictly <300 chars for requests, warm DM for 1st-degree).
- **Browser Outreach -> Spreadsheet Sync**: List of 50 recruiter objects augmented with: outreach_status (Sent / Skipped - Weekly Limit), date_contacted (2026-09-23), follow_up_status (None), notes.
- **Spreadsheet Sync -> Google Sheet**: Payload: {"date": "Recruiter_Outreach", "headers": OUTREACH_HEADERS, "rows": records} where records is 50 rows of 15 column values.`
  },
  {
    name: 'tracker_config.json',
    path: 'tracker_config.json',
    language: 'json',
    description: 'Target Google Sheet ID, Webhook endpoints, and candidate skill profile.',
    content: `{
  "spreadsheet_id": "1MUUvv4eULJP0uvcFAPoGP_B1y0AXyL0vhkTHoN1z_Po",
  "spreadsheet_url": "https://docs.google.com/spreadsheets/d/1MUUvv4eULJP0uvcFAPoGP_B1y0AXyL0vhkTHoN1z_Po/edit",
  "apps_script_webhook_url": "https://script.google.com/macros/s/AKfycby7GvgtNlJoIVL6L-OR2la73FMh3u_VqxKQgDV4wGRDHd8HiKoQSxfFM9NOoEkxwmDMwA/exec",
  "candidate_profile": {
    "name": "Kaushal Kumar",
    "location": "Bengaluru, India",
    "experience_years": 3.5,
    "primary_stack": ["React.js", "Angular", "React Native", "TypeScript", "Redux Toolkit", "TanStack Query", "Tailwind CSS"],
    "devops_cicd": ["OpenShift", "Harness", "Jenkins", "Docker", "AWS"],
    "ai_tools": ["Claude Certified Architect", "GitHub Copilot"],
    "domains": ["Banking/Fintech", "Hospitality/Incident Management", "Insurance"]
  }
}`
  },
  {
    name: 'verify_outreach.py',
    path: 'verify_outreach.py',
    language: 'python',
    description: 'Automated test harness verifying the 50 recruiter outreach records across 4 tiers.',
    content: `#!/usr/bin/env python3
"""
Automated Verification Script & Test Harness for Recruiter Outreach Records.
Validates all acceptance criteria:
1. Exactly 50 total records
2. Exactly 10 tech recruiters per agency across 5 target agencies:
   - TeamLease Digital
   - Randstad India
   - Adecco India
   - Michael Page India
   - Allegis Group / TEKsystems India
3. 50 unique LinkedIn profile URLs
4. Negative filter enforcement (strictly no campus, payroll, compliance, non-tech)
5. Message length constraint: strictly < 300 characters for Connection Requests
6. Mandatory tokens present: 'kausal.in', 'Kaushal Kumar', '3.5', 'React'
7. All 15 columns populated according to schema
8. Format agnostic: handles JSON list-of-dicts, row arrays, and webhook payloads
"""
import sys
import os
import re
import json

OUTREACH_HEADERS = [
    "Agency", "Person Name", "LinkedIn Profile", "Current Designation",
    "Location", "Recruitment Domain", "Relevant Tech Roles",
    "Associated Companies", "Connection Status", "Outreach Type",
    "Personalized Message", "Outreach Status", "Date Contacted",
    "Follow-up Status", "Notes"
]

TARGET_AGENCIES = [
    "TeamLease Digital",
    "Randstad India",
    "Adecco India",
    "Michael Page India",
    "Allegis Group / TEKsystems India"
]

MANDATORY_TOKENS = ["kausal.in", "Kaushal Kumar", "3.5", "React"]`
  },
  {
    name: 'update_sheet.py',
    path: 'update_sheet.py',
    language: 'python',
    description: 'Apps Script HTTP POST webhook client with 302 redirect following.',
    content: `import urllib.request
import json
import sys

WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby7GvgtNlJoIVL6L-OR2la73FMh3u_VqxKQgDV4wGRDHd8HiKoQSxfFM9NOoEkxwmDMwA/exec"

class PostRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return urllib.request.Request(newurl, headers={'User-Agent': 'Mozilla/5.0'})

def push_to_sheet(date_str, headers, rows):
    opener = urllib.request.build_opener(PostRedirectHandler)
    payload = {
        "date": date_str,
        "headers": headers,
        "rows": rows
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        WEBHOOK_URL,
        data=data,
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    with opener.open(req, timeout=45) as resp:
        result = resp.read().decode('utf-8')
        print(f"Sheet updated successfully: {result}")
        return result`
  },
  {
    name: 'verify_target_companies.py',
    path: 'verify_target_companies.py',
    language: 'python',
    description: '10-Gate compliance test suite for 35 curated product engineering companies.',
    content: `#!/usr/bin/env python3
"""
verify_target_companies.py
Comprehensive Automated Verification Suite for Target Product Companies Dataset.
Enforces all requirements from ORIGINAL_REQUEST.md (§2026-09-23T18:44:58Z),
including R1 (Headcount & Stability), R2 (Tech Stack & Comp), R3 (10-Column Canonical Schema),
and R4 (Google Sheets Synchronization & Format Compliance).
"""
EXPECTED_10_COLUMNS = [
    "Company Name", "Industry Domain", "Engineering Hubs", "Primary Stack Focus",
    "Headcount & Stability Tier", "Career Portal URL", "LinkedIn Jobs URL",
    "Ratings (Glassdoor / AmbitionBox)", "SDE-2 Compensation Band", "Why It Matches / Value Proposition"
]

VALID_HEADCOUNT_TIERS = ["100-500", "500-1000", "1000-5000", "5000+"]`
  }
];
