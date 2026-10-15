/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { resumeData } from '../assets/resumeData';

export interface AgentSkill {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'scanning' | 'idle';
  description: string;
  lastAction: string;
  processedCount: number;
  iconName: string;
}

export interface OutreachEmail {
  toEmail: string;
  toName: string;
  company: string;
  role: string;
  subject: string;
  body: string;
  mailtoUrl: string;
}

export interface AutoApplySubmission {
  jobId: string;
  company: string;
  jobTitle: string;
  matchScore: number;
  submittedAt: string;
  status: 'AUTO-APPLIED' | 'EMAIL-DISPATCHED' | 'LINKEDIN-QUEUED' | 'READY';
  screeningAnswers: Record<string, string>;
  coverNote: string;
  emailOutreach: OutreachEmail;
  linkedinNote: string;
}

export const agentSkills: AgentSkill[] = [
  {
    id: 'sentinel',
    name: 'ATS Sentinel Radar',
    role: 'Autonomous Web & Career Portal Scanner',
    status: 'scanning',
    description: 'Monitors 132+ target company ATS boards (Greenhouse, Lever, Workday, Darwinbox, Keka) every 15 minutes for new Frontend & SDE-2 roles.',
    lastAction: 'Scanned 132 company portals (<24h window). Detected 3 fresh postings.',
    processedCount: 132,
    iconName: 'Radar'
  },
  {
    id: 'scorer',
    name: '6-Factor Match Scorer',
    role: 'Resume & Skill Alignment Evaluator',
    status: 'active',
    description: 'Scores each incoming opening against Kaushal Kumar\'s 3.5 YOE profile on Tech (40), Experience (20), CI/CD (15), Code Quality (15), and AI Tools (10).',
    lastAction: 'Computed 96% match score for Slice & 95% for Groww SDE-2.',
    processedCount: 21,
    iconName: 'Sparkles'
  },
  {
    id: 'autofill',
    name: 'ATS Form Autofiller',
    role: 'Automated Application Dispatcher',
    status: 'active',
    description: 'Populates candidate personal details, portfolio links, screening questions, and tailored cover letters directly into application forms.',
    lastAction: 'Autofilled 3 P0 job application forms with 0 missing fields.',
    processedCount: 21,
    iconName: 'Send'
  },
  {
    id: 'outreach',
    name: 'Multi-Channel Outreach Engine',
    role: 'Email & LinkedIn Personalizer',
    status: 'active',
    description: 'Generates cold emails to Engineering Managers and strict <300 char LinkedIn connection notes linking to kausal.in.',
    lastAction: 'Drafted 50 verified recruiter outreach notes and 21 manager referral emails.',
    processedCount: 71,
    iconName: 'Mail'
  }
];

export function generateTailoredCoverNote(company: string, jobTitle: string): string {
  const isFintech = /fintech|bank|pay|trading|wealth|credit/i.test(company + ' ' + jobTitle);
  const isMobile = /mobile|react native|ios|android/i.test(jobTitle);

  let projectHook = '';
  if (isFintech) {
    projectHook = 'At HashedIn by Deloitte, I built high-throughput trade settlement interfaces for Citi Bank using Angular/React, Kafka streaming, and OpenShift CI/CD, managing multi-row grids and real-time transaction workflows.';
  } else if (isMobile) {
    projectHook = 'I have built and published 3 production React Native applications on iOS and Android (e.g., Colina Insurance), handling offline synchronization with Realm DB and cloud auth with Firebase.';
  } else {
    projectHook = 'At HashedIn by Deloitte, I led the frontend lifecycle for the Marriott mTrust Incident Management workspace using React.js and TanStack Query, optimizing page loads from 4.1s to 2.6s via code splitting and Core Web Vitals tuning.';
  }

  return `Dear Hiring Team at ${company},

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With 3.5+ years of experience as a Frontend Software Engineer specializing in React.js, React Native, TypeScript, and modern CI/CD automation, I believe my background aligns directly with your engineering requirements.

${projectHook}

Key highlights I bring to ${company}:
• 3.5+ years building scalable, high-performance web & mobile architectures (Core Web Vitals tuned to 2.6s).
• Production-grade test coverage (90%+ unit/integration testing with React Testing Library, Jasmine, and Jest).
• Certified expertise as a Claude Certified Architect and AWS Certified Developer.
• Experience collaborating with cross-functional product teams to deliver zero-defect UAT releases.

You can explore my interactive portfolio, architecture case studies, and live projects at https://kausal.in or review my code on GitHub at https://github.com/im-kaushal.

I welcome the opportunity to discuss how my frontend engineering expertise can drive impactful results for ${company}.

Best regards,
Kaushal Kumar
Phone: +91 7970513448 | Email: work.kaushal@yahoo.com
Bengaluru, India`;
}

export function generateHiringManagerEmail(company: string, jobTitle: string, hiringManagerName: string = 'Engineering Hiring Manager'): OutreachEmail {
  const subject = `Kaushal Kumar – SDE-2 (${jobTitle}) – 3.5+ YOE React/React Native Frontend Engineer`;
  
  const body = `Hi ${hiringManagerName.split(' ')[0]},

Hope you're having a productive week!

I noticed ${company}'s recent opening for ${jobTitle} and wanted to reach out directly. I'm a Frontend Software Engineer with 3.5+ years of experience specializing in React.js, React Native, TypeScript, and CI/CD pipelines (currently at HashedIn by Deloitte in Bengaluru).

Why I'd be an immediate value-add for ${company}:
1. Enterprise Frontend & Performance: Scaled high-throughput trading and incident management interfaces (Citi Bank & Marriott), reducing load times from 4.1s to 2.6s and maintaining 90%+ automated test coverage.
2. Web & Mobile Mastery: Experienced across React 18, React Native, TanStack Query, and Redux Toolkit with seamless offline sync.
3. Architecture & AI: Claude Certified Architect (Anthropic) and AWS Certified Developer.

I've put together an overview of my projects and code here:
• Portfolio: https://kausal.in
• GitHub: https://github.com/im-kaushal
• LinkedIn: https://linkedin.com/in/im-kaushal

I would love to connect for 10 minutes to discuss how I can help accelerate your engineering roadmap at ${company}. Attached is my resume for your review.

Thanks so much for your time,
Kaushal Kumar
+91 7970513448 | work.kaushal@yahoo.com
Bengaluru, India`;

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    toEmail: `hiring@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    toName: hiringManagerName,
    company,
    role: jobTitle,
    subject,
    body,
    mailtoUrl,
  };
}

export function generateLinkedInConnectionNote(company: string, recruiterName: string): string {
  const firstName = recruiterName.split(' ')[0];
  const note = `Hi ${firstName}, noticed your tech hiring at ${company}. I'm Kaushal Kumar, a Frontend SWE with 3.5+ yrs in React & React Native (kausal.in). Exploring SDE-2 openings and would love to connect for relevant mandates. Thanks!`;
  return note;
}

export const candidateAutofillData = {
  fullName: 'Kaushal Kumar',
  email: 'work.kaushal@yahoo.com',
  phone: '+91 7970513448',
  location: 'Bengaluru, Karnataka, India (560037)',
  portfolio: 'https://kausal.in',
  github: 'https://github.com/im-kaushal',
  linkedin: 'https://linkedin.com/in/im-kaushal',
  yearsOfExperience: '3.5+ Years',
  noticePeriod: '15 – 30 Days (Negotiable / Immediate)',
  currentCompany: 'HashedIn by Deloitte',
  currentRole: 'Software Engineer I',
  primarySkills: 'React.js, React Native, TypeScript, Angular, Redux Toolkit, TanStack Query, Tailwind CSS, Docker, OpenShift, CI/CD',
  education: 'B.Tech in Computer Science (CGPA: 7.61), Lovely Professional University',
  workAuthorization: 'Authorized to work in India (Citizen)',
};
