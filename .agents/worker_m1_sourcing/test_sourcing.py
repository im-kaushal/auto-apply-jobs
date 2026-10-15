#!/usr/bin/env python3
"""
Unit tests for Milestone 1: Sourced Recruiters Dataset
Validates /Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json
"""

import json
import re
import unittest
from pathlib import Path

SOURCED_RECRUITERS_PATH = Path("/Users/a7970513448/Documents/antigravity/quirky-babbage/sourced_recruiters.json")

EXPECTED_AGENCIES = [
    "TeamLease Digital",
    "Randstad India",
    "Adecco India",
    "Michael Page India",
    "Allegis Group / TEKsystems India"
]

DISALLOWED_PATTERN = re.compile(
    r"\b(campus|university|fresher|payroll|compliance|sales|marketing|manufacturing|pharma|receptionist|nurse|blue collar|hrbp|statutory)\b",
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


class TestSourcedRecruiters(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.assertTrue(cls, SOURCED_RECRUITERS_PATH.exists(), f"File missing: {SOURCED_RECRUITERS_PATH}")
        with open(SOURCED_RECRUITERS_PATH, "r", encoding="utf-8") as f:
            cls.records = json.load(f)

    def test_total_record_count(self):
        """Must contain exactly 50 recruiter records."""
        self.assertEqual(len(self.records), 50, f"Expected 50 records, got {len(self.records)}")

    def test_exact_agency_quotas(self):
        """Must contain exactly 10 records per agency for all 5 target agencies."""
        counts = {agency: 0 for agency in EXPECTED_AGENCIES}
        for r in self.records:
            agency = r.get("agency")
            self.assertIn(agency, counts, f"Unexpected agency name: '{agency}'")
            counts[agency] += 1

        for agency, count in counts.items():
            self.assertEqual(count, 10, f"Agency '{agency}' has {count} records, expected 10")

    def test_unique_linkedin_urls(self):
        """All 50 LinkedIn profile URLs must be unique and properly formed."""
        urls = [r.get("linkedin_profile", "").strip() for r in self.records]
        self.assertEqual(len(urls), 50)
        self.assertEqual(len(set(urls)), 50, "Duplicate LinkedIn URLs detected!")
        for url in urls:
            self.assertTrue(url.startswith("https://www.linkedin.com/in/"), f"Invalid LinkedIn URL: {url}")
            self.assertGreater(len(url), len("https://www.linkedin.com/in/"))

    def test_required_fields_present_and_non_empty(self):
        """All required schema fields must be present and non-empty strings."""
        for idx, r in enumerate(self.records):
            name = r.get("person_name", f"Record {idx}")
            for field in REQUIRED_FIELDS:
                self.assertIn(field, r, f"Record {idx} ({name}) missing field '{field}'")
                val = r[field]
                self.assertIsInstance(val, str, f"Record {idx} ({name}) field '{field}' is not string")
                self.assertTrue(val.strip(), f"Record {idx} ({name}) field '{field}' is empty")

    def test_negative_filtering_on_designations(self):
        """No recruiter may have a disallowed/non-tech title (campus, payroll, compliance, etc.)."""
        for idx, r in enumerate(self.records):
            title = r.get("current_designation", "")
            match = DISALLOWED_PATTERN.search(title)
            self.assertIsNone(match, f"Disallowed term '{match.group(0) if match else ''}' in title: '{title}'")

    def test_positive_tech_specialization(self):
        """All recruiters must specialize in technical recruiting with relevant frontend/React/SE mandates."""
        for idx, r in enumerate(self.records):
            roles = r.get("relevant_tech_roles", "").lower()
            has_tech = any(keyword in roles for keyword in ["react", "frontend", "full stack", "sde", "software"])
            self.assertTrue(has_tech, f"Recruiter {r.get('person_name')} lacks target tech focus: '{roles}'")

    def test_indian_tech_hub_locations(self):
        """All recruiters must be based in recognized Indian tech hubs."""
        for idx, r in enumerate(self.records):
            loc = r.get("location", "").lower()
            matched = any(hub in loc for hub in VALID_INDIAN_HUBS)
            self.assertTrue(matched, f"Recruiter {r.get('person_name')} location '{r.get('location')}' not in recognized tech hub")


if __name__ == "__main__":
    unittest.main()
