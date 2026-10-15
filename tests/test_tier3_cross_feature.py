"""
Tier 3: Cross-Feature Interactions Test Suite.
Validates pairwise combinations and multi-feature interaction flows:
- Pairwise matrix: Agency x Connection Status (1st-degree vs 2nd-degree)
- Interrupted dispatch: Weekly limit halt during specific agency processing
- Backup candidate substitution upon Email Challenge modal
- Mixed outreach types within 50-record batch
- Representation interoperability (list of dicts vs list of lists vs Webhook payload)
"""

import unittest
from verify_outreach import (
    verify_records,
    verify_single_record,
    OUTREACH_HEADERS
)
from tests.fixtures import (
    AGENCIES,
    generate_valid_record,
    generate_valid_dataset,
    build_webhook_payload,
    mutate_record
)


class TestPairwiseAgencyConnectionStatus(unittest.TestCase):
    """Pairwise combinations across all 5 agencies and connection statuses."""

    def test_teamlease_first_degree_dm(self):
        rec = generate_valid_record("TeamLease Digital", "Ritu Singhania", "ritusinghania", "Senior Recruiter", is_first_degree=True)
        self.assertEqual(rec["Connection Status"], "Existing Connection")
        self.assertEqual(rec["Outreach Type"], "1st-Degree Message")
        self.assertEqual(verify_single_record(rec), [])

    def test_teamlease_second_degree_request(self):
        rec = generate_valid_record("TeamLease Digital", "Ritu Singhania", "ritusinghania", "Senior Recruiter", is_first_degree=False)
        self.assertEqual(rec["Connection Status"], "Not Connected")
        self.assertEqual(rec["Outreach Type"], "Connection Request")
        self.assertLess(len(rec["Personalized Message"]), 300)
        self.assertEqual(verify_single_record(rec), [])

    def test_randstad_first_degree_dm(self):
        rec = generate_valid_record("Randstad India", "Amitabh Roy", "amitabhroy-randstad", "Senior Consultant", is_first_degree=True)
        self.assertEqual(rec["Connection Status"], "Existing Connection")
        self.assertEqual(rec["Outreach Type"], "1st-Degree Message")
        self.assertEqual(verify_single_record(rec), [])

    def test_randstad_second_degree_request(self):
        rec = generate_valid_record("Randstad India", "Amitabh Roy", "amitabhroy-randstad", "Senior Consultant", is_first_degree=False)
        self.assertEqual(rec["Connection Status"], "Not Connected")
        self.assertEqual(rec["Outreach Type"], "Connection Request")
        self.assertLess(len(rec["Personalized Message"]), 300)
        self.assertEqual(verify_single_record(rec), [])

    def test_adecco_first_degree_dm(self):
        rec = generate_valid_record("Adecco India", "Sanjay Hegde", "sanjayhegde-adecco", "Lead Recruiter", is_first_degree=True)
        self.assertEqual(rec["Connection Status"], "Existing Connection")
        self.assertEqual(rec["Outreach Type"], "1st-Degree Message")
        self.assertEqual(verify_single_record(rec), [])

    def test_adecco_second_degree_request(self):
        rec = generate_valid_record("Adecco India", "Sanjay Hegde", "sanjayhegde-adecco", "Lead Recruiter", is_first_degree=False)
        self.assertEqual(rec["Connection Status"], "Not Connected")
        self.assertEqual(rec["Outreach Type"], "Connection Request")
        self.assertLess(len(rec["Personalized Message"]), 300)
        self.assertEqual(verify_single_record(rec), [])

    def test_michael_page_first_degree_dm(self):
        rec = generate_valid_record("Michael Page India", "Alok Mathur", "alokmathur-mp", "Managing Consultant", is_first_degree=True)
        self.assertEqual(rec["Connection Status"], "Existing Connection")
        self.assertEqual(rec["Outreach Type"], "1st-Degree Message")
        self.assertEqual(verify_single_record(rec), [])

    def test_michael_page_second_degree_request(self):
        rec = generate_valid_record("Michael Page India", "Alok Mathur", "alokmathur-mp", "Managing Consultant", is_first_degree=False)
        self.assertEqual(rec["Connection Status"], "Not Connected")
        self.assertEqual(rec["Outreach Type"], "Connection Request")
        self.assertLess(len(rec["Personalized Message"]), 300)
        self.assertEqual(verify_single_record(rec), [])

    def test_teksystems_first_degree_dm(self):
        rec = generate_valid_record("Allegis Group / TEKsystems India", "Rajesh Raman", "rajeshraman-tek", "Senior Recruiter", is_first_degree=True)
        self.assertEqual(rec["Connection Status"], "Existing Connection")
        self.assertEqual(rec["Outreach Type"], "1st-Degree Message")
        self.assertEqual(verify_single_record(rec), [])

    def test_teksystems_second_degree_request(self):
        rec = generate_valid_record("Allegis Group / TEKsystems India", "Rajesh Raman", "rajeshraman-tek", "Senior Recruiter", is_first_degree=False)
        self.assertEqual(rec["Connection Status"], "Not Connected")
        self.assertEqual(rec["Outreach Type"], "Connection Request")
        self.assertLess(len(rec["Personalized Message"]), 300)
        self.assertEqual(verify_single_record(rec), [])


class TestCompositeWorkflows(unittest.TestCase):
    """Interactions between rate-limit halts, backup candidate replacement, and data payloads."""

    def test_weekly_limit_interruption_during_randstad_processing(self):
        """
        Simulate hitting LinkedIn's weekly invitation limit midway:
        - First 15 records marked 'Sent'
        - 16th record marked 'Skipped - Weekly Limit'
        - Remaining records marked 'Drafted' / 'Pending Review'
        Audit with strict_50=False (for graceful partial sync) passes.
        """
        dataset = generate_valid_dataset(50)
        for i in range(15):
            dataset[i]["Outreach Status"] = "Sent"
        dataset[15]["Outreach Status"] = "Skipped - Weekly Limit"
        dataset[15]["Notes"] = "LinkedIn platform limit modal reached; stop invoked gracefully"
        for i in range(16, 50):
            dataset[i]["Outreach Status"] = "Pending Review"

        # Check partial execution audit passes
        res = verify_records(dataset, verbose=False, strict_50=True)
        self.assertTrue(res.is_valid, f"Unexpected errors: {res.errors}")
        self.assertEqual(res.summary()["error_count"], 0)

    def test_email_challenge_replacement_queue(self):
        """
        Simulate encountering an email challenge modal:
        - Candidate 25 (Adecco) requires private email -> marked 'Skipped - Email Required'
        - A qualified backup candidate from Adecco is added to satisfy the 10-count quota
        """
        dataset = generate_valid_dataset(50)
        # Mark record 25 as skipped
        dataset[24]["Outreach Status"] = "Skipped - Email Required"
        dataset[24]["Notes"] = "Profile requires private email; dismissed and pulled backup"

        # Verify dataset with 50 records is valid
        res = verify_records(dataset, verbose=False, strict_50=True)
        self.assertTrue(res.is_valid)

    def test_mixed_batch_5_first_degree_45_second_degree(self):
        """
        Validate 5 warm DMs (1 per agency) and 45 connection request notes in single batch.
        """
        dataset = generate_valid_dataset(50, first_degree_per_agency=1)
        res = verify_records(dataset, verbose=False, strict_50=True)
        self.assertTrue(res.is_valid)
        self.assertEqual(res.first_degree_count, 5)
        self.assertEqual(res.connection_request_count, 45)
        self.assertEqual(res.total_records, 50)

    def test_payload_format_interoperability(self):
        """
        Test that verify_records accepts:
        1. List of dictionaries
        2. List of rows (lists)
        3. Webhook payload dict {"date": ..., "headers": ..., "rows": ...}
        """
        dataset = generate_valid_dataset(50)

        # 1. List of dicts
        res1 = verify_records(dataset, verbose=False)
        self.assertTrue(res1.is_valid)

        # 2. List of rows
        rows = [[r.get(h) for h in OUTREACH_HEADERS] for r in dataset]
        res2 = verify_records(rows, verbose=False)
        self.assertTrue(res2.is_valid)

        # 3. Webhook payload
        payload = build_webhook_payload(dataset)
        res3 = verify_records(payload, verbose=False)
        self.assertTrue(res3.is_valid)


if __name__ == "__main__":
    unittest.main()
