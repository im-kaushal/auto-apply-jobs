"""
Tier 2: Boundary & Corner Cases Test Suite.
Validates boundary conditions and edge cases:
- Exact 300 char boundaries (298, 299, 300, 301 chars)
- Empty, whitespace, or missing fields
- Duplicate & malformed LinkedIn URLs
- Email challenge modal triggers ('Skipped - Email Required')
- LinkedIn weekly invitation limit modal triggers ('Skipped - Weekly Limit')
- Column count deviations (14 vs 15 vs 16)
"""

import unittest
from verify_outreach import (
    verify_single_record,
    verify_records,
    normalize_record
)
from tests.fixtures import (
    generate_valid_record,
    generate_valid_dataset,
    mutate_record
)


class TestMessageLengthBoundaries(unittest.TestCase):
    """Rigorous character boundary testing: strictly < 300 characters."""

    def setUp(self):
        self.base_rec = generate_valid_record(
            "Allegis Group / TEKsystems India",
            "Rajesh Raman",
            "rajeshraman-tek",
            "Senior Technical Recruiter",
            is_first_degree=False
        )

    def _build_exact_len_message(self, target_len: int) -> str:
        # Base message with mandatory tokens:
        prefix = "Hi Rajesh, Kaushal Kumar here (3.5 yrs React, kausal.in). "
        # Fill remainder with dots/text up to target_len
        padding = "X" * (target_len - len(prefix))
        msg = prefix + padding
        assert len(msg) == target_len, f"Expected {target_len}, got {len(msg)}"
        return msg

    def test_message_298_chars_passes(self):
        msg = self._build_exact_len_message(298)
        rec = mutate_record(self.base_rec, **{"Personalized Message": msg})
        errors = verify_single_record(rec)
        self.assertEqual(errors, [])

    def test_message_299_chars_passes(self):
        msg = self._build_exact_len_message(299)
        rec = mutate_record(self.base_rec, **{"Personalized Message": msg})
        errors = verify_single_record(rec)
        self.assertEqual(errors, [])

    def test_message_300_chars_fails_strict_bound(self):
        # Strict < 300 chars constraint: 300 MUST fail
        msg = self._build_exact_len_message(300)
        rec = mutate_record(self.base_rec, **{"Personalized Message": msg})
        errors = verify_single_record(rec)
        self.assertTrue(any("exceeds 300 chars limit (actual length: 300 chars)" in e for e in errors))

    def test_message_301_chars_fails(self):
        msg = self._build_exact_len_message(301)
        rec = mutate_record(self.base_rec, **{"Personalized Message": msg})
        errors = verify_single_record(rec)
        self.assertTrue(any("exceeds 300 chars limit (actual length: 301 chars)" in e for e in errors))

    def test_empty_message_fails(self):
        rec = mutate_record(self.base_rec, **{"Personalized Message": ""})
        errors = verify_single_record(rec)
        self.assertTrue(any("Personalized Message cannot be empty" in e for e in errors))

    def test_whitespace_only_message_fails(self):
        rec = mutate_record(self.base_rec, **{"Personalized Message": "    \t\n   "})
        errors = verify_single_record(rec)
        self.assertTrue(any("Personalized Message cannot be empty" in e for e in errors))


class TestURLBoundariesAndDuplicates(unittest.TestCase):
    """Validation of unique profile URLs, trailing slashes, and malformed inputs."""

    def test_duplicate_url_detected_in_batch(self):
        dataset = generate_valid_dataset(50)
        # Duplicate row 0's URL into row 5
        dataset[5]["LinkedIn Profile"] = dataset[0]["LinkedIn Profile"]
        res = verify_records(dataset, verbose=False, strict_50=True)
        self.assertFalse(res.is_valid)
        self.assertTrue(any("Duplicate LinkedIn Profile URL detected" in e for e in res.errors))

    def test_duplicate_url_with_trailing_slash_difference_detected(self):
        dataset = generate_valid_dataset(50)
        # URL with vs without trailing slash should be recognized as duplicate
        url_base = dataset[0]["LinkedIn Profile"].rstrip("/")
        dataset[0]["LinkedIn Profile"] = url_base
        dataset[10]["LinkedIn Profile"] = url_base + "/"
        res = verify_records(dataset, verbose=False, strict_50=True)
        self.assertFalse(res.is_valid)
        self.assertTrue(any("Duplicate LinkedIn Profile URL detected" in e for e in res.errors))

    def test_malformed_url_non_linkedin_rejected(self):
        rec = generate_valid_record("Randstad India", "Amitabh Roy", "amitabh", "Recruiter")
        bad_rec = mutate_record(rec, **{"LinkedIn Profile": "https://github.com/amitabhroy"})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Invalid LinkedIn Profile URL format" in e for e in errors))

    def test_malformed_url_plain_text_rejected(self):
        rec = generate_valid_record("Randstad India", "Amitabh Roy", "amitabh", "Recruiter")
        bad_rec = mutate_record(rec, **{"LinkedIn Profile": "linkedin.com/in/amitabhroy"})  # missing protocol
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Invalid LinkedIn Profile URL format" in e for e in errors))


class TestEmptyAndMissingFields(unittest.TestCase):
    """Validation of missing or empty required columns."""

    def setUp(self):
        self.rec = generate_valid_record(
            "Michael Page India", "Deepa Krishnan", "deepakrishnan-mp", "Consultant - Technology"
        )

    def test_empty_agency_rejected(self):
        bad_rec = mutate_record(self.rec, **{"Agency": ""})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Invalid or unrecognized agency" in e for e in errors))

    def test_empty_location_rejected(self):
        bad_rec = mutate_record(self.rec, **{"Location": ""})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Location cannot be empty" in e for e in errors))

    def test_empty_recruitment_domain_rejected(self):
        bad_rec = mutate_record(self.rec, **{"Recruitment Domain": "   "})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Recruitment Domain cannot be empty" in e for e in errors))

    def test_empty_relevant_tech_roles_rejected(self):
        bad_rec = mutate_record(self.rec, **{"Relevant Tech Roles": ""})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Relevant Tech Roles cannot be empty" in e for e in errors))

    def test_row_with_less_than_15_columns_rejected(self):
        short_row = ["TeamLease Digital", "Person"]
        norm, err = normalize_record(short_row)
        self.assertIsNone(norm)
        self.assertIn("Row length mismatch", err)

    def test_row_with_more_than_15_columns_rejected(self):
        long_row = ["Val"] * 16
        norm, err = normalize_record(long_row)
        self.assertIsNone(norm)
        self.assertIn("Row length mismatch", err)


class TestModalTriggersAndPlatformLimits(unittest.TestCase):
    """Validation of modal triggers, weekly limit status, and email challenge handling."""

    def test_weekly_limit_modal_triggers_valid_skipped_status(self):
        rec = generate_valid_record("TeamLease Digital", "Ritu Singhania", "ritusinghania", "Senior Recruiter")
        rec = mutate_record(rec, **{
            "Outreach Status": "Skipped - Weekly Limit",
            "Notes": "LinkedIn weekly invitation limit modal detected; saved for next cycle"
        })
        errors = verify_single_record(rec)
        self.assertEqual(errors, [])

    def test_email_challenge_modal_triggers_valid_skipped_status(self):
        rec = generate_valid_record("Adecco India", "Sanjay Hegde", "sanjayhegde", "Lead Recruiter")
        rec = mutate_record(rec, **{
            "Outreach Status": "Skipped - Email Required",
            "Notes": "Candidate profile required private email address; dismissed modal"
        })
        errors = verify_single_record(rec)
        self.assertEqual(errors, [])

    def test_unsupported_outreach_status_fails(self):
        rec = generate_valid_record("Adecco India", "Sanjay Hegde", "sanjayhegde", "Lead Recruiter")
        bad_rec = mutate_record(rec, **{"Outreach Status": "Failed_Unknown_Exception"})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Invalid Outreach Status" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
