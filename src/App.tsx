/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { ApplicationsTab } from './components/ApplicationsTab';
import { CompaniesTab } from './components/CompaniesTab';
import { RecruitersTab } from './components/RecruitersTab';
import { TestsTab } from './components/TestsTab';
import { CodeBrowserTab } from './components/CodeBrowserTab';
import { ResumeTab } from './components/ResumeTab';
import { AutoApplyCockpitTab } from './components/AutoApplyCockpitTab';
import { trackerConfig } from './data/projectData';
import { ExternalLink, GitBranch, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sticky Header with Repo Status and Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'overview' && <OverviewTab onNavigate={setActiveTab} />}
        {activeTab === 'autoapply' && <AutoApplyCockpitTab />}
        {activeTab === 'resume' && <ResumeTab />}
        {activeTab === 'applications' && <ApplicationsTab />}
        {activeTab === 'companies' && <CompaniesTab />}
        {activeTab === 'recruiters' && <RecruitersTab />}
        {activeTab === 'tests' && <TestsTab />}
        {activeTab === 'code' && <CodeBrowserTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <span>Repository:</span>
            <a
              href="https://github.com/im-kaushal/auto-apply-jobs"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 hover:text-white font-mono flex items-center gap-1 underline decoration-slate-700"
            >
              im-kaushal/auto-apply-jobs <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Built for <strong>Kaushal Kumar</strong></span>
            <span>•</span>
            <a
              href="https://kausal.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 underline"
            >
              kausal.in
            </a>
            <span>•</span>
            <a
              href={trackerConfig.spreadsheet_url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-300 underline"
            >
              Google Sheet
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
