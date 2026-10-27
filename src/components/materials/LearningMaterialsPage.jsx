import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PlayCircle,
  BookOpen,
  Bot,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { ApiService } from '../../services/api';

export default function LearningMaterialsPage({
  materials,
  setMaterials,
  onStartQuizFromMaterial,
  onOpenStudyGuide,
  onAskTutorWithMaterial,
  showToast
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileProcess = async (file) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      // 1. Client-side validation check
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        throw new Error('Unsupported format. Please upload a standard PDF document (.pdf).');
      }

      const maxBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxBytes) {
        throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit.`);
      }

      // 2. Call backend / API service
      const newMaterial = await ApiService.uploadMaterial(file);

      setMaterials((prev) => [newMaterial, ...prev.filter((m) => m.id !== newMaterial.id)]);
      showToast({
        type: 'success',
        title: 'Document Ingested! 📄',
        message: `Successfully extracted concepts and generated knowledge nodes for "${file.name}".`
      });
    } catch (err) {
      setUploadError(err.message || 'Failed to parse PDF document.');
      showToast({
        type: 'error',
        title: 'Upload Rejected',
        message: err.message || 'Could not process PDF.'
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '150 KB';
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Course Materials & Knowledge Ingestion
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Upload your professor's lecture slides, textbook excerpts, or revision summaries. EduPilot extracts key conceptual invariants, generates diagnostic practice quizzes, and grounds AI tutor dialogue directly in your syllabus.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Client & Server PDF Validation Active</span>
            </span>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-6 p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-brand-400 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <UploadCloud className="w-7 h-7" />
          </div>

          {isUploading ? (
            <div className="space-y-2">
              <p className="text-sm font-bold text-brand-600 dark:text-brand-400 animate-pulse">
                Parsing PDF & Extracting Conceptual Invariants...
              </p>
              <p className="text-xs text-slate-400">Dividing document into semantic sections</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Drag and drop your PDF course materials here, or <span className="text-brand-600 dark:text-brand-400 underline">browse files</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports lecture slides, chapters, notes (PDF format, up to 10MB)
              </p>
            </div>
          )}
        </div>

        {/* Upload Error Alert */}
        {uploadError && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Upload Error</p>
              <p className="mt-0.5">{uploadError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Materials Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Indexed Learning Materials ({materials.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any document to generate a customized quiz, review distilled flashcards, or consult the AI tutor
            </p>
          </div>
        </div>

        {materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {mat.fileName}
                        </h4>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{mat.pageCount || 1} pages</span>
                          <span>•</span>
                          <span>{formatFileSize(mat.fileSize)}</span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Indexed</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                      Ready
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {mat.summary}
                  </p>

                  {/* Extracted Concept Pills */}
                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>Extracted Invariants & Topics</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {mat.topics && mat.topics.slice(0, 4).map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => onAskTutorWithMaterial(mat)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Ask AI Tutor</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenStudyGuide(mat)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      Study Guide
                    </button>

                    <button
                      onClick={() => onStartQuizFromMaterial(mat)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center space-x-1.5 transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Generate Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">No materials uploaded yet</h4>
            <p className="text-xs text-slate-400 mt-1">Upload a PDF lecture slide deck or syllabus above to generate targeted questions and grounded tutor sessions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
