/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import trackerConfigData from '../../tracker_config.json';
import targetCompaniesData from '../../target_companies.json';
import curatedTargetCompaniesData from '../../backup_user_curated_target_companies.json';
import sourcedRecruitersData from '../../sourced_recruiters.json';
import applicationsTrackerData from '../../applications_tracker.json';

export interface AuditedCompany {
  name: string;
  sector: string;
  careerPortal: string;
  auditStatus: 'Working & Direct' | 'Generic Landing' | 'Broken';
  notes: string;
}

export interface CandidateProfile {
  name: string;
  location: string;
  experience_years: number;
  primary_stack: string[];
  devops_cicd: string[];
  ai_tools: string[];
  domains: string[];
}

export interface TrackerConfig {
  spreadsheet_id: string;
  spreadsheet_url: string;
  apps_script_webhook_url: string;
  candidate_profile: CandidateProfile;
}

export interface ApplicationItem {
  priority: 'P0' | 'P1' | 'P2';
  match_score: number;
  company: string;
  job_title: string;
  location: string;
  experience_required: string;
  job_id: string;
  platform: string;
  job_url: string;
  skills_required: string;
  status: string;
  applied_date: string;
  notes: string;
  role_level?: string;
  skills_matched?: string;
  skill_gaps?: string;
  why_matches?: string;
  referral_employees?: string;
}

export interface TargetCompany {
  name: string;
  industry: string;
  hubs: string;
  stack: string;
  headcountTier: string;
  careerUrl: string;
  linkedinUrl: string;
  ratings: string;
  compensationBand: string;
  valueProposition: string;
}

export interface SourcedRecruiter {
  agency: string;
  person_name: string;
  linkedin_profile: string;
  current_designation: string;
  location: string;
  recruitment_domain: string;
  relevant_tech_roles: string;
  associated_companies: string;
  // Computed / personalized fields
  connection_status?: '1st-Degree Connection' | '2nd/3rd-Degree';
  outreach_type?: '1st-Degree Direct Message' | 'Connection Request (<300 chars)';
  personalized_note?: string;
}

export const trackerConfig = trackerConfigData as TrackerConfig;

export const rawTargetCompanies = targetCompaniesData as {
  date: string;
  headers: string[];
  rows: string[][];
};

export const targetCompanies: TargetCompany[] = rawTargetCompanies.rows.map((row) => ({
  name: row[0],
  industry: row[1],
  hubs: row[2],
  stack: row[3],
  headcountTier: row[4],
  careerUrl: row[5],
  linkedinUrl: row[6],
  ratings: row[7],
  compensationBand: row[8],
  valueProposition: row[9],
}));

export const rawApplications = (applicationsTrackerData as any).applications as ApplicationItem[];
export const rawRecruiterOutreach = (applicationsTrackerData as any).recruiter_outreach || [];
export const rawReferralOutreach = (applicationsTrackerData as any).referral_outreach || [];

export const sourcedRecruiters: SourcedRecruiter[] = (sourcedRecruitersData as any[]).map((rec, index) => {
  const firstName = rec.person_name.split(' ')[0];
  const agency = rec.agency;
  
  // 1 in 10 is considered 1st-degree connection for testing realistic distribution
  const isFirstDegree = index % 10 === 0;
  
  let personalized_note = '';
  if (isFirstDegree) {
    personalized_note = `Hey ${firstName}, hope you're having a good week! Reaching out since we're connected here, and I know ${agency} partners with great tech teams in India. I'm exploring Frontend / SDE-2 roles in Bengaluru (3.5+ yrs React, TypeScript, React Native). Check out my work: https://kausal.in – Kaushal Kumar`;
  } else {
    personalized_note = `Hi ${firstName}, noticed your tech hiring at ${agency}. I'm Kaushal Kumar, a Frontend SWE with 3.5+ yrs in React & React Native (kausal.in). Exploring SDE-2 openings and would love to connect for relevant mandates. Thanks!`;
  }

  return {
    ...rec,
    connection_status: isFirstDegree ? '1st-Degree Connection' : '2nd/3rd-Degree',
    outreach_type: isFirstDegree ? '1st-Degree Direct Message' : 'Connection Request (<300 chars)',
    personalized_note,
  };
});

export const auditedCompanies: AuditedCompany[] = ((curatedTargetCompaniesData as any).rows || []).map((row: string[]) => ({
  name: row[0],
  sector: row[1],
  careerPortal: row[2],
  auditStatus: row[3] as 'Working & Direct' | 'Generic Landing' | 'Broken',
  notes: row[4],
}));

