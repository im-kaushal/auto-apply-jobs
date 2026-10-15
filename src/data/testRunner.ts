/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TestCase {
  id: string;
  name: string;
  suite: string;
  tier: 1 | 2 | 3 | 4;
  description: string;
  assertion: string;
  status: 'passed' | 'running' | 'idle';
  durationMs: number;
}

export const initialTestCases: TestCase[] = [
  // TIER 1
  {
    id: 't1-01',
    name: 'test_teamlease_digital_recognized',
    suite: 'test_tier1_feature_coverage.TestAgencyCoverage',
    tier: 1,
    description: 'Ensure TeamLease Digital is accepted as valid target agency',
    assertion: 'Agency in TARGET_AGENCIES',
    status: 'passed',
    durationMs: 1.2
  },
  {
    id: 't1-02',
    name: 'test_randstad_india_recognized',
    suite: 'test_tier1_feature_coverage.TestAgencyCoverage',
    tier: 1,
    description: 'Ensure Randstad India is accepted as valid target agency',
    assertion: 'Agency in TARGET_AGENCIES',
    status: 'passed',
    durationMs: 0.9
  },
  {
    id: 't1-03',
    name: 'test_adecco_india_recognized',
    suite: 'test_tier1_feature_coverage.TestAgencyCoverage',
    tier: 1,
    description: 'Ensure Adecco India is accepted as valid target agency',
    assertion: 'Agency in TARGET_AGENCIES',
    status: 'passed',
    durationMs: 1.1
  },
  {
    id: 't1-04',
    name: 'test_michael_page_india_recognized',
    suite: 'test_tier1_feature_coverage.TestAgencyCoverage',
    tier: 1,
    description: 'Ensure Michael Page India is accepted as valid target agency',
    assertion: 'Agency in TARGET_AGENCIES',
    status: 'passed',
    durationMs: 0.8
  },
  {
    id: 't1-05',
    name: 'test_allegis_teksystems_recognized',
    suite: 'test_tier1_feature_coverage.TestAgencyCoverage',
    tier: 1,
    description: 'Ensure Allegis Group / TEKsystems India is accepted',
    assertion: 'Agency in TARGET_AGENCIES',
    status: 'passed',
    durationMs: 1.0
  },
  {
    id: 't1-06',
    name: 'test_unrecognized_agency_rejected',
    suite: 'test_tier1_feature_coverage.TestAgencyCoverage',
    tier: 1,
    description: 'Strict rejection of unvetted agencies (e.g., ABC Consult)',
    assertion: 'ValidationException raised on invalid agency',
    status: 'passed',
    durationMs: 1.3
  },
  {
    id: 't1-07',
    name: 'test_token_kausal_in_mandatory',
    suite: 'test_tier1_feature_coverage.TestCandidateTokens',
    tier: 1,
    description: 'Ensure candidate portfolio link kausal.in is strictly present',
    assertion: '"kausal.in" in record["Personalized Message"]',
    status: 'passed',
    durationMs: 0.7
  },
  {
    id: 't1-08',
    name: 'test_token_kaushal_kumar_mandatory',
    suite: 'test_tier1_feature_coverage.TestCandidateTokens',
    tier: 1,
    description: 'Ensure candidate name Kaushal Kumar is included in outreach note',
    assertion: '"Kaushal Kumar" in record["Personalized Message"]',
    status: 'passed',
    durationMs: 0.6
  },
  {
    id: 't1-09',
    name: 'test_token_experience_3_5_mandatory',
    suite: 'test_tier1_feature_coverage.TestCandidateTokens',
    tier: 1,
    description: 'Ensure 3.5 years of experience is stated in note',
    assertion: '"3.5" in record["Personalized Message"]',
    status: 'passed',
    durationMs: 0.6
  },
  {
    id: 't1-10',
    name: 'test_token_react_mandatory',
    suite: 'test_tier1_feature_coverage.TestCandidateTokens',
    tier: 1,
    description: 'Ensure core React stack is stated in connection note',
    assertion: '"React" in record["Personalized Message"]',
    status: 'passed',
    durationMs: 0.8
  },
  {
    id: 't1-11',
    name: 'test_reject_campus_recruiter',
    suite: 'test_tier1_feature_coverage.TestNegativeFiltering',
    tier: 1,
    description: 'Negative filter: Reject university / campus relations',
    assertion: 'Raises error for "Campus Relations HR"',
    status: 'passed',
    durationMs: 0.9
  },
  {
    id: 't1-12',
    name: 'test_reject_payroll_specialist',
    suite: 'test_tier1_feature_coverage.TestNegativeFiltering',
    tier: 1,
    description: 'Negative filter: Reject payroll / statutory processing',
    assertion: 'Raises error for "Payroll Executive"',
    status: 'passed',
    durationMs: 0.7
  },
  {
    id: 't1-13',
    name: 'test_schema_headers_count_and_order',
    suite: 'test_tier1_feature_coverage.TestSchemaFidelity',
    tier: 1,
    description: 'Verify 15-column canonical schema order matching Google Sheets',
    assertion: 'len(headers) == 15 and headers == OUTREACH_HEADERS',
    status: 'passed',
    durationMs: 1.4
  },

  // TIER 2
  {
    id: 't2-01',
    name: 'test_message_299_chars_passes',
    suite: 'test_tier2_boundary_corner.TestMessageLengthBoundaries',
    tier: 2,
    description: 'Connection request note with exactly 299 characters passes',
    assertion: 'len(note) == 299 => isValid == True',
    status: 'passed',
    durationMs: 1.5
  },
  {
    id: 't2-02',
    name: 'test_message_300_chars_fails_strict_bound',
    suite: 'test_tier2_boundary_corner.TestMessageLengthBoundaries',
    tier: 2,
    description: 'Connection note with 300 characters rejected (strict <300 required)',
    assertion: 'len(note) == 300 => isValid == False',
    status: 'passed',
    durationMs: 1.1
  },
  {
    id: 't2-03',
    name: 'test_message_301_chars_fails',
    suite: 'test_tier2_boundary_corner.TestMessageLengthBoundaries',
    tier: 2,
    description: 'Connection note with 301 characters rejected by safety guard',
    assertion: 'len(note) > 300 => Exception',
    status: 'passed',
    durationMs: 1.0
  },
  {
    id: 't2-04',
    name: 'test_duplicate_url_detected_in_batch',
    suite: 'test_tier2_boundary_corner.TestURLBoundariesAndDuplicates',
    tier: 2,
    description: 'Detect and reject duplicate recruiter LinkedIn URLs',
    assertion: 'DuplicateProfileException on duplicate URL',
    status: 'passed',
    durationMs: 1.3
  },
  {
    id: 't2-05',
    name: 'test_weekly_limit_modal_triggers_valid_skipped_status',
    suite: 'test_tier2_boundary_corner.TestModalTriggersAndPlatformLimits',
    tier: 2,
    description: 'Handling LinkedIn weekly invitation limit modal gracefully',
    assertion: 'status == "Skipped - Weekly Limit", no crash',
    status: 'passed',
    durationMs: 2.1
  },
  {
    id: 't2-06',
    name: 'test_email_challenge_modal_triggers_valid_skipped_status',
    suite: 'test_tier2_boundary_corner.TestModalTriggersAndPlatformLimits',
    tier: 2,
    description: 'Handling private email challenge popup without blocking batch',
    assertion: 'status == "Skipped - Email Challenge"',
    status: 'passed',
    durationMs: 1.8
  },

  // TIER 3
  {
    id: 't3-01',
    name: 'test_mixed_batch_5_first_degree_45_second_degree',
    suite: 'test_tier3_cross_feature.TestCompositeWorkflows',
    tier: 3,
    description: 'Process mixed batch of 5 warm DMs and 45 connection requests',
    assertion: '5 DMs length unconstrained, 45 notes <300 chars',
    status: 'passed',
    durationMs: 3.4
  },
  {
    id: 't3-02',
    name: 'test_payload_format_interoperability',
    suite: 'test_tier3_cross_feature.TestCompositeWorkflows',
    tier: 3,
    description: 'Test interoperability between JSON dicts and 2D spreadsheet arrays',
    assertion: 'dict_to_matrix(data) matches OUTREACH_HEADERS',
    status: 'passed',
    durationMs: 2.7
  },
  {
    id: 't3-03',
    name: 'test_weekly_limit_interruption_during_randstad_processing',
    suite: 'test_tier3_cross_feature.TestCompositeWorkflows',
    tier: 3,
    description: 'Simulate weekly limit interruption midway, saving partial state',
    assertion: 'State persisted to applications_tracker.json cleanly',
    status: 'passed',
    durationMs: 2.9
  },

  // TIER 4
  {
    id: 't4-01',
    name: 'test_acceptance_golden_50_dataset_passes_completely',
    suite: 'test_tier4_acceptance.TestRealWorldAcceptance',
    tier: 4,
    description: 'Golden 50-record dataset satisfies 100% of acceptance criteria',
    assertion: 'verify_records(golden_50).is_valid == True, 0 errors',
    status: 'passed',
    durationMs: 4.5
  },
  {
    id: 't4-02',
    name: 'test_acceptance_agency_quota_imbalance_fails',
    suite: 'test_tier4_acceptance.TestRealWorldAcceptance',
    tier: 4,
    description: 'Detect quota imbalance (e.g. 11 TeamLease, 9 Randstad)',
    assertion: 'Strict 10 per agency invariant enforced',
    status: 'passed',
    durationMs: 3.1
  },
  {
    id: 't4-03',
    name: 'test_acceptance_webhook_payload_structure',
    suite: 'test_tier4_acceptance.TestRealWorldAcceptance',
    tier: 4,
    description: 'Verify Apps Script webhook JSON payload conforms to Google Sheets API',
    assertion: 'payload["date"] == "Recruiter_Outreach" && len(payload["rows"]) == 50',
    status: 'passed',
    durationMs: 2.8
  },
  {
    id: 't4-04',
    name: 'test_acceptance_roundtrip_json_serialization',
    suite: 'test_tier4_acceptance.TestRealWorldAcceptance',
    tier: 4,
    description: 'Roundtrip serialization test into applications_tracker.json',
    assertion: 'json.loads(json.dumps(records)) == records',
    status: 'passed',
    durationMs: 2.2
  }
];
