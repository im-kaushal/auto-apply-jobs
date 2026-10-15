---
name: frontend-job-search-tracker
description: >-
  Automate daily frontend and SDE-2 engineering job searches, match scoring against candidate profiles,
  LinkedIn referral discovery, and Google Sheets tracker maintenance. Use when searching for frontend roles,
  tracking job postings across target companies, scoring jobs against a candidate resume, finding referral
  contacts, or updating a rolling daily job tracker spreadsheet.
---

# Frontend Job Search Tracker Skill

Automates daily sourcing, qualification, scoring, referral research, and Google Sheets tracking for Frontend Engineer, SDE-2, and Software Engineer II roles across target companies.

## When to Use
- When running a daily or periodic automated frontend job search.
- When searching job boards and company career portals for roles matching a specific engineering profile.
- When scoring job descriptions against a candidate resume using a structured rubric.
- When identifying relevant LinkedIn referral contacts for open roles.
- When maintaining and updating a rolling daily Google Sheets job tracker.

## Core Workflow

### 1. Identify Time and Search Window
- Determine current date and time in the user's local timezone (e.g. IST).
- Set a strict 24-hour lookback window from execution time. Only consider positions published, refreshed, or active within this window.

### 2. Sourced Portals and Search Queries
Search across target company watchlist categories:
- Fintech and Banking (PayPal, PhonePe, Razorpay, CRED, Deutsche Bank, JPMC, Citi, Visa, Wells Fargo).
- E-Commerce and Quick Commerce (Flipkart, Amazon, Myntra, Meesho, Zepto, Blinkit, Swiggy).
- Enterprise SaaS and Developer Tools (ServiceNow, Atlassian, Adobe, Databricks, HighLevel).
- Big Tech and Global Tech Centers (Google, Microsoft, LinkedIn, Disney, Walmart Global Tech).

### 3. Strict Filtering Rules
- Exclude student internships, new grad (0-1 yr), and senior/staff (8+ yrs).
- Experience range: 2-5 years.

### 4. Six-Factor Candidate Match Scoring (0-100 Rubric)
Score each candidate position out of 100 points:
- Technical Match (40 pts)
- Experience Match (20 pts)
- Engineering Quality (15 pts)
- AI Tools Usages (10 pts)
- CI/CD (15 pts)
- Location (5 pts)
- Target Company Preference (10 pts)
- Overall Domain Fit (5 pts)

Retain only jobs scoring 50+ (Strong Match: 70-84, Excellent Match: 85-100).

### 5. Referral Contact Discovery
For top-scoring opportunities, identify 2-4 public LinkedIn contacts:
- Engineering Managers (EM, Sr EM, Director)
- Technical Leads / Lead Engineers
- Staff / Senior Software Engineers in the same team or hub
- Technical Recruiters / Talent Acquisition Partners

### 6. Google Sheets Tracker Maintenance
- Target Sheet: Maintain rolling 7 daily date tabs (YYYY-MM-DD).
- Strictly preserve permanent reference tabs (e.g. Target Companies).
- Populate the standard columns.
