/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  ExternalLink, 
  DollarSign, 
  Users, 
  MapPin, 
  Star, 
  Briefcase, 
  Layers, 
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { targetCompanies, auditedCompanies, TargetCompany, AuditedCompany } from '../data/projectData';

export const CompaniesTab: React.FC = () => {
  const [activeView, setActiveView] = useState<'audited_132' | 'enriched_35'>('audited_132');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Working & Direct' | 'Generic Landing' | 'Broken'>('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');

  // Counts for audited 132
  const workingCount = auditedCompanies.filter(c => c.auditStatus === 'Working & Direct').length;
  const genericCount = auditedCompanies.filter(c => c.auditStatus === 'Generic Landing').length;
  const brokenCount = auditedCompanies.filter(c => c.auditStatus === 'Broken').length;

  const sectors = useMemo(() => {
    const list = new Set<string>();
    auditedCompanies.forEach(c => {
      const first = c.sector.split('/')[0].trim();
      list.add(first);
    });
    return Array.from(list).slice(0, 10);
  }, []);

  const filteredAudited = useMemo(() => {
    return auditedCompanies.filter((c) => {
      const matchesSearch = 
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.sector.toLowerCase().includes(search.toLowerCase()) ||
        c.notes.toLowerCase().includes(search.toLowerCase()) ||
        c.careerPortal.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || c.auditStatus === statusFilter;
      const matchesSector = sectorFilter === 'ALL' || c.sector.toLowerCase().includes(sectorFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesSector;
    });
  }, [search, statusFilter, sectorFilter]);

  const filteredEnriched = useMemo(() => {
    return targetCompanies.filter((company) => {
      return (
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.industry.toLowerCase().includes(search.toLowerCase()) ||
        company.hubs.toLowerCase().includes(search.toLowerCase()) ||
        company.stack.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  const exportAuditedCSV = () => {
    const headers = ['Company Name', 'Sector', 'Career Portal (Direct ATS Link)', 'Audit Status', 'Notes / Platform Details'];
    const rows = filteredAudited.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.sector.replace(/"/g, '""')}"`,
      `"${c.careerPortal}"`,
      `"${c.auditStatus}"`,
      `"${c.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audited_target_companies_132_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-violet-400" />
              Target Companies Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Check className="w-3 h-3" /> Fully Updated (132 Audited)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified ATS links, direct career portals, audit statuses, and compensation bands
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveView('audited_132')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'audited_132'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audited ATS Master (132)
            </button>
            <button
              onClick={() => setActiveView('enriched_35')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'enriched_35'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tier-1 Deep Dive (35)
            </button>
          </div>

          <button
            onClick={exportAuditedCSV}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* VIEW 1: AUDITED MASTER DIRECTORY (132 COMPANIES) */}
      {activeView === 'audited_132' && (
        <div className="space-y-4">
          {/* Audit Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Audited</span>
              <div className="text-2xl font-extrabold text-white mt-1">132</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Companies Verified</div>
            </div>

            <div 
              onClick={() => setStatusFilter('Working & Direct')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Working & Direct</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{workingCount}</div>
              <div className="text-[11px] text-emerald-400/80 mt-0.5">Direct ATS / Embeds</div>
            </div>

            <div 
              onClick={() => setStatusFilter('Generic Landing')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Generic Landing</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{genericCount}</div>
              <div className="text-[11px] text-amber-400/80 mt-0.5">Direct ATS Discovered</div>
            </div>

            <div 
              onClick={() => setStatusFilter('Broken')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Broken / Repaired</span>
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">{brokenCount}</div>
              <div className="text-[11px] text-rose-400/80 mt-0.5">Fixed with Working Portals</div>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company, sector (FinTech, SaaS), or ATS platform..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto">
              <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Status:
              </span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({auditedCompanies.length})
              </button>
              <button
                onClick={() => setStatusFilter('Working & Direct')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'Working & Direct'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Working & Direct ({workingCount})
              </button>
              <button
                onClick={() => setStatusFilter('Generic Landing')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'Generic Landing'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Generic Landing ({genericCount})
              </button>
              <button
                onClick={() => setStatusFilter('Broken')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === 'Broken'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Broken Repaired ({brokenCount})
              </button>
            </div>
          </div>

          {/* Audited Companies Table View */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4">Audit Status</th>
                    <th className="py-3 px-4">Direct Career Portal (ATS Link)</th>
                    <th className="py-3 px-4">Notes / Platform Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAudited.map((c, idx) => {
                    const isWorking = c.auditStatus === 'Working & Direct';
                    const isGeneric = c.auditStatus === 'Generic Landing';

                    return (
                      <tr 
                        key={`${c.name}-${idx}`} 
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                          {c.name}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 text-[11px]">
                            {c.sector}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 w-fit ${
                            isWorking
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isGeneric
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {isWorking ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : isGeneric ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {c.auditStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-[260px] truncate">
                          <a
                            href={c.careerPortal}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 underline font-mono text-[11px] flex items-center gap-1 truncate"
                            title={c.careerPortal}
                          >
                            <span className="truncate">{c.careerPortal}</span>
                            <ArrowUpRight className="w-3 h-3 shrink-0" />
                          </a>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px] max-w-sm leading-relaxed">
                          {c.notes}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredAudited.length} of {auditedCompanies.length} companies</span>
              <span className="font-mono text-[11px]">Source: backup_user_curated_target_companies.json</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ENRICHED 35 TIER-1 PRODUCT COMPANIES */}
      {activeView === 'enriched_35' && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 35 tier-1 companies by name, stack, or hub..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
            </div>
            <div className="text-xs text-slate-400">
              Showing {filteredEnriched.length} of {targetCompanies.length} Tier-1 Product Companies
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEnriched.map((c) => (
              <div
                key={c.name}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                        {c.name}
                      </h3>
                      <div className="text-xs text-violet-400 font-medium">{c.industry}</div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {c.ratings.split('|')[0].replace('Glassdoor:', '').trim() || '4.0+'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {c.headcountTier.split('(')[0].trim()} emp
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> Engineering Hubs
                      </div>
                      <div className="text-slate-300 font-medium line-clamp-1">{c.hubs}</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-400" /> SDE-2 Compensation Band
                      </div>
                      <div className="text-emerald-300 font-bold line-clamp-1">{c.compensationBand.split('(')[0].trim()}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3 h-3 text-indigo-400" /> Core Stack Focus:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.stack.split(',').map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-900/30 text-xs text-slate-300 leading-relaxed">
                    <span className="text-violet-300 font-semibold block mb-0.5 text-[11px]">
                      Why It Matches Kaushal (3.5 YOE):
                    </span>
                    {c.valueProposition}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
                    {c.headcountTier}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={c.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      LinkedIn <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={c.careerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      Careers Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
