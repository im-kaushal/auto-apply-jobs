/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Sparkles,
  Layers,
  AlertCircle,
  Sun,
  Moon,
  RotateCw,
  Globe
} from 'lucide-react';
import { resumeData } from '../assets/resumeData';
import { exportDomToPdf, downloadStandaloneHtml } from '../utils/domToPdf';
import { generateResumePdf } from '../utils/generateResumePdf';

export const ResumeTab: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [resumeTheme, setResumeTheme] = useState<'dark' | 'light'>('dark');
  const resumeContainerRef = useRef<HTMLDivElement>(null);

  const handleCopyMarkdown = () => {
    fetch('/Kaushal_Kumar_Resume.md')
      .then(r => r.text())
      .then(text => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  // Direct export of the exact UI component to PDF
  const handleDownloadVisualPdf = async () => {
    if (!resumeContainerRef.current || isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      await exportDomToPdf(
        resumeContainerRef.current,
        `Kaushal_Kumar_Resume_${resumeTheme}.pdf`,
        resumeTheme === 'dark'
      );
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3000);
    } catch (err) {
      console.error('Visual PDF export error, falling back to vector generator:', err);
      generateResumePdf();
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Direct export of the exact UI component to standalone HTML
  const handleDownloadHtml = () => {
    if (!resumeContainerRef.current) return;
    setIsExportingHtml(true);
    try {
      downloadStandaloneHtml(
        resumeContainerRef.current,
        `Kaushal_Kumar_Resume_${resumeTheme}.html`
      );
    } finally {
      setTimeout(() => setIsExportingHtml(false), 1500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls / Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Candidate Resume
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified Asset
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kaushal Kumar • Frontend & Mobile Software Engineer (3.5+ YOE) • Formatted & Ready to Download
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme switcher for Resume */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center mr-1">
            <button
              onClick={() => setResumeTheme('dark')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                resumeTheme === 'dark'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Modern Dark Theme (as in UI screenshot)"
            >
              <Moon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Dark UI</span>
            </button>
            <button
              onClick={() => setResumeTheme('light')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                resumeTheme === 'light'
                  ? 'bg-slate-200 text-slate-900 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Classic Executive White Theme"
            >
              <Sun className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Light ATS</span>
            </button>
          </div>

          {/* Primary Action: Direct UI PDF Download */}
          <button
            onClick={handleDownloadVisualPdf}
            disabled={isExportingPdf}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            {isExportingPdf ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" /> Generating PDF...
              </>
            ) : pdfDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" /> PDF Downloaded!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" /> Download PDF (Exact UI)
              </>
            )}
          </button>

          {/* Standalone HTML Download */}
          <button
            onClick={handleDownloadHtml}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Download complete standalone HTML file with identical styles"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            {isExportingHtml ? 'Saving HTML...' : 'Standalone HTML'}
          </button>

          {/* Markdown Download */}
          <a
            href="/Kaushal_Kumar_Resume.md"
            download="Kaushal_Kumar_Resume.md"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Markdown (.md)
          </a>

          {/* JSON Download */}
          <a
            href="/Kaushal_Kumar_Resume.json"
            download="Kaushal_Kumar_Resume.json"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> JSON (.json)
          </a>

          {/* Copy Text */}
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Text
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instant Info Banner */}
      <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-900/40 flex items-center justify-between text-xs text-indigo-200 print:hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Clicking <strong>Download PDF (Exact UI)</strong> captures this exact visual layout with high-resolution 2x typography, colors, and layout directly to your device.
          </span>
        </div>
        <span className="font-mono text-[11px] text-indigo-400 hidden sm:inline">
          Format: A4 ({resumeTheme.toUpperCase()} theme)
        </span>
      </div>

      {/* Resume Document Canvas (Exact element captured by html2canvas) */}
      <div 
        ref={resumeContainerRef}
        id="resume-printable-card"
        className={`max-w-4xl mx-auto rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8 transition-colors duration-200 ${
          resumeTheme === 'dark'
            ? 'bg-slate-900 border border-slate-800 text-slate-200'
            : 'bg-white border border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        
        {/* Header */}
        <div className={`text-center space-y-3 pb-6 border-b ${
          resumeTheme === 'dark' ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {resumeData.name}
          </h1>
          
          <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs ${
            resumeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span className="flex items-center gap-1">
              <MapPin className={`w-3.5 h-3.5 ${resumeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} /> 
              {resumeData.contact.location}
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <Phone className={`w-3.5 h-3.5 ${resumeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} /> 
              {resumeData.contact.phone}
            </span>
            <span>|</span>
            <a 
              href={`mailto:${resumeData.contact.email}`} 
              className={`flex items-center gap-1 underline ${
                resumeTheme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
              }`}
            >
              <Mail className={`w-3.5 h-3.5 ${resumeTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} /> 
              {resumeData.contact.email}
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium pt-1">
            <a 
              href={resumeData.contact.linkedin} 
              target="_blank" 
              rel="noreferrer"
              className={`flex items-center gap-1 underline ${
                resumeTheme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
              }`}
            >
              linkedin.com/in/im-kaushal <ExternalLink className="w-3 h-3" />
            </a>
            <span className={resumeTheme === 'dark' ? 'text-slate-600' : 'text-slate-300'}>•</span>
            <a 
              href={resumeData.contact.github} 
              target="_blank" 
              rel="noreferrer"
              className={`flex items-center gap-1 underline ${
                resumeTheme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
              }`}
            >
              github.com/im-kaushal <ExternalLink className="w-3 h-3" />
            </a>
            <span className={resumeTheme === 'dark' ? 'text-slate-600' : 'text-slate-300'}>•</span>
            <a 
              href={resumeData.contact.portfolio} 
              target="_blank" 
              rel="noreferrer"
              className={`flex items-center gap-1 underline font-semibold ${
                resumeTheme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
              }`}
            >
              kausal.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <h2 className={`text-xs uppercase font-extrabold tracking-wider border-b pb-1 ${
            resumeTheme === 'dark' 
              ? 'text-indigo-400 border-slate-800' 
              : 'text-indigo-700 border-slate-200'
          }`}>
            Professional Summary
          </h2>
          <p className={`text-xs sm:text-sm leading-relaxed ${
            resumeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            {resumeData.summary}
          </p>
        </div>

        {/* Technical Skills */}
        <div className="space-y-3">
          <h2 className={`text-xs uppercase font-extrabold tracking-wider border-b pb-1 ${
            resumeTheme === 'dark' 
              ? 'text-indigo-400 border-slate-800' 
              : 'text-indigo-700 border-slate-200'
          }`}>
            Technical Skills
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <span className={`font-bold min-w-[190px] ${
                resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Frontend & Mobile:
              </span>
              <span className={resumeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                {resumeData.technical_skills.frontend_and_mobile.join(', ')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <span className={`font-bold min-w-[190px] ${
                resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                State & Data Management:
              </span>
              <span className={resumeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                {resumeData.technical_skills.state_and_data_management.join(', ')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <span className={`font-bold min-w-[190px] ${
                resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Testing & Tools:
              </span>
              <span className={resumeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                {resumeData.technical_skills.testing_and_tools.join(', ')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-2">
              <span className={`font-bold min-w-[190px] ${
                resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Cloud, DevOps & Storage:
              </span>
              <span className={resumeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                {resumeData.technical_skills.cloud_devops_and_storage.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Professional Experience */}
        <div className="space-y-4">
          <h2 className={`text-xs uppercase font-extrabold tracking-wider border-b pb-1 ${
            resumeTheme === 'dark' 
              ? 'text-indigo-400 border-slate-800' 
              : 'text-indigo-700 border-slate-200'
          }`}>
            Professional Experience
          </h2>
          
          <div className="space-y-4">
            {resumeData.experience.map((exp, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className={`font-bold text-sm ${
                      resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {exp.role}
                    </span>
                    <span className={`text-xs ml-1.5 font-medium ${
                      resumeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      – {exp.company}
                    </span>
                  </div>
                  <span className={`text-xs font-mono ${
                    resumeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {exp.period}
                  </span>
                </div>

                <ul className={`list-disc list-outside pl-4 space-y-1 text-xs leading-relaxed ${
                  resumeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {exp.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Key Projects */}
        <div className="space-y-4">
          <h2 className={`text-xs uppercase font-extrabold tracking-wider border-b pb-1 ${
            resumeTheme === 'dark' 
              ? 'text-indigo-400 border-slate-800' 
              : 'text-indigo-700 border-slate-200'
          }`}>
            Key Projects
          </h2>

          <div className="space-y-4">
            {resumeData.projects.map((proj, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className={`font-bold text-sm ${
                    resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {proj.name}
                  </span>
                  <span className={`text-xs font-mono ${
                    resumeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {proj.period}
                  </span>
                </div>

                <div className={`text-xs font-mono ${
                  resumeTheme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'
                }`}>
                  <span className={`font-semibold ${
                    resumeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>Tech Stack: </span>
                  {proj.stack}
                </div>

                <ul className={`list-disc list-outside pl-4 space-y-1 text-xs leading-relaxed pt-1 ${
                  resumeTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {proj.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Certifications */}
          <div className="space-y-2.5">
            <h2 className={`text-xs uppercase font-extrabold tracking-wider border-b pb-1 flex items-center gap-1.5 ${
              resumeTheme === 'dark' 
                ? 'text-indigo-400 border-slate-800' 
                : 'text-indigo-700 border-slate-200'
            }`}>
              <Sparkles className="w-3.5 h-3.5" /> Certifications
            </h2>
            <div className="space-y-2 text-xs">
              {resumeData.certifications.map((c, idx) => (
                <div key={idx} className="flex justify-between items-baseline gap-2">
                  <div>
                    <div className={`font-semibold ${
                      resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {c.name}
                    </div>
                    <div className={`text-[11px] ${
                      resumeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {c.issuer}
                    </div>
                  </div>
                  <span className={`text-[11px] font-mono shrink-0 ${
                    resumeTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    {c.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="space-y-2.5">
            <h2 className={`text-xs uppercase font-extrabold tracking-wider border-b pb-1 flex items-center gap-1.5 ${
              resumeTheme === 'dark' 
                ? 'text-indigo-400 border-slate-800' 
                : 'text-indigo-700 border-slate-200'
            }`}>
              <Award className="w-3.5 h-3.5" /> Awards & Recognition
            </h2>
            <div className="space-y-2 text-xs">
              {resumeData.awards.map((a, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className={`font-semibold ${
                      resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {a.title}{' '}
                      <span className={resumeTheme === 'dark' ? 'text-slate-400 font-normal' : 'text-slate-500 font-normal'}>
                        ({a.org})
                      </span>
                    </span>
                    <span className={`text-[11px] font-mono shrink-0 ${
                      resumeTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                      {a.date}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${
                    resumeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {a.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-2 pt-2">
          <h2 className={`text-xs uppercase font-extrabold tracking-wider border-b pb-1 flex items-center gap-1.5 ${
            resumeTheme === 'dark' 
              ? 'text-indigo-400 border-slate-800' 
              : 'text-indigo-700 border-slate-200'
          }`}>
            <GraduationCap className="w-3.5 h-3.5" /> Education
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
            <div>
              <span className={`font-bold ${
                resumeTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {resumeData.education.degree}
              </span>
              <span className={resumeTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                {' '}(CGPA: {resumeData.education.cgpa})
              </span>
              <div className={resumeTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                {resumeData.education.institution}
              </div>
            </div>
            <span className={`font-mono ${
              resumeTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'
            }`}>
              {resumeData.education.period}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
