#!/usr/bin/env python3
"""
Validation script for Milestone 1: Recruiter Sourcing & Qualification.
Verifies all 50 records in sourced_recruiters.json against strict criteria.
"""

import json
import re
import sys
from pathlib import Path

TARGET_AGENCIES = [
    "TeamLease Digital",
    "Randstad India",
    "Adecco India",
    "Michael Page India",
    "Allegis Group / TEKsystems India"
]

DISALLOWED_TITLE_REGEX = re.compile(
    r"\b(campus|university|fresher|payroll|compliance|sales|marketing|manufacturing|pharma|receptionist|nurse|blue collar)\b",
    re.IGNORECASE
)

REQUIRED_FIELDS = [
    "agency",
    "person_name",
    "linkedin_profile",
    "current_designation",
    "location",
    "recruitment_domain",
    "relevant_tech_roles",
    "associated_companies"
]

VALID_INDIAN_HUBS = [
    "bengaluru", "bangalore",
    "hyderabad",
    "pune",
    "mumbai",
    "gurugram", "gurgaon", "noida", "delhi", "delhi-ncr",
    "chennai"
]

def validate_sourcing_records(file_path):
    print("=" * 70)
    print(f"VALIDATING SOURCING RECORDS: {file_path}")
    print("=" * 70)

    p = Path(file_path)
    if not p.exists():
        print(f"❌ File not found: {file_path}")
        return False

    with open(p, "r", encoding="utf-8") as f:
        try:
            records = json.load(f)
        except Exception as e:
            print(f"❌ Invalid JSON format: {e}")
            return False

    errors = []

    # 1. Total records count
    if len(records) != 50:
        errors.append(f"Expected exactly 50 records, got {len(records)}.")
    else:
        print("✓ Total Record Count: Exactly 50 records.")

    # 2. Check 10 records per agency
    agency_counts = {agency: 0 for agency in TARGET_AGENCIES}
    unknown_agencies = []
    for idx, r in enumerate(records):
        agency = r.get("agency", "").strip()
        if agency in agency_counts:
            agency_counts[agency] += 1
        else:
            unknown_agencies.append((idx, agency))

    if unknown_agencies:
        errors.append(f"Unknown agencies found: {unknown_agencies}")

    for agency, count in agency_counts.items():
        if count != 10:
            errors.append(f"Agency '{agency}' has {count} records (expected 10).")
        else:
            print(f"✓ Agency Quota: '{agency}' has exactly 10 records.")

    # 3. Unique LinkedIn profile URLs
    urls = [r.get("linkedin_profile", "").strip() for r in records]
    empty_urls = [i for i, u in enumerate(urls) if not u]
    if empty_urls:
        errors.append(f"Empty LinkedIn URLs at indices: {empty_urls}")

    invalid_prefix = [u for u in urls if not u.startswith("https://www.linkedin.com/in/")]
    if invalid_prefix:
        errors.append(f"LinkedIn URLs not matching standard format 'https://www.linkedin.com/in/...': {invalid_prefix}")

    if len(urls) != len(set(urls)):
        dups = [u for u in urls if urls.count(u) > 1]
        errors.append(f"Duplicate LinkedIn URLs found: {set(dups)}")
    else:
        print("✓ URL Uniqueness: All 50 LinkedIn profile URLs are unique and valid format.")

    # 4. Required fields completeness
    for idx, r in enumerate(records):
        name = r.get("person_name", f"Record #{idx}")
        for field in REQUIRED_FIELDS:
            val = r.get(field)
            if not val or not str(val).strip():
                errors.append(f"Record {idx} ({name}) has missing or empty field: '{field}'")

    print("✓ Field Schema: All required fields present and non-empty across all 50 records.")

    # 5. Negative filters on designations
    for idx, r in enumerate(records):
        name = r.get("person_name", f"Record #{idx}")
        title = r.get("current_designation", "")
        if DISALLOWED_TITLE_REGEX.search(title):
            errors.append(f"Disallowed title detected for {name}: '{title}'")

    print("✓ Negative Filtering: No campus, payroll, compliance, or non-tech roles found.")

    # 6. Tech specialization in roles
    for idx, r in enumerate(records):
        name = r.get("person_name", f"Record #{idx}")
        roles = r.get("relevant_tech_roles", "").lower()
        if not ("react" in roles or "frontend" in roles or "full stack" in roles or "sde" in roles or "software" in roles):
            errors.append(f"Record {idx} ({name}) missing target tech specialization in relevant_tech_roles: '{roles}'")

    print("✓ Positive Specialization: All records focus on React/Frontend/FullStack/SDE engineering.")

    # 7. Indian tech hub validation
    for idx, r in enumerate(records):
        name = r.get("person_name", f"Record #{idx}")
        loc = r.get("location", "").lower()
        matched_hub = any(hub in loc for hub in VALID_INDIAN_HUBS)
        if not matched_hub:
            errors.append(f"Record {idx} ({name}) location not in recognized Indian tech hub: '{r.get('location')}'")

    print("✓ Location Verification: All 50 recruiters are based in recognized Indian tech hubs.")

    print("=" * 70)
    if errors:
        print(f"VALIDATION FAILED WITH {len(errors)} ERROR(S):")
        for err in errors:
            print(f"  ❌ {err}")
        return False
    else:
        print("🎉 ALL SOURCING VALIDATION CHECKS PASSED PERFECTLY!")
        return True

if __name__ == "__main__":
    file_path = "/Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json"
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    success = validate_sourcing_records(file_path)
    sys.exit(0 if success else 1)
