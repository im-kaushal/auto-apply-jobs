/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  Building2, 
  Briefcase, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  ExternalLink,
  Zap,
  Target,
  FileSpreadsheet
} from 'lucide-react';
import { trackerConfig } from '../data/projectData';

interface OverviewTabProps {
  onNavigate: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Project Brief */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Repository Pulled Successfully
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            About <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">im-kaushal/auto-apply-jobs</span>
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            This repository is an automated engineering job search, tech recruiter outreach engine, and Google Sheets application tracking system built for <strong>Kaushal Kumar</strong> (Frontend / Full Stack Software Engineer with 3.5+ years of experience in React, React Native, TypeScript, and CI/CD).
          </p>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed">
            It streamlines candidate discovery, conducts connection degree audits, generates strictly compliant outreach notes (&lt;300 characters), dispatches applications, and maintains real-time synchronization with Google Sheets via Google Apps Script webhooks—backed by a rigorous 65-test verification suite.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('autoapply')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" /> Launch Auto-Apply Radar & Agents <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('recruiters')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              Explore 50 Sourced Recruiters <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('companies')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              View 132 Target Companies <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('tests')}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Run 65-Test Suite
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('recruiters')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tech Recruiters</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">50</span>
            <span className="text-xs text-emerald-400 font-medium">10 / agency</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Across TeamLease, Randstad, Adecco, Michael Page & TEKsystems
          </p>
        </div>

        <div 
          onClick={() => onNavigate('companies')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Companies</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">132</span>
            <span className="text-xs text-violet-400 font-medium">33 Direct ATS</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            132 Audited Companies • 35 Deep-Dive Product Unicorns (up to ₹55L CTC)
          </p>
        </div>

        <div 
          onClick={() => onNavigate('applications')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Applications</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">21</span>
            <span className="text-xs text-amber-400 font-medium">91-96% Match</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            P0 & P1 prioritized roles with direct referral employee channels
          </p>
        </div>

        <div 
          onClick={() => onNavigate('tests')}
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Automated Verification</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">65 / 65</span>
            <span className="text-xs text-emerald-400 font-medium">100% Pass</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            4-Tier automated test suite (unit, boundary, cross-feature, E2E acceptance)
          </p>
        </div>
      </div>

      {/* 5-Stage Automated Architecture Pipeline */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              5-Stage Automation Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              How the automation pipeline processes recruiters, applications, and spreadsheets
            </p>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
            PROJECT.md Specs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 relative">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
              01
            </div>
            <h4 className="font-bold text-sm text-slate-200">Recruiter Sourcing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discovers 10 active IT recruiters per agency across 5 top agencies (50 total). Negative filter strictly removes campus HR, payroll, and non-tech staffing.
            </p>
            <div className="pt-2 text-[10px] text-indigo-400 font-mono">
              sourced_recruiters.json
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
              02
            </div>
            <h4 className="font-bold text-sm text-slate-200">Degree Audit & AI Note</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audits connection degree. Generates personalized note strictly &lt;300 characters for 2nd/3rd degree with tokens (<code className="text-indigo-300">kausal.in</code>, <code className="text-indigo-300">3.5</code> yrs, <code className="text-indigo-300">React</code>).
            </p>
            <div className="pt-2 text-[10px] text-indigo-400 font-mono">
              Strict &lt;300 Chars Guard
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
              03
            </div>
            <h4 className="font-bold text-sm text-slate-200">Browser Outreach</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dispatches connection requests and warm DMs in Chrome session. Gracefully detects weekly limits and email challenges without crashing.
            </p>
            <div className="pt-2 text-[10px] text-indigo-400 font-mono">
              Modal Exception Handlers
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
              04
            </div>
            <h4 className="font-bold text-sm text-slate-200">Google Sheets Sync</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pushes 50 records across 15 canonical columns to the <code className="text-indigo-300">Recruiter_Outreach</code> tab via Apps Script Webhook with 302-redirect handling.
            </p>
            <div className="pt-2 text-[10px] text-indigo-400 font-mono">
              update_sheet.py
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
              05
            </div>
            <h4 className="font-bold text-sm text-slate-200">Automated E2E Tests</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes a 65-test verification suite across Tiers 1-4 ensuring exact quota, unique profile URLs, token preservation, and zero defects.
            </p>
            <div className="pt-2 text-[10px] text-emerald-400 font-mono">
              verify_outreach.py
            </div>
          </div>
        </div>
      </div>

      {/* Target Companies & Candidate Focus Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              Target Agencies & Distribution
            </h3>
            <span className="text-xs text-slate-400 font-mono">10 recruiters each</span>
          </div>
          <div className="space-y-2.5">
            {[
              { name: 'TeamLease Digital', focus: 'Enterprise IT, Cloud, SDE-2 Frontend & React', count: 10 },
              { name: 'Randstad India', focus: 'Banking Tech GCCs, Digital Engineering, React Native', count: 10 },
              { name: 'Adecco India', focus: 'Akkodis, Fintech, High-Throughput Web Interfaces', count: 10 },
              { name: 'Michael Page India', focus: 'Product Engineering, High Growth Startups, Modern UI', count: 10 },
              { name: 'Allegis Group / TEKsystems', focus: 'Tier-1 GCCs, Digital Solutions, Full Stack UI', count: 10 },
            ].map((ag) => (
              <div key={ag.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div>
                  <div className="text-xs font-semibold text-white">{ag.name}</div>
                  <div className="text-[11px] text-slate-400">{ag.focus}</div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {ag.count} / 10
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Verification Rules & Mandatory Tokens
            </h3>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Enforced in CI
            </span>
          </div>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1.5">
              <div className="font-semibold text-slate-200">Strict LinkedIn Character Constraint</div>
              <p className="text-slate-400 text-[11px]">
                LinkedIn connection request text areas reject notes of 300+ characters. The test suite verifies every generated note is <span className="text-amber-300 font-bold">&lt; 300 characters</span> (typically 200-240 characters).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1.5">
              <div className="font-semibold text-slate-200">Mandatory Tokens in Every Outreach Note</div>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-indigo-300 text-[11px]">kausal.in</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-indigo-300 text-[11px]">Kaushal Kumar</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-indigo-300 text-[11px]">3.5</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-indigo-300 text-[11px]">React</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1.5">
              <div className="font-semibold text-slate-200">Negative Filter Keyword Blocklist</div>
              <p className="text-slate-400 text-[11px]">
                Profiles with non-technical roles like campus recruitment, payroll, compliance, legal, or factory staffing are discarded before outreach dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
