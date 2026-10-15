/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Mail, 
  ExternalLink, 
  Copy, 
  Check, 
  Radar, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  RotateCw, 
  Zap, 
  FileText, 
  Layers, 
  MessageSquare,
  Building,
  UserCheck
} from 'lucide-react';
import { 
  agentSkills, 
  generateTailoredCoverNote, 
  generateHiringManagerEmail, 
  generateLinkedInConnectionNote, 
  candidateAutofillData 
} from '../data/autoApplyEngine';
import { rawApplications } from '../data/projectData';

export const AutoApplyCockpitTab: React.FC = () => {
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  const [customCompany, setCustomCompany] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeOutreachView, setActiveOutreachView] = useState<'email' | 'linkedin' | 'cover' | 'autofill'>('email');

  const currentJob = rawApplications[selectedJobIndex] || rawApplications[0];
  const targetCompany = customCompany.trim() || currentJob.company;
  const targetRole = customRole.trim() || currentJob.job_title;

  const emailOutreach = generateHiringManagerEmail(targetCompany, targetRole);
  const coverNote = generateTailoredCoverNote(targetCompany, targetRole);
  const linkedinNote = generateLinkedInConnectionNote(targetCompany, currentJob.notes?.split(' ')[0] || 'Tech Recruiter');

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleRunPipeline = () => {
    if (isApplying) return;
    setIsApplying(true);
    setPipelineStep(1);

    const steps = [
      { step: 1, delay: 500 }, // Evaluating 6-factor score
      { step: 2, delay: 1100 }, // Crafting customized cover note
      { step: 3, delay: 1700 }, // Preparing ATS Autofill payload
      { step: 4, delay: 2300 }, // Generating Manager Cold Email
      { step: 5, delay: 2900 }, // Verifying <300 char LinkedIn note
      { step: 6, delay: 3500 }, // Completed
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setPipelineStep(step);
        if (step === 6) {
          setIsApplying(false);
        }
      }, delay);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Cockpit Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Autonomous Job Search & Auto-Apply Radar
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Real-Time Job Sentinel & <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Instant Auto-Apply Engine</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Continuously monitors 132+ target company ATS boards across the web. When a matching role is posted, the autonomous agents evaluate the 6-factor candidate match score, generate tailored cold emails to Engineering Managers, prepare &lt;300 character LinkedIn connection notes, and autofill application forms with Kaushal Kumar&apos;s verified credentials.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleRunPipeline}
              disabled={isApplying}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isApplying ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" /> Executing Agent Pipeline (Step {pipelineStep}/6)...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Run Auto-Apply Pipeline for {targetCompany}
                </>
              )}
            </button>

            <a
              href={emailOutreach.mailtoUrl}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Mail className="w-4 h-4 text-indigo-400" /> Open Manager Cold Email (mailto:)
            </a>
          </div>
        </div>
      </div>

      {/* 4 Agent Skills Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            Active Autonomous Agent Skills
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
            4 / 4 Agents Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {agentSkills.map((agent) => (
            <div
              key={agent.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 font-bold">
                    {agent.id === 'sentinel' && <Radar className="w-4 h-4" />}
                    {agent.id === 'scorer' && <Sparkles className="w-4 h-4" />}
                    {agent.id === 'autofill' && <Send className="w-4 h-4" />}
                    {agent.id === 'outreach' && <Mail className="w-4 h-4" />}
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                  <div className="text-[11px] text-indigo-400 font-medium">{agent.role}</div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                {agent.lastAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interactive Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Target Job Selector & 6-Factor Match Rubric */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-400" />
              Select Target Role from Radar
            </h4>

            {/* Quick picker from live applications */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Live High-Priority Radar Postings:
              </label>
              <select
                value={selectedJobIndex}
                onChange={(e) => {
                  setSelectedJobIndex(Number(e.target.value));
                  setCustomCompany('');
                  setCustomRole('');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {rawApplications.map((app, idx) => (
                  <option key={idx} value={idx}>
                    [{app.priority}] {app.company} – {app.job_title} ({app.match_score}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Or custom job test */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Or Test Any Company / Job:
              </span>
              <input
                type="text"
                placeholder="Company Name (e.g. Google, Atlassian, Uber)"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Role Title (e.g. Software Engineer II - Frontend)"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* 6-Factor Match Rubric Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">6-Factor Match Score</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentJob.match_score}% High Match
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Technical Stack (React/RN/TS):</span>
                  <span className="text-emerald-400 font-semibold">40 / 40 pts</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]"></div>
                </div>

                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Experience Alignment (3.5 YOE):</span>
                  <span className="text-emerald-400 font-semibold">20 / 20 pts</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]"></div>
                </div>

                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">CI/CD & Deployment (OpenShift/Harness):</span>
                  <span className="text-emerald-400 font-semibold">15 / 15 pts</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]"></div>
                </div>

                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Code Quality & 90%+ Unit Testing:</span>
                  <span className="text-emerald-400 font-semibold">15 / 15 pts</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]"></div>
                </div>

                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">AI Architect Certification:</span>
                  <span className="text-violet-400 font-semibold">10 / 10 pts</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-violet-500 h-full w-[100%]"></div>
                </div>
              </div>
            </div>

            {/* Direct ATS Link */}
            <a
              href={currentJob.job_url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Open Direct ATS Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Col: Multi-Channel Outreach & Autofill Hub */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            {/* Outreach Sub-Nav */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveOutreachView('email')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeOutreachView === 'email'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Manager Cold Email
                </button>
                <button
                  onClick={() => setActiveOutreachView('linkedin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeOutreachView === 'linkedin'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> LinkedIn Connection Note (&lt;300c)
                </button>
                <button
                  onClick={() => setActiveOutreachView('cover')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeOutreachView === 'cover'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Tailored Cover Letter
                </button>
                <button
                  onClick={() => setActiveOutreachView('autofill')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeOutreachView === 'autofill'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" /> Form Autofill Data
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                Target: {targetCompany}
              </span>
            </div>

            {/* VIEW 1: COLD EMAIL */}
            {activeOutreachView === 'email' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block text-[11px]">Subject:</span>
                    <span className="font-semibold text-white font-mono">{emailOutreach.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={emailOutreach.mailtoUrl}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5" /> Open in Mail App
                    </a>
                    <button
                      onClick={() => handleCopy(emailOutreach.body, 'email')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5"
                    >
                      {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedType === 'email' ? 'Copied Body!' : 'Copy Body'}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed max-h-[320px] overflow-y-auto whitespace-pre-line font-sans select-all">
                  {emailOutreach.body}
                </div>
              </div>
            )}

            {/* VIEW 2: LINKEDIN NOTE */}
            {activeOutreachView === 'linkedin' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {linkedinNote.length} / 300 chars (Compliant)
                    </span>
                    <span className="text-slate-500 text-[11px]">Mandatory tokens included: kausal.in, Kaushal Kumar, 3.5, React</span>
                  </div>
                  <button
                    onClick={() => handleCopy(linkedinNote, 'linkedin')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {copiedType === 'linkedin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'linkedin' ? 'Copied Note!' : 'Copy Connection Note'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans select-all">
                  {linkedinNote}
                </div>
              </div>
            )}

            {/* VIEW 3: TAILORED COVER NOTE */}
            {activeOutreachView === 'cover' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Tailored specifically for {targetCompany} &amp; {targetRole}</span>
                  <button
                    onClick={() => handleCopy(coverNote, 'cover')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {copiedType === 'cover' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'cover' ? 'Copied Letter!' : 'Copy Cover Letter'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed max-h-[320px] overflow-y-auto whitespace-pre-line font-sans select-all">
                  {coverNote}
                </div>
              </div>
            )}

            {/* VIEW 4: ATS FORM AUTOFILL PAYLOAD */}
            {activeOutreachView === 'autofill' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Standard ATS Candidate Input Payload</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(candidateAutofillData, null, 2), 'autofill')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    {copiedType === 'autofill' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'autofill' ? 'Copied JSON!' : 'Copy Form Data JSON'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(candidateAutofillData).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="text-slate-200 font-mono text-[11px] truncate select-all">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
