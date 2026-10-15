"""
Tier 1: Feature Coverage Test Suite.
Validates individual core requirements:
- 5 Target Agencies recognition & canonicalization
- 15-Column Schema fidelity & normalization
- Mandatory candidate tokens ('kausal.in', 'Kaushal Kumar', '3.5', 'React')
- Connection degree & outreach type mapping
- Strict negative filtering on recruiter designations
"""

import unittest
from verify_outreach import (
    OUTREACH_HEADERS,
    TARGET_AGENCIES,
    MANDATORY_TOKENS,
    canonicalize_agency,
    normalize_record,
    verify_single_record,
    verify_records
)
from tests.fixtures import (
    generate_valid_record,
    mutate_record
)


class TestAgencyCoverage(unittest.TestCase):
    """>=5 Test cases verifying recognition and quota tracking for all 5 agencies."""

    def test_teamlease_digital_recognized(self):
        self.assertEqual(canonicalize_agency("TeamLease Digital"), "TeamLease Digital")
        self.assertEqual(canonicalize_agency("TeamLease"), "TeamLease Digital")

    def test_randstad_india_recognized(self):
        self.assertEqual(canonicalize_agency("Randstad India"), "Randstad India")
        self.assertEqual(canonicalize_agency("Randstad Technologies"), "Randstad India")

    def test_adecco_india_recognized(self):
        self.assertEqual(canonicalize_agency("Adecco India"), "Adecco India")
        self.assertEqual(canonicalize_agency("Akkodis / Adecco"), "Adecco India")

    def test_michael_page_india_recognized(self):
        self.assertEqual(canonicalize_agency("Michael Page India"), "Michael Page India")
        self.assertEqual(canonicalize_agency("PageGroup / Michael Page"), "Michael Page India")

    def test_allegis_teksystems_recognized(self):
        self.assertEqual(canonicalize_agency("Allegis Group / TEKsystems India"), "Allegis Group / TEKsystems India")
        self.assertEqual(canonicalize_agency("TEKsystems India"), "Allegis Group / TEKsystems India")
        self.assertEqual(canonicalize_agency("Allegis Group"), "Allegis Group / TEKsystems India")

    def test_unrecognized_agency_rejected(self):
        self.assertIsNone(canonicalize_agency("Infosys"))
        self.assertIsNone(canonicalize_agency("Random Staffing Inc"))
        self.assertIsNone(canonicalize_agency(""))


class TestSchemaFidelity(unittest.TestCase):
    """>=5 Test cases verifying 15-column schema, ordering, and data normalization."""

    def test_schema_headers_count_and_order(self):
        self.assertEqual(len(OUTREACH_HEADERS), 15)
        self.assertEqual(OUTREACH_HEADERS[0], "Agency")
        self.assertEqual(OUTREACH_HEADERS[1], "Person Name")
        self.assertEqual(OUTREACH_HEADERS[2], "LinkedIn Profile")
        self.assertEqual(OUTREACH_HEADERS[10], "Personalized Message")
        self.assertEqual(OUTREACH_HEADERS[14], "Notes")

    def test_schema_record_normalization_from_list(self):
        row = [
            "TeamLease Digital", "Ritu Singhania", "https://www.linkedin.com/in/ritusinghania/",
            "Senior Technical Recruiter", "Bengaluru, India", "Enterprise Tech",
            "Frontend, React", "Citi, JPMC", "Not Connected", "Connection Request",
            "Hi Ritu, Kaushal Kumar here (3.5+ yrs React, kausal.in). Would love to connect!",
            "Sent", "2026-09-23", "None", "Active recruiter"
        ]
        norm, err = normalize_record(row)
        self.assertIsNone(err)
        self.assertIsNotNone(norm)
        self.assertEqual(norm["Agency"], "TeamLease Digital")
        self.assertEqual(norm["Person Name"], "Ritu Singhania")

    def test_schema_record_normalization_from_snake_case_dict(self):
        raw = {
            "agency": "Randstad India",
            "person_name": "Amitabh Roy",
            "linkedin_profile": "https://www.linkedin.com/in/amitabhroy/",
            "current_designation": "Lead IT Recruiter",
            "location": "Bengaluru, India",
            "recruitment_domain": "Banking Tech",
            "relevant_tech_roles": "SDE-2 React",
            "associated_companies": "Morgan Stanley",
            "connection_status": "Not Connected",
            "outreach_type": "Connection Request",
            "personalized_message": "Hi Amitabh, Kaushal Kumar (3.5 yrs React, kausal.in).",
            "outreach_status": "Sent",
            "date_contacted": "2026-09-23",
            "follow_up_status": "None",
            "notes": "Verified profile"
        }
        norm, err = normalize_record(raw)
        self.assertIsNone(err)
        self.assertEqual(norm["Agency"], "Randstad India")
        self.assertEqual(norm["Person Name"], "Amitabh Roy")

    def test_schema_date_format_iso8601_validation(self):
        rec = generate_valid_record("TeamLease Digital", "Test Name", "test-user", "Tech Recruiter")
        # Valid date
        errors = verify_single_record(rec)
        self.assertEqual(errors, [])

        # Invalid date format
        bad_date_rec = mutate_record(rec, **{"Date Contacted": "23/09/2026"})
        errors = verify_single_record(bad_date_rec)
        self.assertTrue(any("Date Contacted must follow ISO 8601" in e for e in errors))

    def test_schema_empty_required_field_detected(self):
        rec = generate_valid_record("Adecco India", "Sanjay Hegde", "sanjay-h", "Lead Recruiter")
        bad_rec = mutate_record(rec, **{"Person Name": ""})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Person Name cannot be empty" in e for e in errors))


class TestCandidateTokens(unittest.TestCase):
    """>=5 Test cases verifying mandatory candidate profile tokens."""

    def setUp(self):
        self.base_record = generate_valid_record(
            "Michael Page India", "Alok Mathur", "alokmathur", "Managing Consultant"
        )

    def test_token_kausal_in_mandatory(self):
        bad_rec = mutate_record(self.base_record, **{
            "Personalized Message": "Hi Alok, Kaushal Kumar with 3.5 yrs in React. Would love to connect!"
        })
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("missing mandatory candidate token 'kausal.in'" in e for e in errors))

    def test_token_kaushal_kumar_mandatory(self):
        bad_rec = mutate_record(self.base_record, **{
            "Personalized Message": "Hi Alok, Frontend SWE with 3.5 yrs in React (kausal.in). Let's connect!"
        })
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("missing mandatory candidate token 'Kaushal Kumar'" in e for e in errors))

    def test_token_experience_3_5_mandatory(self):
        bad_rec = mutate_record(self.base_record, **{
            "Personalized Message": "Hi Alok, I'm Kaushal Kumar, a Frontend SWE in React (kausal.in). Let's connect!"
        })
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("missing mandatory candidate token '3.5'" in e for e in errors))

    def test_token_react_mandatory(self):
        bad_rec = mutate_record(self.base_record, **{
            "Personalized Message": "Hi Alok, Kaushal Kumar here with 3.5 yrs experience (kausal.in). Let's connect!"
        })
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("missing mandatory candidate token 'React'" in e for e in errors))

    def test_tokens_case_insensitivity(self):
        valid_rec = mutate_record(self.base_record, **{
            "Personalized Message": "Hi Alok, KAUSHAL KUMAR here with 3.5+ yrs in REACT (KAUSAL.IN). Best!"
        })
        errors = verify_single_record(valid_rec)
        self.assertEqual(errors, [])


class TestDegreeHandling(unittest.TestCase):
    """>=5 Test cases verifying connection degree audit and outreach type workflows."""

    def test_first_degree_mapping(self):
        rec = generate_valid_record("Randstad India", "Amitabh Roy", "amitabhroy", "Senior Recruiter", is_first_degree=True)
        self.assertEqual(rec["Connection Status"], "Existing Connection")
        self.assertEqual(rec["Outreach Type"], "1st-Degree Message")
        errors = verify_single_record(rec)
        self.assertEqual(errors, [])

    def test_not_connected_mapping(self):
        rec = generate_valid_record("Randstad India", "Amitabh Roy", "amitabhroy", "Senior Recruiter", is_first_degree=False)
        self.assertEqual(rec["Connection Status"], "Not Connected")
        self.assertEqual(rec["Outreach Type"], "Connection Request")
        errors = verify_single_record(rec)
        self.assertEqual(errors, [])

    def test_degree_mismatch_existing_connection_with_connection_request(self):
        rec = generate_valid_record("Randstad India", "Amitabh Roy", "amitabhroy", "Senior Recruiter", is_first_degree=True)
        bad_rec = mutate_record(rec, **{"Outreach Type": "Connection Request"})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Degree mismatch" in e for e in errors))

    def test_degree_mismatch_not_connected_with_first_degree_message(self):
        rec = generate_valid_record("Randstad India", "Amitabh Roy", "amitabhroy", "Senior Recruiter", is_first_degree=False)
        bad_rec = mutate_record(rec, **{"Outreach Type": "1st-Degree Message"})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Degree mismatch" in e for e in errors))

    def test_first_degree_message_allows_longer_text(self):
        rec = generate_valid_record("Randstad India", "Amitabh Roy", "amitabhroy", "Senior Recruiter", is_first_degree=True)
        # 1st-degree messages are often > 400 chars warm DMs
        self.assertGreater(len(rec["Personalized Message"]), 300)
        errors = verify_single_record(rec)
        self.assertEqual(errors, [])


class TestNegativeFiltering(unittest.TestCase):
    """>=5 Test cases verifying strict exclusion of non-technical / operational roles."""

    def setUp(self):
        self.rec = generate_valid_record("Adecco India", "Neha Kapoor", "nehakapoor", "Senior Technical Recruiter")

    def test_reject_campus_recruiter(self):
        bad_rec = mutate_record(self.rec, **{"Current Designation": "Campus Recruiter & University Relations"})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Disallowed non-tech/operations keyword 'campus'" in e for e in errors))

    def test_reject_payroll_specialist(self):
        bad_rec = mutate_record(self.rec, **{"Current Designation": "Lead Payroll & Compensation Specialist"})
        errors = verify_single_record(bad_rec)
        self.assertTrue(any("Disallowed non-tech/operations keyword 'payroll'" in e for e in errors))

    def test_reject_statutory_compliance(self):
        bad_rec1 = mutate_record(self.rec, **{"Current Designation": "Compliance Manager"})
        self.assertTrue(any("Disallowed non-tech/operations keyword 'compliance'" in e for e in verify_single_record(bad_rec1)))

        bad_rec2 = mutate_record(self.rec, **{"Current Designation": "Statutory Operations Specialist"})
        self.assertTrue(any("Disallowed non-tech/operations keyword 'statutory'" in e for e in verify_single_record(bad_rec2)))

    def test_reject_non_tech_pharma_sales(self):
        bad_rec1 = mutate_record(self.rec, **{"Current Designation": "Pharma & Life Sciences Recruiter"})
        self.assertTrue(any("pharma" in e for e in verify_single_record(bad_rec1)))

        bad_rec2 = mutate_record(self.rec, **{"Current Designation": "Enterprise Sales Talent Lead"})
        self.assertTrue(any("sales" in e for e in verify_single_record(bad_rec2)))

    def test_accept_valid_it_recruiter_titles(self):
        valid_titles = [
            "Senior Technical Recruiter - Frontend & Full Stack",
            "Lead IT Staffing Consultant",
            "Talent Acquisition Partner - Digital Engineering",
            "Practice Lead - IT Staffing & GCCs",
            "Managing Consultant - Technology Practice"
        ]
        for title in valid_titles:
            valid_rec = mutate_record(self.rec, **{"Current Designation": title})
            errors = verify_single_record(valid_rec)
            self.assertEqual(errors, [], f"Valid title '{title}' was incorrectly rejected")


if __name__ == "__main__":
    unittest.main()
