/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Building2, 
  Calendar, 
  MapPin, 
  Download,
  Filter
} from 'lucide-react';
import { rawApplications, ApplicationItem } from '../data/projectData';

export const ApplicationsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'P0' | 'P1' | 'P2'>('ALL');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  const filteredApps = useMemo(() => {
    return rawApplications.filter((app) => {
      const matchesSearch = 
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.job_title.toLowerCase().includes(search.toLowerCase()) ||
        app.skills_required.toLowerCase().includes(search.toLowerCase()) ||
        (app.location && app.location.toLowerCase().includes(search.toLowerCase()));

      const matchesPriority = priorityFilter === 'ALL' || app.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [search, priorityFilter]);

  const p0Count = rawApplications.filter(a => a.priority === 'P0').length;
  const p1Count = rawApplications.filter(a => a.priority === 'P1').length;
  const p2Count = rawApplications.filter(a => a.priority === 'P2').length;

  const exportCSV = () => {
    const headers = ['Priority', 'Match Score', 'Company', 'Job Title', 'Location', 'Experience', 'Platform', 'Status', 'Job URL'];
    const rows = filteredApps.map(a => [
      a.priority,
      `${a.match_score}%`,
      `"${a.company.replace(/"/g, '""')}"`,
      `"${a.job_title.replace(/"/g, '""')}"`,
      `"${a.location.replace(/"/g, '""')}"`,
      `"${a.experience_required}"`,
      `"${a.platform}"`,
      a.status,
      a.job_url
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `applications_tracker_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            Tracked Applications
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredApps.length} of {rawApplications.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real curated engineering opportunities aligned with candidate profile & referral routes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, title, or skills..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto">
          <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Priority:
          </span>
          <button
            onClick={() => setPriorityFilter('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              priorityFilter === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({rawApplications.length})
          </button>
          <button
            onClick={() => setPriorityFilter('P0')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              priorityFilter === 'P0'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            P0 Urgent ({p0Count})
          </button>
          <button
            onClick={() => setPriorityFilter('P1')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              priorityFilter === 'P1'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            P1 High ({p1Count})
          </button>
          <button
            onClick={() => setPriorityFilter('P2')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              priorityFilter === 'P2'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            P2 Medium ({p2Count})
          </button>
        </div>
      </div>

      {/* Applications Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app, idx) => {
          const isP0 = app.priority === 'P0';
          const isP1 = app.priority === 'P1';

          return (
            <div
              key={`${app.company}-${idx}`}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header: Company & Match Score */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      {app.job_id || `JOB-${idx + 1}`}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {app.company}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      isP0 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : isP1 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {app.priority}
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {app.match_score}% Match
                    </span>
                  </div>
                </div>

                {/* Role Title & Location */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {app.job_title}
                  </h4>
                  <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {app.location}
                    </span>
                    <span>•</span>
                    <span>{app.experience_required}</span>
                  </div>
                </div>

                {/* Skills Tag Cloud */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Skills Required:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {app.skills_required.split(',').slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                    {app.skills_required.split(',').length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-800/50 text-slate-500">
                        +{app.skills_required.split(',').length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes & Referral Channel */}
                {app.notes && (
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-indigo-400 font-semibold">Strategic note: </span>
                    {app.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  {app.applied_date || '2026-10-02'}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={app.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    Apply Direct <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
