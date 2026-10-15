/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Building, 
  MapPin, 
  Briefcase,
  AlertCircle,
  Download
} from 'lucide-react';
import { sourcedRecruiters, SourcedRecruiter } from '../data/projectData';

export const RecruitersTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('ALL');
  const [degreeFilter, setDegreeFilter] = useState('ALL');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const agencies = [
    'ALL',
    'TeamLease Digital',
    'Randstad India',
    'Adecco India',
    'Michael Page India',
    'Allegis Group / TEKsystems India'
  ];

  const filteredRecruiters = useMemo(() => {
    return sourcedRecruiters.filter((rec) => {
      const matchesSearch = 
        rec.person_name.toLowerCase().includes(search.toLowerCase()) ||
        rec.current_designation.toLowerCase().includes(search.toLowerCase()) ||
        rec.relevant_tech_roles.toLowerCase().includes(search.toLowerCase()) ||
        rec.location.toLowerCase().includes(search.toLowerCase()) ||
        rec.associated_companies.toLowerCase().includes(search.toLowerCase());

      const matchesAgency = agencyFilter === 'ALL' || rec.agency === agencyFilter;
      const matchesDegree = 
        degreeFilter === 'ALL' || 
        (degreeFilter === '1ST' && rec.connection_status === '1st-Degree Connection') ||
        (degreeFilter === '2ND' && rec.connection_status !== '1st-Degree Connection');

      return matchesSearch && matchesAgency && matchesDegree;
    });
  }, [search, agencyFilter, degreeFilter]);

  const copyNote = (note: string, index: number) => {
    navigator.clipboard.writeText(note);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const exportCSV = () => {
    const headers = [
      'Agency', 'Person Name', 'Designation', 'Location', 'Domain', 
      'Relevant Roles', 'Connection Status', 'Outreach Type', 'Personalized Note', 'LinkedIn Profile'
    ];
    const rows = filteredRecruiters.map(r => [
      `"${r.agency.replace(/"/g, '""')}"`,
      `"${r.person_name.replace(/"/g, '""')}"`,
      `"${r.current_designation.replace(/"/g, '""')}"`,
      `"${r.location.replace(/"/g, '""')}"`,
      `"${r.recruitment_domain.replace(/"/g, '""')}"`,
      `"${r.relevant_tech_roles.replace(/"/g, '""')}"`,
      `"${r.connection_status || '2nd/3rd-Degree'}"`,
      `"${r.outreach_type || 'Connection Request'}"`,
      `"${(r.personalized_note || '').replace(/"/g, '""')}"`,
      r.linkedin_profile
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sourced_recruiters_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Recruiter Outreach Engine
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredRecruiters.length} of {sourcedRecruiters.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            10 verified IT recruiters per agency with personalized, &lt;300 character connection notes
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" /> Export 50 Records CSV
        </button>
      </div>

      {/* Agency Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {agencies.map((agency) => {
          const isActive = agencyFilter === agency;
          const count = agency === 'ALL' 
            ? sourcedRecruiters.length 
            : sourcedRecruiters.filter(r => r.agency === agency).length;

          return (
            <button
              key={agency}
              onClick={() => setAgencyFilter(agency)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{agency === 'ALL' ? 'All Agencies' : agency}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Degree Filter */}
      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recruiter name, title, or roles..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto">
          <span className="text-xs text-slate-500 mr-1">Connection Type:</span>
          <button
            onClick={() => setDegreeFilter('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              degreeFilter === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDegreeFilter('2ND')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              degreeFilter === '2ND'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            2nd/3rd (&lt;300 chars)
          </button>
          <button
            onClick={() => setDegreeFilter('1ST')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              degreeFilter === '1ST'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            1st Degree (Warm DM)
          </button>
        </div>
      </div>

      {/* Recruiter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecruiters.map((rec, index) => {
          const isFirstDegree = rec.connection_status === '1st-Degree Connection';
          const noteLength = rec.personalized_note?.length || 0;
          const isCompliant = isFirstDegree || noteLength < 300;
          const isCopied = copiedIndex === index;

          return (
            <div
              key={`${rec.person_name}-${index}`}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-indigo-300">
                      {rec.person_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {rec.person_name}
                      </h3>
                      <div className="text-xs text-indigo-400 font-medium">{rec.current_designation}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-500" />
                        {rec.agency}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap ${
                    isFirstDegree
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {rec.connection_status}
                  </span>
                </div>

                {/* Domain & Roles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-500" /> Focus Domain
                    </div>
                    <div className="text-slate-300 font-medium line-clamp-1">{rec.recruitment_domain}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> Location
                    </div>
                    <div className="text-slate-300 font-medium line-clamp-1">{rec.location}</div>
                  </div>
                </div>

                {/* Relevant Roles Tag */}
                <div className="text-xs text-slate-400">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block mb-1">
                    Target Tech Roles:
                  </span>
                  <div className="text-slate-300 font-medium line-clamp-2">
                    {rec.relevant_tech_roles}
                  </div>
                </div>

                {/* Generated Personalized Message */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                      Personalized Outreach Note:
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                      isCompliant
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {noteLength} {isFirstDegree ? 'chars (Warm DM)' : '/ 300 chars (Compliant)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-xs text-slate-200 relative group/box">
                    <p className="leading-relaxed font-sans select-all">
                      {rec.personalized_note}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-mono line-clamp-1 max-w-[200px]">
                  Associated: {rec.associated_companies}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyNote(rec.personalized_note || '', index)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Note
                      </>
                    )}
                  </button>

                  <a
                    href={rec.linkedin_profile}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    LinkedIn <ExternalLink className="w-3 h-3" />
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
