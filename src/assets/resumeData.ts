/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import resumeJson from '../../public/Kaushal_Kumar_Resume.json';

export interface ResumeData {
  name: string;
  contact: {
    location: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  technical_skills: {
    frontend_and_mobile: string[];
    state_and_data_management: string[];
    testing_and_tools: string[];
    cloud_devops_and_storage: string[];
  };
  experience: {
    role: string;
    company: string;
    period: string;
    highlights: string[];
  }[];
  projects: {
    name: string;
    period: string;
    stack: string;
    highlights: string[];
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
  awards: {
    title: string;
    org: string;
    date: string;
    description: string;
  }[];
  education: {
    degree: string;
    cgpa: string;
    period: string;
    institution: string;
  };
}

export const resumeData = resumeJson as ResumeData;
