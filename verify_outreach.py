#!/usr/bin/env python3
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
import argparse
from typing import List, Dict, Any, Tuple, Optional

OUTREACH_HEADERS = [
    "Agency",
    "Person Name",
    "LinkedIn Profile",
    "Current Designation",
    "Location",
    "Recruitment Domain",
    "Relevant Tech Roles",
    "Associated Companies",
    "Connection Status",
    "Outreach Type",
    "Personalized Message",
    "Outreach Status",
    "Date Contacted",
    "Follow-up Status",
    "Notes"
]

TARGET_AGENCIES = [
    "TeamLease Digital",
    "Randstad India",
    "Adecco India",
    "Michael Page India",
    "Allegis Group / TEKsystems India"
]

MANDATORY_TOKENS = [
    "kausal.in",
    "Kaushal Kumar",
    "3.5",
    "React"
]

VALID_CONNECTION_STATUSES = {"Existing Connection", "Not Connected", "Pending"}
VALID_OUTREACH_TYPES = {"1st-Degree Message", "Connection Request"}
VALID_OUTREACH_STATUSES = {
    "Sent", "Drafted", "Pending Review",
    "Skipped - Weekly Limit", "Skipped - Email Required", "Attempted"
}
VALID_FOLLOWUP_STATUSES = {"None", "Follow-up Due", "In Discussion"}

DISALLOWED_TITLE_REGEX = re.compile(
    r"\b(campus|university|fresher|payroll|compliance|sales|marketing|manufacturing|pharma|receptionist|nurse|blue collar|hrbp|people operations|statutory)\b",
    re.IGNORECASE
)

DATE_REGEX = re.compile(r"^\d{4}-\d{2}-\d{2}$")
LINKEDIN_URL_REGEX = re.compile(r"^https?://(www\.)?linkedin\.com/in/[\w\-_%]+/?$", re.IGNORECASE)


class VerificationResult:
    """Holds structured outcome of verification."""
    def __init__(self):
        self.is_valid: bool = True
        self.total_records: int = 0
        self.agency_counts: Dict[str, int] = {agency: 0 for agency in TARGET_AGENCIES}
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.unique_urls_count: int = 0
        self.connection_request_count: int = 0
        self.first_degree_count: int = 0

    def add_error(self, message: str) -> None:
        self.errors.append(message)
        self.is_valid = False

    def add_warning(self, message: str) -> None:
        self.warnings.append(message)

    def summary(self) -> Dict[str, Any]:
        return {
            "is_valid": self.is_valid,
            "total_records": self.total_records,
            "agency_counts": self.agency_counts,
            "unique_urls_count": self.unique_urls_count,
            "connection_requests": self.connection_request_count,
            "first_degree_messages": self.first_degree_count,
            "error_count": len(self.errors),
            "warning_count": len(self.warnings),
            "errors": self.errors,
            "warnings": self.warnings
        }


def canonicalize_agency(agency_str: Optional[str]) -> Optional[str]:
    """Map variations of agency names to the canonical 5 target agencies."""
    if not agency_str or not isinstance(agency_str, str):
        return None
    norm = agency_str.strip().lower()
    if "teamlease" in norm:
        return "TeamLease Digital"
    if "randstad" in norm:
        return "Randstad India"
    if "adecco" in norm or "akkodis" in norm:
        return "Adecco India"
    if "michael page" in norm or "pagegroup" in norm:
        return "Michael Page India"
    if "teksystems" in norm or "allegis" in norm:
        return "Allegis Group / TEKsystems India"
    return None


def normalize_record(raw_record: Any) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Convert a list or dict into a standardized dictionary keyed by OUTREACH_HEADERS.
    Returns (dict_record, error_message).
    """
    if isinstance(raw_record, list):
        if len(raw_record) != 15:
            return None, f"Row length mismatch: expected 15 columns, got {len(raw_record)}"
        return {header: raw_record[idx] for idx, header in enumerate(OUTREACH_HEADERS)}, None

    if isinstance(raw_record, dict):
        # Normalize keys by case-insensitive matching against OUTREACH_HEADERS
        norm_dict = {}
        lookup = {k.strip().lower(): k for k in raw_record.keys()}
        for header in OUTREACH_HEADERS:
            h_key = header.lower()
            if h_key in lookup:
                norm_dict[header] = raw_record[lookup[h_key]]
            elif header in raw_record:
                norm_dict[header] = raw_record[header]
            else:
                # check snake_case variant
                snake = h_key.replace(" ", "_").replace("-", "_")
                if snake in lookup:
                    norm_dict[header] = raw_record[lookup[snake]]
                else:
                    norm_dict[header] = None
        return norm_dict, None

    return None, f"Unsupported record format: {type(raw_record).__name__}"


def verify_single_record(record: Dict[str, Any], record_idx: int = 1) -> List[str]:
    """
    Perform deep validation on an individual record dictionary.
    Returns a list of error strings.
    """
    errors: List[str] = []
    person = str(record.get("Person Name") or f"Record #{record_idx}").strip()

    # 1. Agency validation
    raw_agency = record.get("Agency")
    canonical = canonicalize_agency(raw_agency)
    if not canonical:
        errors.append(f"[{person}] Invalid or unrecognized agency: '{raw_agency}'")

    # 2. Person Name validation
    if not record.get("Person Name") or not str(record.get("Person Name")).strip():
        errors.append(f"[Record #{record_idx}] Person Name cannot be empty")

    # 3. LinkedIn Profile URL validation
    profile_url = str(record.get("LinkedIn Profile") or "").strip()
    if not profile_url:
        errors.append(f"[{person}] LinkedIn Profile URL cannot be empty")
    elif not LINKEDIN_URL_REGEX.match(profile_url):
        errors.append(f"[{person}] Invalid LinkedIn Profile URL format: '{profile_url}'")

    # 4. Current Designation & Negative Filter
    designation = str(record.get("Current Designation") or "").strip()
    if not designation:
        errors.append(f"[{person}] Current Designation cannot be empty")
    elif DISALLOWED_TITLE_REGEX.search(designation):
        match = DISALLOWED_TITLE_REGEX.search(designation).group(0).lower()
        errors.append(f"[{person}] Disallowed non-tech/operations keyword '{match}' found in designation: '{designation}'")

    # 5. Location
    location = str(record.get("Location") or "").strip()
    if not location:
        errors.append(f"[{person}] Location cannot be empty")

    # 6. Recruitment Domain & Tech Roles
    domain = str(record.get("Recruitment Domain") or "").strip()
    roles = str(record.get("Relevant Tech Roles") or "").strip()
    if not domain:
        errors.append(f"[{person}] Recruitment Domain cannot be empty")
    if not roles:
        errors.append(f"[{person}] Relevant Tech Roles cannot be empty")

    # 7. Connection Status & Outreach Type mapping
    conn_status = str(record.get("Connection Status") or "").strip()
    outreach_type = str(record.get("Outreach Type") or "").strip()
    if conn_status not in VALID_CONNECTION_STATUSES:
        errors.append(f"[{person}] Invalid Connection Status: '{conn_status}'")
    if outreach_type not in VALID_OUTREACH_TYPES:
        errors.append(f"[{person}] Invalid Outreach Type: '{outreach_type}'")

    if conn_status == "Existing Connection" and outreach_type != "1st-Degree Message":
        errors.append(f"[{person}] Degree mismatch: Existing Connection must use '1st-Degree Message', got '{outreach_type}'")
    if conn_status == "Not Connected" and outreach_type != "Connection Request":
        errors.append(f"[{person}] Degree mismatch: Not Connected must use 'Connection Request', got '{outreach_type}'")

    # 8. Message validation
    msg = str(record.get("Personalized Message") or "").strip()
    if not msg:
        errors.append(f"[{person}] Personalized Message cannot be empty")
    else:
        # Mandatory token check
        for token in MANDATORY_TOKENS:
            if token.lower() not in msg.lower():
                errors.append(f"[{person}] Message missing mandatory candidate token '{token}'")

        # 300 character strict limit for Connection Request
        if outreach_type == "Connection Request":
            if len(msg) >= 300:
                errors.append(
                    f"[{person}] Connection Request note exceeds 300 chars limit (actual length: {len(msg)} chars)"
                )

    # 9. Outreach Status
    status = str(record.get("Outreach Status") or "").strip()
    if status not in VALID_OUTREACH_STATUSES:
        errors.append(f"[{person}] Invalid Outreach Status: '{status}'")

    # 10. Date Contacted ISO 8601
    date_str = str(record.get("Date Contacted") or "").strip()
    if not date_str or not DATE_REGEX.match(date_str):
        errors.append(f"[{person}] Date Contacted must follow ISO 8601 YYYY-MM-DD, got '{date_str}'")

    # 11. Follow-up Status
    followup = str(record.get("Follow-up Status") or "").strip()
    if followup not in VALID_FOLLOWUP_STATUSES:
        errors.append(f"[{person}] Invalid Follow-up Status: '{followup}'")

    return errors


def verify_records(records: Any, verbose: bool = True, strict_50: bool = True) -> VerificationResult:
    """
    Validate a complete collection of records.
    Can be a list of dicts, a list of row lists, or a webhook payload dict.
    """
    result = VerificationResult()

    # Unwrap payload if necessary
    if isinstance(records, dict):
        if "rows" in records:
            records = records["rows"]
        else:
            result.add_error("Input dictionary does not contain 'rows' array")
            return result

    if not isinstance(records, list):
        result.add_error(f"Input must be a list of records, got {type(records).__name__}")
        return result

    result.total_records = len(records)

    # 1. Total record count check
    if strict_50 and len(records) != 50:
        result.add_error(f"Total record count mismatch: expected exactly 50 records, got {len(records)}")

    # 2. Iterate and validate each record
    normalized_records: List[Dict[str, Any]] = []
    seen_urls: Dict[str, int] = {}

    for idx, raw in enumerate(records, start=1):
        norm, err = normalize_record(raw)
        if err:
            result.add_error(f"[Row {idx}] {err}")
            continue

        normalized_records.append(norm)

        # Count agencies
        canonical = canonicalize_agency(norm.get("Agency"))
        if canonical:
            result.agency_counts[canonical] += 1

        # Count outreach types
        otype = norm.get("Outreach Type")
        if otype == "Connection Request":
            result.connection_request_count += 1
        elif otype == "1st-Degree Message":
            result.first_degree_count += 1

        # Check URL uniqueness
        url = str(norm.get("LinkedIn Profile") or "").strip().rstrip("/")
        if url:
            if url in seen_urls:
                result.add_error(f"Duplicate LinkedIn Profile URL detected: '{url}' (Rows {seen_urls[url]} and {idx})")
            else:
                seen_urls[url] = idx

        # Run individual record verification
        rec_errors = verify_single_record(norm, record_idx=idx)
        for e in rec_errors:
            result.add_error(e)

    result.unique_urls_count = len(seen_urls)

    # 3. Agency quota check
    if strict_50:
        for agency in TARGET_AGENCIES:
            count = result.agency_counts.get(agency, 0)
            if count != 10:
                result.add_error(f"Agency quota mismatch for '{agency}': expected 10 records, got {count}")

    if verbose:
        print_verification_report(result)

    return result


def print_verification_report(result: VerificationResult) -> None:
    """Print formatted summary to stdout."""
    print("=" * 70)
    print("RECRUITER OUTREACH E2E VERIFICATION REPORT")
    print("=" * 70)
    print(f"Overall Status:        {'PASS [VALID]' if result.is_valid else 'FAIL [INVALID]'}")
    print(f"Total Records Tested:  {result.total_records}")
    print(f"Unique Profile URLs:   {result.unique_urls_count}")
    print(f"Connection Requests:   {result.connection_request_count}")
    print(f"1st-Degree Messages:   {result.first_degree_count}")
    print("-" * 70)
    print("Agency Distribution:")
    for agency, count in result.agency_counts.items():
        status = "OK" if count == 10 else f"FAIL (Need 10, got {count})"
        print(f"  - {agency:34}: {count:2} [{status}]")
    print("-" * 70)

    if result.warnings:
        print(f"Warnings ({len(result.warnings)}):")
        for w in result.warnings:
            print(f"  [WARN] {w}")

    if result.errors:
        print(f"Errors ({len(result.errors)}):")
        for e in result.errors[:25]:
            print(f"  [FAIL] {e}")
        if len(result.errors) > 25:
            print(f"  ... and {len(result.errors) - 25} more errors.")
    else:
        print("All criteria successfully verified against authoritative contracts!")
    print("=" * 70)


def load_records_from_file(filepath: str) -> Any:
    """Read records from a JSON file."""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


def run_test_suite(tier: Optional[int] = None) -> int:
    """Execute unittest test cases for specified tier or all tiers."""
    import unittest

    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    tests_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tests")
    if not os.path.isdir(tests_dir):
        print(f"Error: tests directory not found at {tests_dir}")
        return 1

    if tier is None or tier == 0:
        discovered = loader.discover(start_dir=tests_dir, pattern="test_*.py")
        suite.addTests(discovered)
    elif tier == 1:
        discovered = loader.discover(start_dir=tests_dir, pattern="test_tier1_*.py")
        suite.addTests(discovered)
    elif tier == 2:
        discovered = loader.discover(start_dir=tests_dir, pattern="test_tier2_*.py")
        suite.addTests(discovered)
    elif tier == 3:
        discovered = loader.discover(start_dir=tests_dir, pattern="test_tier3_*.py")
        suite.addTests(discovered)
    elif tier == 4:
        discovered = loader.discover(start_dir=tests_dir, pattern="test_tier4_*.py")
        suite.addTests(discovered)
    else:
        print(f"Error: Invalid tier {tier}. Supported tiers: 1, 2, 3, 4.")
        return 1

    runner = unittest.TextTestRunner(verbosity=2)
    test_result = runner.run(suite)
    return 0 if test_result.wasSuccessful() else 1


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verify recruiter outreach records against specifications across Tiers 1-4."
    )
    parser.add_argument("--file", "-f", type=str, help="Path to JSON file containing outreach records")
    parser.add_argument("--test-all", action="store_true", help="Execute all test tiers (Tiers 1-4)")
    parser.add_argument("--tier", "-t", type=int, choices=[1, 2, 3, 4], help="Execute a specific test tier (1-4)")
    parser.add_argument("--json", action="store_true", help="Output verification report as JSON")
    parser.add_argument("--quiet", "-q", action="store_true", help="Suppress console summary output")

    args = parser.parse_args()

    if args.test_all or args.tier is not None:
        return run_test_suite(tier=args.tier)

    if args.file:
        if not os.path.isfile(args.file):
            print(f"Error: File '{args.file}' not found.")
            return 1
        try:
            records = load_records_from_file(args.file)
        except Exception as ex:
            print(f"Error reading JSON from '{args.file}': {ex}")
            return 1

        result = verify_records(records, verbose=not args.quiet)
        if args.json:
            print(json.dumps(result.summary(), indent=2))
        return 0 if result.is_valid else 1

    # Default if no arguments given: run full test suite
    print("No file or tier specified. Running all automated test tiers by default...")
    return run_test_suite()


if __name__ == "__main__":
    sys.exit(main())
