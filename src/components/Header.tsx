/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GitBranch, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  User, 
  FileSpreadsheet, 
  Layers, 
  Code2, 
  ShieldCheck, 
  ChevronRight,
  X,
  FileText
} from 'lucide-react';
import { trackerConfig } from '../data/projectData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profile = trackerConfig.candidate_profile;

  const navItems = [
    { id: 'overview', label: 'Overview & Architecture', icon: Layers },
    { id: 'autoapply', label: 'Auto-Apply & Agents', icon: Sparkles },
    { id: 'resume', label: 'Resume (Asset)', icon: FileText },
    { id: 'applications', label: 'Applications (21)', icon: FileSpreadsheet },
    { id: 'companies', label: 'Target Companies (132)', icon: FileSpreadsheet },
    { id: 'recruiters', label: 'Recruiter Outreach (50)', icon: User },
    { id: 'tests', label: 'Test Suite (65/65)', icon: ShieldCheck },
    { id: 'code', label: 'Repository Files', icon: Code2 },
  ];

  return (
    <>
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-900/40 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-400">Repository Pulled:</span>
              <a 
                href="https://github.com/im-kaushal/auto-apply-jobs" 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-300 hover:text-white underline decoration-slate-600 flex items-center gap-1 font-mono"
              >
                im-kaushal/auto-apply-jobs <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-slate-400 hidden sm:inline">Branch: <span className="font-mono text-slate-300">main</span></span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> 65 Automated Tests Passing
              </span>
              <a 
                href={trackerConfig.spreadsheet_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Google Sheets Tracker
              </a>
            </div>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-white">Auto Apply Jobs & Outreach Hub</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    Production Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Automated LinkedIn Recruiter Outreach, Target Companies Sourcing & Google Sheets Webhook Sync
                </p>
              </div>
            </div>

            {/* Candidate quick profile badge */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowProfileModal(true)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-[10px]">
                  KK
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-200 group-hover:text-white flex items-center gap-1">
                    {profile.name} <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                  </div>
                  <div className="text-[10px] text-slate-400">{profile.experience_years} YOE • React/RN Specialist</div>
                </div>
              </button>

              <a
                href="https://kausal.in"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-600/40 transition-colors"
              >
                kausal.in <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 mt-4 overflow-x-auto scrollbar-none border-t border-slate-800/80 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Candidate Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                KK
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{profile.name}</h3>
                <p className="text-xs text-slate-400">{profile.location} • {profile.experience_years} Years Experience</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1.5 uppercase tracking-wider text-[10px]">
                  Primary Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.primary_stack.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1.5 uppercase tracking-wider text-[10px]">
                  DevOps, Cloud & CI/CD
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.devops_cicd.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-emerald-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1.5 uppercase tracking-wider text-[10px]">
                  Industry Domains
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.domains.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/50 text-indigo-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1.5 uppercase tracking-wider text-[10px]">
                  AI Architecture & Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.ai_tools.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-violet-950/60 border border-violet-800/50 text-violet-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400">
                <span>Personal Portfolio:</span>
                <a 
                  href="https://kausal.in" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-indigo-400 hover:text-indigo-300 font-medium underline flex items-center gap-1"
                >
                  kausal.in <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setActiveTab('resume');
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all text-xs"
                >
                  <FileText className="w-4 h-4" /> View & Download Full Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
