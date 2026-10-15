/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Terminal, 
  FolderTree, 
  FileText, 
  Database,
  Download
} from 'lucide-react';
import { repoFiles, RepoFile } from '../data/repoFiles';

export const CodeBrowserTab: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<RepoFile>(repoFiles[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            Repository Files & Architecture Inspector
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Directly examine the Python automation scripts, test harnesses, and architecture blueprints pulled from the repo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadFile}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download File
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* File Navigator Sidebar */}
        <div className="md:col-span-1 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-slate-400" /> Core Repository Files
          </div>

          <div className="space-y-1">
            {repoFiles.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {file.name.endsWith('.md') ? (
                    <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  ) : file.name.endsWith('.json') ? (
                    <Database className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  ) : (
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  )}
                  <div className="truncate">
                    <div className="truncate font-mono">{file.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 mt-4 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Repository Path:</span>
            <span className="font-mono text-indigo-400 break-all">{selectedFile.path}</span>
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="md:col-span-3 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden flex flex-col">
          {/* Header of Viewer */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 font-semibold text-white">{selectedFile.name}</span>
              <span className="text-slate-500">({selectedFile.language})</span>
            </div>

            <span className="text-[11px] text-slate-400 italic">
              {selectedFile.description}
            </span>
          </div>

          {/* Code Textarea / Pre */}
          <div className="p-4 bg-slate-950 overflow-x-auto max-h-[580px] scrollbar-thin">
            <pre className="font-mono text-xs leading-relaxed text-slate-200 select-all">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
