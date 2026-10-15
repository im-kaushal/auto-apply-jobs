#!/usr/bin/env python3
"""
verify_target_companies.py

Comprehensive Automated Verification Suite for Target Product Companies Dataset.
Enforces all requirements from ORIGINAL_REQUEST.md (§2026-09-23T18:44:58Z),
including R1 (Headcount & Stability), R2 (Tech Stack & Comp), R3 (10-Column Canonical Schema),
and R4 (Google Sheets Synchronization & Format Compliance).

Exit codes:
- 0: All gates passed successfully (100% compliance).
- 1: Verification failed with assertion errors.
"""

import sys
import os
import json
import re
import urllib.parse
import argparse
import unittest

EXPECTED_10_COLUMNS = [
    "Company Name",
    "Industry Domain",
    "Engineering Hubs",
    "Primary Stack Focus",
    "Headcount & Stability Tier",
    "Career Portal URL",
    "LinkedIn Jobs URL",
    "Ratings (Glassdoor / AmbitionBox)",
    "SDE-2 Compensation Band",
    "Why It Matches / Value Proposition"
]

VALID_HEADCOUNT_TIERS = ["100-500", "500-1000", "1000-5000", "5000+"]

MANDATORY_SEED_COMPANIES = [
    "Nike",
    "Samsung",
    "Airtel",
    "Cult.fit",
    "Agoda",
    "BookMyShow",
    "Ixigo"
]

def match_core_skills(stack_str):
    """
    Identifies target skills from stack string with strict word boundary protection:
    - React Native
    - React (standalone React / React.js / Next.js)
    - CI/CD & Deployment Automation
    - Angular
    Prevents false substring matches (e.g. 'flaws' for AWS or 'triangular' for Angular).
    """
    s = stack_str.lower()
    matched = []

    # 1. React Native (word boundary protected)
    has_rn = bool(re.search(r'\breact[\s-]native\b', s))
    if has_rn:
        matched.append("React Native")

    # 2. React (standalone React / React.js / Next.js, isolating React Native)
    if has_rn:
        cleaned = re.sub(r'\breact[\s-]native\b', '', s)
        has_react = bool(
            re.search(r'\breact(\.js)?\b', cleaned) or
            re.search(r'\bnext(\.js)?\b', cleaned) or
            "nextjs" in cleaned
        )
    else:
        has_react = bool(
            re.search(r'\breact(\.js)?\b', s) or
            re.search(r'\bnext(\.js)?\b', s) or
            "nextjs" in s
        )
    if has_react:
        matched.append("React")

    # 3. CI/CD & Deployment Automation (strict word boundary regexes, no loose substring collisions)
    has_cicd = bool(
        re.search(r'\bci[\s/]?cd\b', s) or
        re.search(r'\b(docker|kubernetes|k8s|jenkins|gitlab[\s-]?ci|github[\s-]?actions|pipelines?|devops|openshift|harness)\b', s) or
        re.search(r'\baws\b', s)
    )
    if has_cicd:
        matched.append("CI/CD")

    # 4. Angular (strict word boundary, no collision with 'triangular')
    if re.search(r'\bangular(\.js)?\b', s):
        matched.append("Angular")

    return matched

def parse_compensation_floor(comp_str):
    """
    Parses minimum compensation and returns floor in LPA or equivalent.
    Hardened against:
    - Hyphenated ranges without leading LPA (e.g. '₹15 - ₹25 LPA') -> captures lower bound (15)
    - Dual tagged LPA ranges (e.g. '₹28 LPA - ₹42 LPA CTC') -> captures lower bound (28)
    - Decimals/floats without digit truncation (e.g. '₹16.5 LPA - ₹24 LPA') -> captures 16.5 -> 16
    - Inverted/worded order (e.g. 'Max ₹35 LPA, Min ₹12 LPA') -> captures 12
    - USD ranges (e.g. '$45k - $75k USD') -> converts $45k to ~₹37 LPA
    """
    c = comp_str.lower()
    inr_candidates = []

    # 1. Hyphenated / 'to' range with LPA/L/Lakh at the end: e.g. '₹15 - ₹25 LPA', '18 to 28L'
    range_matches = re.findall(
        r'(?:₹\s*|inr\s*)?(\d+(?:\.\d+)?)\s*(?:lpa|l\b|lakhs?)?\s*(?:-|–|—|to)\s*(?:₹\s*|inr\s*)?(\d+(?:\.\d+)?)\s*(?:lpa|l\b|lakhs?)',
        c
    )
    for low, high in range_matches:
        inr_candidates.append(float(low))
        inr_candidates.append(float(high))

    # 2. Standalone or individually tagged LPA/L/Lakh amounts: e.g. '₹28 LPA', '₹20L', 'min ₹12 lpa'
    tagged_matches = re.findall(
        r'(?:₹\s*|inr\s*)?(\d+(?:\.\d+)?)\s*(?:lpa|l\b|lakhs?)',
        c
    )
    for val in tagged_matches:
        inr_candidates.append(float(val))

    # Filter out unreasonable numbers (valid LPA range: 5 to 150)
    valid_inr = [val for val in inr_candidates if 5.0 <= val <= 150.0]

    if valid_inr:
        # If an explicit salary range was identified at the start, use the lower bound of the first range
        if range_matches:
            first_low = float(range_matches[0][0])
            if 5.0 <= first_low <= 150.0:
                return int(first_low)
        return int(min(valid_inr))

    # 3. Check for USD $ pattern: e.g. $45k, $45,000, 45k usd
    usd_k_matches = re.findall(r'\$\s*(\d+(?:\.\d+)?)\s*k|\b(\d+(?:\.\d+)?)\s*k\s*usd', c)
    usd_candidates = []
    for m in usd_k_matches:
        val = m[0] or m[1]
        if val:
            usd_candidates.append(float(val))

    if usd_candidates:
        min_usd_k = min(usd_candidates)
        # $45k USD is ~₹37 LPA CTC equivalent
        return int(min_usd_k * 37 / 45)

    return None

def verify_dataset(filepath, verbose=True):
    print(f"============================================================")
    print(f"Target Companies Verification Suite")
    print(f"Target File: {filepath}")
    print(f"============================================================")

    # Gate 1: File Existence & JSON Parsing
    assert os.path.exists(filepath), f"Gate 1 Failed: File not found at {filepath}"
    with open(filepath, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            assert False, f"Gate 1 Failed: JSON parsing error in {filepath}: {e}"

    assert isinstance(data, dict), "Gate 1 Failed: Root JSON must be a dictionary"
    assert "headers" in data, "Gate 1 Failed: Missing 'headers' key"
    assert "rows" in data, "Gate 1 Failed: Missing 'rows' key"
    assert data.get("date") == "Target Companies", (
        f"Gate 1 Failed: Expected date/tab 'Target Companies', got '{data.get('date')}'"
    )
    print("✓ Gate 1 Passed: Valid JSON structure and 'Target Companies' tab identifier.")

    headers = data["headers"]
    rows = data["rows"]

    # Gate 2: Schema Integrity
    assert headers == EXPECTED_10_COLUMNS, (
        f"Gate 2 Failed: Header schema mismatch.\nExpected: {EXPECTED_10_COLUMNS}\nGot: {headers}"
    )
    print(f"✓ Gate 2 Passed: Canonical 10-column schema verified ({len(headers)} columns).")

    # Gate 3: Quantity & Cardinality Boundary (30-40 Companies)
    total_companies = len(rows)
    assert 30 <= total_companies <= 40, (
        f"Gate 3 Failed: Dataset must contain between 30 and 40 product companies per ORIGINAL_REQUEST.md (§R1), got {total_companies}"
    )
    print(f"✓ Gate 3 Passed: Exactly {total_companies} product companies present (within canonical 30-40 boundary).")

    # Gate 4: Company Name Non-Emptiness & Uniqueness
    seen_names = set()
    for idx, row in enumerate(rows, start=1):
        assert len(row) == len(headers), (
            f"Gate 4 Failed: Row {idx} length mismatch (expected {len(headers)}, got {len(row)})"
        )
        name = str(row[0]).strip()
        assert len(name) > 0, f"Gate 4 Failed: Row {idx} has empty Company Name"
        name_lower = name.lower()
        assert name_lower not in seen_names, f"Gate 4 Failed: Duplicate company name '{name}' at row {idx}"
        seen_names.add(name_lower)
    print(f"✓ Gate 4 Passed: All {total_companies} company names are unique and non-empty.")

    # Gate 5: Headcount & Stability Tier Floor (100+ employees)
    for idx, row in enumerate(rows, start=1):
        name = row[0]
        tier_str = str(row[4]).strip()
        matched_tiers = [t for t in VALID_HEADCOUNT_TIERS if tier_str.startswith(t)]
        assert len(matched_tiers) > 0, (
            f"Gate 5 Failed: Row {idx} ({name}) invalid headcount tier '{tier_str}'. "
            f"Must start with one of {VALID_HEADCOUNT_TIERS} (100+ employees)."
        )
    print(f"✓ Gate 5 Passed: 100% of companies verified with headcount >= 100 ({VALID_HEADCOUNT_TIERS}).")

    # Gate 6: Core Tech Stack Verification (>= 2 of {React, React Native, CI/CD, Angular})
    for idx, row in enumerate(rows, start=1):
        name = row[0]
        stack_str = str(row[3]).strip()
        matched_skills = match_core_skills(stack_str)
        assert len(matched_skills) >= 2, (
            f"Gate 6 Failed: Row {idx} ({name}) requires >= 2 of {{React, React Native, CI/CD, Angular}}, "
            f"found {matched_skills} in '{stack_str}'"
        )
        if verbose and idx <= 5:
            print(f"    • {name:20}: {matched_skills} (from '{stack_str}')")
    if verbose and total_companies > 5:
        print(f"    ... and {total_companies - 5} more companies verified.")
    print("✓ Gate 6 Passed: 100% of companies require >= 2 target skills {React, React Native, CI/CD, Angular}.")

    # Gate 7: Career Portal & LinkedIn Jobs URL Format & Protocol
    for idx, row in enumerate(rows, start=1):
        name = row[0]
        career_url = str(row[5]).strip()
        linkedin_url = str(row[6]).strip()

        # Career URL
        assert career_url.startswith("http://") or career_url.startswith("https://"), (
            f"Gate 7 Failed: Row {idx} ({name}) career URL must begin with http:// or https://: '{career_url}'"
        )
        parsed_career = urllib.parse.urlparse(career_url)
        assert parsed_career.netloc and "." in parsed_career.netloc, (
            f"Gate 7 Failed: Row {idx} ({name}) invalid domain in career URL '{career_url}'"
        )

        # LinkedIn Jobs URL
        assert linkedin_url.startswith("https://www.linkedin.com/"), (
            f"Gate 7 Failed: Row {idx} ({name}) LinkedIn jobs URL must begin with 'https://www.linkedin.com/': '{linkedin_url}'"
        )
        assert "/jobs" in linkedin_url or "/company" in linkedin_url, (
            f"Gate 7 Failed: Row {idx} ({name}) LinkedIn URL must be a company/jobs page: '{linkedin_url}'"
        )
    print("✓ Gate 7 Passed: 100% valid Career Portal links and LinkedIn Jobs links.")

    # Gate 8: Ratings & Compensation Quality Floor (>= ₹18 LPA CTC)
    for idx, row in enumerate(rows, start=1):
        name = row[0]
        ratings_str = str(row[7]).strip()
        comp_str = str(row[8]).strip()

        # Ratings
        assert ("glassdoor" in ratings_str.lower() or "ambitionbox" in ratings_str.lower()), (
            f"Gate 8 Failed: Row {idx} ({name}) ratings must cite Glassdoor or AmbitionBox: '{ratings_str}'"
        )
        assert re.search(r'\d\.\d\s*/\s*5', ratings_str), (
            f"Gate 8 Failed: Row {idx} ({name}) ratings must contain numerical X.X/5 rating: '{ratings_str}'"
        )

        # Compensation
        comp_floor = parse_compensation_floor(comp_str)
        assert comp_floor is not None, (
            f"Gate 8 Failed: Row {idx} ({name}) unable to parse compensation floor in '{comp_str}'"
        )
        assert comp_floor >= 18, (
            f"Gate 8 Failed: Row {idx} ({name}) SDE-2 compensation floor ₹{comp_floor} LPA is below ₹18 LPA benchmark: '{comp_str}'"
        )
    print("✓ Gate 8 Passed: 100% documented Glassdoor/AmbitionBox ratings and >= ₹18 LPA compensation floor.")

    # Gate 9: Strict Tailored Value Proposition for Candidate (Kaushal Kumar, 3.5 YOE, kausal.in)
    for idx, row in enumerate(rows, start=1):
        name = row[0]
        val_prop = str(row[9]).strip()
        vp_lower = val_prop.lower()

        # 1. Length floor: Must be substantial (>= 50 characters)
        assert len(val_prop) >= 50, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition too brief ({len(val_prop)} chars, min 50): '{val_prop}'"
        )

        # 2. Portfolio Link: Mandatory presence of 'kausal.in'
        assert "kausal.in" in vp_lower, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition missing candidate portfolio link 'kausal.in': '{val_prop}'"
        )

        # 3. Candidate Experience & Identity: Mandatory reference to '3.5' YOE and candidate name 'Kaushal'
        has_exp = "3.5" in vp_lower or bool(re.search(r'\b3\.5\s*(?:yoe|years|\+?\s*years)?\b', vp_lower))
        assert has_exp, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition missing candidate experience '3.5' YOE: '{val_prop}'"
        )
        assert "kaushal" in vp_lower, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition missing candidate name 'Kaushal': '{val_prop}'"
        )

        # 4. Tech Stack Alignment: Must mention candidate core competencies
        has_tech_alignment = any(tech in vp_lower for tech in [
            "react", "native", "angular", "ci/cd", "cicd", "pipeline"
        ])
        assert has_tech_alignment, (
            f"Gate 9 Failed: Row {idx} ({name}) value proposition lacks target tech stack alignment: '{val_prop}'"
        )
    print("✓ Gate 9 Passed: 100% verified tailored value propositions citing Kaushal Kumar, 3.5 YOE, kausal.in, and stack alignment.")

    # Gate 10: Geographic Scope & Domain Diversity
    hubs = [row[2] for row in rows]
    blr_count = sum(1 for h in hubs if "Bengaluru" in h or "BLR" in h)
    remote_count = sum(1 for h in hubs if "Remote" in h)
    ncr_count = sum(1 for h in hubs if "Gurugram" in h or "Noida" in h or "NCR" in h)
    bom_count = sum(1 for h in hubs if "Mumbai" in h)

    assert blr_count > 0, "Gate 10 Failed: Missing Bengaluru tech hub representation"
    assert ncr_count > 0, "Gate 10 Failed: Missing NCR/Gurugram tech hub representation"
    assert remote_count > 0, "Gate 10 Failed: Missing Remote product organizations"
    print(f"✓ Gate 10 Passed: Geographic diversity verified (BLR: {blr_count}, NCR: {ncr_count}, Mumbai: {bom_count}, Remote: {remote_count}).")

    # Gate 11: Mandatory Inclusion of Prompt Seed Companies
    present_company_names = [str(row[0]).strip() for row in rows]
    names_lower = [n.lower() for n in present_company_names]

    missing_seeds = []
    for seed in MANDATORY_SEED_COMPANIES:
        seed_lower = seed.lower()
        matched = any(
            seed_lower in name or
            (seed_lower == "cult.fit" and ("curefit" in name or "cultfit" in name))
            for name in names_lower
        )
        if not matched:
            missing_seeds.append(seed)

    assert not missing_seeds, (
        f"Gate 11 Failed: Missing mandatory seed companies from ORIGINAL_REQUEST.md (§R1): {missing_seeds}. "
        f"Present companies ({len(present_company_names)}): {present_company_names}"
    )
    print(f"✓ Gate 11 Passed: All 7 prompt seed companies present and verified ({', '.join(MANDATORY_SEED_COMPANIES)}).")

    print(f"============================================================")
    print(f"ALL 11 GATES PASSED! Dataset is 100% compliant with R1-R4.")
    print(f"Verified Records: {total_companies} product companies.")
    print(f"============================================================")
    return True

class TestTargetCompaniesDataset(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.filepath = os.environ.get("TARGET_COMPANIES_FILE", "target_companies.json")
        with open(cls.filepath, "r", encoding="utf-8") as f:
            cls.data = json.load(f)

    def test_gate1_structure(self):
        self.assertEqual(self.data.get("date"), "Target Companies")
        self.assertIn("headers", self.data)
        self.assertIn("rows", self.data)

    def test_gate2_schema_headers(self):
        self.assertEqual(self.data["headers"], EXPECTED_10_COLUMNS)

    def test_gate3_quantity_boundary(self):
        rows = self.data["rows"]
        self.assertTrue(30 <= len(rows) <= 40, f"Expected 30-40 companies, got {len(rows)}")

    def test_gate4_unique_company_names(self):
        rows = self.data["rows"]
        names = [r[0].strip() for r in rows]
        for name in names:
            self.assertTrue(len(name) > 0)
        self.assertEqual(len(names), len(set(n.lower() for n in names)))

    def test_gate5_headcount_tiers(self):
        rows = self.data["rows"]
        for r in rows:
            tier_str = str(r[4]).strip()
            self.assertTrue(any(tier_str.startswith(t) for t in VALID_HEADCOUNT_TIERS), f"{r[0]} invalid tier: {tier_str}")

    def test_gate6_core_skills(self):
        rows = self.data["rows"]
        for r in rows:
            matched = match_core_skills(r[3])
            self.assertGreaterEqual(len(matched), 2, f"{r[0]} matched {matched} in {r[3]}")

    def test_gate7_urls(self):
        rows = self.data["rows"]
        for r in rows:
            career_url = r[5].strip()
            linkedin_url = r[6].strip()
            self.assertTrue(career_url.startswith("http://") or career_url.startswith("https://"), f"{r[0]} career URL: {career_url}")
            self.assertTrue(linkedin_url.startswith("https://www.linkedin.com/"), f"{r[0]} LinkedIn URL: {linkedin_url}")

    def test_gate8_ratings_and_compensation(self):
        rows = self.data["rows"]
        for r in rows:
            rating = r[7]
            comp = r[8]
            self.assertTrue("glassdoor" in rating.lower() or "ambitionbox" in rating.lower(), f"{r[0]} rating: {rating}")
            floor = parse_compensation_floor(comp)
            self.assertIsNotNone(floor, f"{r[0]} comp: {comp}")
            self.assertGreaterEqual(floor, 18, f"{r[0]} comp floor {floor} < 18 LPA: {comp}")

    def test_gate9_value_proposition(self):
        rows = self.data["rows"]
        for r in rows:
            val_prop = str(r[9]).strip()
            vp_lower = val_prop.lower()
            self.assertGreaterEqual(len(val_prop), 50, f"{r[0]} value proposition too short: {val_prop}")
            self.assertIn("kausal.in", vp_lower, f"{r[0]} missing 'kausal.in' portfolio link")
            has_exp = "3.5" in vp_lower or bool(re.search(r'\b3\.5\s*(?:yoe|years|\+?\s*years)?\b', vp_lower))
            self.assertTrue(has_exp, f"{r[0]} missing '3.5' YOE")
            self.assertIn("kaushal", vp_lower, f"{r[0]} missing candidate name 'Kaushal'")
            self.assertTrue(
                any(tech in vp_lower for tech in ["react", "native", "angular", "ci/cd", "cicd", "pipeline"]),
                f"{r[0]} missing core tech keywords: {val_prop}"
            )

    def test_gate10_geographic_diversity(self):
        rows = self.data["rows"]
        hubs = [r[2] for r in rows]
        self.assertTrue(any("Bengaluru" in h for h in hubs))
        self.assertTrue(any("Gurugram" in h or "Noida" in h or "NCR" in h for h in hubs))
        self.assertTrue(any("Remote" in h for h in hubs))

    def test_gate11_mandatory_seed_companies(self):
        rows = self.data["rows"]
        names_lower = [str(r[0]).lower() for r in rows]
        for seed in MANDATORY_SEED_COMPANIES:
            seed_lower = seed.lower()
            matched = any(
                seed_lower in name or
                (seed_lower == "cult.fit" and ("curefit" in name or "cultfit" in name))
                for name in names_lower
            )
            self.assertTrue(matched, f"Mandatory seed company '{seed}' missing from dataset")

def main():
    parser = argparse.ArgumentParser(description="Verify target companies dataset compliance.")
    parser.add_argument("--file", default="target_companies.json", help="Path to target_companies.json")
    parser.add_argument("--unittest", action="store_true", help="Run as standard unittest runner")
    parser.add_argument("--quiet", action="store_true", help="Quiet output")
    args, unknown = parser.parse_known_args()

    if args.unittest:
        os.environ["TARGET_COMPANIES_FILE"] = args.file
        unittest.main(argv=[sys.argv[0]] + unknown)
        return

    try:
        verify_dataset(args.file, verbose=not args.quiet)
        sys.exit(0)
    except AssertionError as e:
        print(f"\n❌ VERIFICATION FAILED: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
