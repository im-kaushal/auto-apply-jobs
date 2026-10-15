"""
Tier 4: Real-World Acceptance Scenarios Test Suite.
Validates the complete end-to-end acceptance run:
- Full golden 50-record run validation against all acceptance criteria
- Exact 10 recruiters per agency across 5 agencies
- Apps Script Webhook payload compliance
- Fault injection sensitivity (detecting single defect in 50 records)
- Record count sensitivity (49 vs 50 vs 51)
- Roundtrip JSON persistence fidelity
"""

import unittest
import json
from verify_outreach import (
    verify_records,
    OUTREACH_HEADERS,
    TARGET_AGENCIES
)
from tests.fixtures import (
    generate_valid_dataset,
    build_webhook_payload,
    mutate_record
)


class TestRealWorldAcceptance(unittest.TestCase):
    """Tier 4 end-to-end full run verification."""

    def test_acceptance_golden_50_dataset_passes_completely(self):
        dataset = generate_valid_dataset(50, first_degree_per_agency=1)
        res = verify_records(dataset, verbose=False, strict_50=True)

        self.assertTrue(res.is_valid, f"Verification failed with errors: {res.errors}")
        self.assertEqual(res.total_records, 50)
        self.assertEqual(res.unique_urls_count, 50)
        for agency in TARGET_AGENCIES:
            self.assertEqual(res.agency_counts[agency], 10, f"Agency {agency} count is not 10")
        self.assertEqual(len(res.errors), 0)

    def test_acceptance_webhook_payload_structure(self):
        dataset = generate_valid_dataset(50)
        payload = build_webhook_payload(dataset, tab_name="Recruiter_Outreach")

        self.assertEqual(payload.get("date"), "Recruiter_Outreach")
        self.assertEqual(payload.get("headers"), OUTREACH_HEADERS)
        self.assertEqual(len(payload.get("rows")), 50)
        for row in payload.get("rows"):
            self.assertEqual(len(row), 15)

        # Verification engine accepts the raw payload directly
        res = verify_records(payload, verbose=False)
        self.assertTrue(res.is_valid)

    def test_acceptance_agency_quota_imbalance_fails(self):
        """
        Verify that 50 total records with skewed distribution (11 TeamLease, 9 Randstad)
        fails with explicit agency quota mismatch errors.
        """
        dataset = generate_valid_dataset(50)
        # Change row 10 (Randstad) to TeamLease Digital
        dataset[10]["Agency"] = "TeamLease Digital"
        res = verify_records(dataset, verbose=False, strict_50=True)

        self.assertFalse(res.is_valid)
        self.assertTrue(any("Agency quota mismatch for 'TeamLease Digital': expected 10 records, got 11" in e for e in res.errors))
        self.assertTrue(any("Agency quota mismatch for 'Randstad India': expected 10 records, got 9" in e for e in res.errors))

    def test_acceptance_fault_injection_in_single_record_fails_whole_batch(self):
        """
        Introduce a single violation in row 48 (TEKsystems recruiter missing 'kausal.in' token).
        The whole 50-record verification must fail and identify the error.
        """
        dataset = generate_valid_dataset(50)
        dataset[48]["Personalized Message"] = "Hi Naveen, Kaushal Kumar with 3.5 yrs in React. Would love to connect!"
        res = verify_records(dataset, verbose=False, strict_50=True)

        self.assertFalse(res.is_valid)
        self.assertTrue(any("missing mandatory candidate token 'kausal.in'" in e for e in res.errors))

    def test_acceptance_under_count_49_fails(self):
        dataset = generate_valid_dataset(49)
        res = verify_records(dataset, verbose=False, strict_50=True)
        self.assertFalse(res.is_valid)
        self.assertTrue(any("Total record count mismatch: expected exactly 50 records, got 49" in e for e in res.errors))

    def test_acceptance_roundtrip_json_serialization(self):
        dataset = generate_valid_dataset(50)
        json_str = json.dumps(dataset, indent=2)
        reloaded = json.loads(json_str)

        res = verify_records(reloaded, verbose=False, strict_50=True)
        self.assertTrue(res.is_valid)
        self.assertEqual(res.total_records, 50)


if __name__ == "__main__":
    unittest.main()
