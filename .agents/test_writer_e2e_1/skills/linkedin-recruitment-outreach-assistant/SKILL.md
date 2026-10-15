---
name: linkedin-recruitment-outreach-assistant
description: >-
  Identifies tech recruiters and staffing specialists at target recruitment agencies on LinkedIn, checks existing
  1st-degree connection status, and crafts personalized, human outreach messages or connection requests for
  software engineering opportunities. Use when discovering recruiter contacts from the agencies sheet, checking
  connection status, drafting non-AI-sounding outreach messages, or updating the outreach tracker.
---

# LinkedIn Recruitment Outreach Assistant

Automates the discovery of high-impact technical recruiters at partner staffing agencies, checks 1st-degree LinkedIn connection status, drafts authentic, human-toned outreach messages, and maintains a structured outreach tracker.

---

## Candidate Profile Baseline

All outreach messages must accurately reflect the candidate's authentic profile:
- **Name**: Kaushal Kumar
- **Portfolio / Website**: [https://kausal.in](https://kausal.in)
- **Role / Seniority**: Frontend Software Engineer / SDE-2 (3.5+ years experience)
- **Core Technology Stack**: React.js, React Native, TypeScript, JavaScript (ES6+), Next.js, Redux Toolkit, Tailwind CSS
- **Enterprise & Domain Experience**:
  - High-throughput trade settlement interfaces & Kafka event stream visualization on OpenShift/Harness (Citi Bank project)
  - Enterprise incident management workspace and design systems (Marriott project)
  - Mobile cross-platform applications with offline sync (React Native, Firebase)
- **Certifications**: Claude Certified Architect (Foundations), AWS Certified Developer Associate

---

## Source Spreadsheet Reference

- **Spreadsheet URL**: [Master Job & Agency Tracker](https://docs.google.com/spreadsheets/d/1MUUvv4eULJP0uvcFAPoGP_B1y0AXyL0vhkTHoN1z_Po/edit?gid=1839048928#gid=1839048928)
- **Source Tab**: `Agencies` (60 verified tech staffing & recruitment agencies across India)
- **Tracking Tab / Output**: `Recruiter_Outreach`

---

## Core Workflows

### Workflow 1: Find Relevant People on LinkedIn

Iterate through the agencies listed in the `Agencies` tab (e.g. Anzy Global, Success Pact, CareerNet, Michael Page, TEKsystems, Randstad, Adecco, etc.).

For each agency, search and identify relevant professionals prioritizing:
1. **IT Recruiters / Technical Recruiters**
2. **Talent Acquisition Specialists / Partners** (Tech Practice)
3. **Recruitment Consultants / Staffing Consultants** (Software Engineering)
4. **Practice Leads / Delivery Managers / Recruitment Managers** (IT/Digital)

#### Prioritization Criteria:
- **Current Employer**: Must be currently employed at the listed agency.
- **Location**: Based in India (Bengaluru, Hyderabad, Pune, Mumbai, Delhi-NCR, Chennai).
- **Hiring Focus**: Actively hiring for Software Engineer, Frontend Engineer, React, React Native, Full Stack, SDE-2/3.
- **Client Caliber**: Recruiting for established product startups or tier-1 enterprise/GCC tech companies.

#### Strict Negative Filters (Exclude Immediately):
- Generic campus/university recruiters (0-1 year campus drives only)
- Payroll, statutory compliance, or non-technical HR operations
- Non-IT recruiters (e.g., manufacturing, pharma, sales, finance executive search)
- Inactive profiles (no activity or role updates in 6+ months)

---

### Workflow 2: Check Existing Connections & Draft Direct Messages

For every relevant professional identified:
1. Verify their connection degree in Chrome/LinkedIn (1st-degree vs 2nd/3rd-degree).
2. **If Already Connected (1st-degree)**:
   - **DO NOT** send a connection request.
   - Prepare a personalized 1-on-1 direct message.
   - Reference that you are already connected in a natural, warm manner.
   - Mention their agency and hiring domain naturally.
   - Keep the tone friendly, polite, brief, and authentic—seeking their guidance/kindness without sounding like a copy-pasted sales pitch.

#### 1st-Degree Direct Message Template (Human, Concise):
> *Hey [First Name], hope you're having a good week!*  
> *Reaching out since we're connected here, and I know [Agency Name] partners with some fantastic tech teams.*  
> *I'm currently exploring new Frontend / SDE-2 opportunities in Bengaluru (open to hybrid/remote). I have about 3.5 years of experience building web and mobile apps primarily with React, TypeScript, and React Native—recently working on real-time trade settlement dashboards and incident management tools.*  
> *If you have a couple of minutes, I'd really appreciate your guidance or a quick check if anything on your radar might be a fit: https://kausal.in*  
> *No pressure at all if things are busy, but even pointing me in the right direction would mean a lot. Thanks so much! – Kaushal Kumar*

---

### Workflow 3: New Connection Requests (Not Connected)

For relevant professionals who are **NOT** connected (2nd or 3rd degree):
1. Prepare a personalized LinkedIn connection note strictly within LinkedIn's **300-character limit**.
2. Briefly introduce Kaushal as a Frontend / Software Engineer with 3.5+ years in React/React Native.
3. Reference their agency or tech hiring specialty authentically.
4. Express interest in connecting regarding technology opportunities.

#### Rules for Connection Notes:
- **Never claim prior interactions** if you haven't spoken before.
- **Never fabricate mutual connections, shared hobbies, or fake referrals.**
- **Never use cliché AI openings** like *"I came across your profile and was thoroughly impressed"* or *"I hope this message finds you well."*

#### Connection Request Notes (<300 chars):

*Option A (Startup/Unicorn Focus - Anzy, Success Pact, CareerNet, TopHire)*:
> *Hi [First Name], hope you're well! I'm a Frontend Engineer (3.5+ yrs in React/TypeScript) and know [Agency] works with top product teams. Exploring SDE-2 roles (kausal.in) and would love to connect and seek your guidance if any mandates align. Thanks, Kaushal!*

*Option B (Enterprise/GCC Focus - TEKsystems, Randstad, Adecco, Collabera)*:
> *Hi [First Name], noticed your tech hiring work at [Agency]. I'm a Software Engineer with 3.5+ yrs in enterprise React/Angular & banking UIs (kausal.in). Currently exploring SDE-2 openings and would love to connect. Best, Kaushal Kumar*

---

## Personalization Rules

Before drafting any outreach, extract and inspect:
1. **Recruiter's Specific Domain**: Look at their headline and recent posts (e.g. "Hiring React/Node devs for Fintech Unicorn" or "Scaling GCCs").
2. **Agency Client Alignment**:
   - Product/Startup Agencies (Anzy, Success Pact, SutraHR, Recro) -> Highlight React Native, high-performance UI, design systems, kausal.in.
   - Banking/Enterprise GCC Agencies (TEKsystems, Randstad, Collabera, ANSR) -> Highlight Citi Bank trade settlement, Kafka UI, OpenShift/Harness CI/CD.
3. **Tone Guidelines**:
   - Conversational, warm, humble, and polite.
   - Brief and easy to read on mobile.
   - Clear call-to-action (reviewing portfolio or keeping resume on file).

---

## Output & Tracking Schema

Maintain a structured tracking record for every contact in the `Recruiter_Outreach` tab:

| Column | Field Name | Description / Valid Values |
|---|---|---|
| A | **Agency** | Name of the recruitment firm (from Agencies tab) |
| B | **Person Name** | Full name of the recruiter/partner |
| C | **LinkedIn Profile** | Clickable URL to their LinkedIn profile |
| D | **Current Designation** | Exact job title (e.g., Lead Tech Recruiter, Talent Partner) |
| E | **Location** | City / Region (e.g., Bengaluru, Gurugram, Mumbai) |
| F | **Recruitment Domain** | Product Tech, FinTech, Enterprise GCC, SaaS |
| G | **Relevant Tech Roles** | Frontend, React, React Native, Full Stack, SDE-2 |
| H | **Associated Companies** | Known client companies (100+ employees) |
| I | **Connection Status** | `Existing Connection` / `Not Connected` |
| J | **Outreach Type** | `1st-Degree Message` / `Connection Request` |
| K | **Personalized Message** | The exact customized draft |
| L | **Outreach Status** | `Drafted` / `Pending Review` / `Sent` / `Replied` |
| M | **Date Contacted** | `YYYY-MM-DD` (when sent) |
| N | **Follow-up Status** | `None` / `Follow-up Due` / `In Discussion` |
| O | **Notes** | Direct email, phone, notice period preferences, etc. |

---

## Critical Safeguards & Human Approval Gate

1. **Human Approval Requirement**:
   - **Never auto-send messages without presenting the proposed draft to the user first.**
   - Display the recipient's name, role, agency, connection status, and exact message text in chat for confirmation.
2. **Anti-Duplication**:
   - Always check the `Recruiter_Outreach` tab and LinkedIn conversation history before contacting anyone.
   - Do not message multiple recruiters from the same small team on the same day.
3. **Data Integrity**:
   - If a recruiter's associated clients cannot be verified from public profiles or agency announcements, mark them as `Unverified` rather than guessing.
4. **Platform Respect**:
   - Limit connection requests to standard daily LinkedIn safety thresholds (maximum 15-20 personalized requests per day) to maintain account reputation.
