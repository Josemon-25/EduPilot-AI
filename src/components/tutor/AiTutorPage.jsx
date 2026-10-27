import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Lightbulb,
  Copy,
  Check,
  Code2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { ApiService } from '../../services/api';

export default function AiTutorPage({
  initialPrompt,
  onConsumePrompt,
  onStartQuiz,
  selectedMaterial,
  materials = []
}) {
  const [selectedDocId, setSelectedDocId] = useState(
    selectedMaterial ? selectedMaterial.id : (materials[0]?.id || 'mat-demo-1')
  );

  const [expandedExcerptIds, setExpandedExcerptIds] = useState(new Set());

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello Alex! I'm your **EduPilot CS Mentor**. I track your curriculum progress across Data Structures, Algorithms, DBMS, and Operating Systems.

You can select an uploaded course document above to ask **source-grounded questions** with verified page citations, or ask any general Computer Science theory question!`,
      time: 'Just now',
      generationType: 'demo-explanation',
      groundingType: 'general-knowledge',
      isGrounded: false,
      sourceCitation: null,
      sourceExcerpt: null
    }
  ]);

  const [inputVal, setInputVal] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const lastProcessedPromptRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (selectedMaterial) {
      setSelectedDocId(selectedMaterial.id);
    }
  }, [selectedMaterial]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      const trimmed = initialPrompt.trim();
      if (lastProcessedPromptRef.current !== trimmed) {
        lastProcessedPromptRef.current = trimmed;
        handleSendMessage(trimmed);
        if (typeof onConsumePrompt === 'function') {
          onConsumePrompt();
        }
      }
    }
  }, [initialPrompt]);

  const toggleExcerpt = (id) => {
    setExpandedExcerptIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const suggestedPrompts = [
    { label: 'Dijkstra Negative Edges', query: 'Why does Dijkstra fail on negative edges?' },
    { label: 'Why B+ Trees in Databases?', query: 'Why do databases use B+ Trees instead of Binary Search Trees?' },
    { label: 'Virtual Memory & Page Faults', query: 'Walk me through how virtual memory translates addresses and handles page faults' },
    { label: 'Dynamic Programming 0/1 Knapsack', query: 'Show me the recurrence and space optimization for 0/1 knapsack' }
  ];

  const handleSendMessage = async (textToSend, overrideDocId) => {
    if (isTyping) return; // Guard against concurrent or duplicate requests
    const query = (textToSend !== undefined ? textToSend : inputVal).trim();
    if (!query) return;

    const currentDocId = overrideDocId !== undefined ? overrideDocId : selectedDocId;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await ApiService.sendTutorMessage({
        query,
        materialId: currentDocId === 'general' ? null : currentDocId,
        history: messages.slice(-4)
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        queryText: query,
        generationType: response.generationType || 'demo-explanation',
        groundingType: response.groundingType || (response.isGrounded ? 'source-grounded' : 'general-knowledge'),
        isGrounded: Boolean(response.isGrounded),
        sourceCitation: response.sourceCitation || null,
        sourceExcerpt: response.sourceExcerpt || null,
        pageNumber: response.pageNumber || null,
        documentName: response.documentName || null,
        canFallbackToGeneral: Boolean(response.canFallbackToGeneral),
        time: 'Just now'
      };

      // Automatically expand excerpt on fresh response if available
      if (aiMsg.sourceExcerpt) {
        setExpandedExcerptIds((prev) => new Set(prev).add(aiMsg.id));
      }

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `I encountered an issue processing your inquiry: ${err.message}. Please check your connection and try again.`,
          time: 'Just now',
          generationType: 'demo-explanation',
          groundingType: 'general-knowledge',
          isGrounded: false
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFallbackGeneral = (queryText) => {
    if (isTyping) return;
    setSelectedDocId('general');
    handleSendMessage(queryText, 'general');
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'm1',
        sender: 'ai',
        text: `Chat cleared. Ready for your next inquiry, Alex! Select a document above for grounded citations or ask any general CS theory question.`,
        time: 'Just now',
        generationType: 'demo-explanation',
        groundingType: 'general-knowledge',
        isGrounded: false,
        sourceCitation: null,
        sourceExcerpt: null
      }
    ]);
    setExpandedExcerptIds(new Set());
  };

  const activeDoc = materials.find((m) => m.id === selectedDocId);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[600px] animate-in fade-in duration-200">
      {/* Header with Document Context Selector */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                EduPilot AI Tutor
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                Verified Grounding
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Zero hallucinated citations • Authentic document page verification
            </p>
          </div>
        </div>

        {/* Document Context Selector */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="text-xs bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer max-w-[220px] sm:max-w-[260px] truncate"
              aria-label="Select source document for grounding"
            >
              <option value="general">🌐 General CS Knowledge (No doc)</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  📄 {m.fileName} ({m.pageCount || '?'}p)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={clearChat}
            className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center space-x-1 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips Bar */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Suggestions:</span>
        </span>
        {suggestedPrompts.map((s, idx) => (
          <button
            key={idx}
            disabled={isTyping}
            onClick={() => handleSendMessage(s.query)}
            className="px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700 transition-colors disabled:opacity-50"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-2xl min-w-0 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white font-medium shadow-md shadow-brand-500/10'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                }`}
              >
                {/* AI Status Badges (Generation mode & Grounding status) */}
                {msg.sender === 'ai' && (
                  <div className="mb-3 flex flex-wrap items-center gap-2 pb-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
                    {/* Generation Type Badge */}
                    {msg.generationType === 'ai-generated' ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                        <span>AI-Generated (Live LLM)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                        <Cpu className="w-2.5 h-2.5 text-indigo-500" />
                        <span>Demo Explanation</span>
                      </span>
                    )}

                    {/* Grounding Status Badge */}
                    {msg.groundingType === 'source-grounded' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Source-Grounded • Page {msg.pageNumber || 1}</span>
                      </span>
                    )}

                    {msg.groundingType === 'insufficient-evidence' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                        <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                        <span>Insufficient Document Evidence</span>
                      </span>
                    )}

                    {msg.groundingType === 'general-knowledge' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                        <BookOpen className="w-2.5 h-2.5 text-slate-500" />
                        <span>General Knowledge</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body Content */}
                <div className="prose dark:prose-invert max-w-none space-y-3 whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Expandable Verified Source Excerpt */}
                {msg.sender === 'ai' && msg.sourceCitation && msg.sourceExcerpt && (
                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => toggleExcerpt(msg.id)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/50 text-left transition-colors text-xs text-emerald-900 dark:text-emerald-200"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-semibold truncate">
                          Verified Citation: {msg.sourceCitation}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center space-x-1 shrink-0 ml-2">
                        <span>{expandedExcerptIds.has(msg.id) ? 'Hide excerpt' : 'View excerpt'}</span>
                        {expandedExcerptIds.has(msg.id) ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </button>

                    {expandedExcerptIds.has(msg.id) && (
                      <div className="mt-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm animate-in fade-in duration-150 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300">
                          <span className="flex items-center space-x-1 font-semibold">
                            <FileText className="w-3 h-3 text-emerald-500" />
                            <span>Verbatim Document Text</span>
                          </span>
                          <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md text-emerald-800 dark:text-emerald-200">
                            Page {msg.pageNumber || 1}
                          </span>
                        </div>
                        <blockquote className="border-l-2 border-emerald-500 pl-3 italic text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-sans">
                          "{msg.sourceExcerpt}"
                        </blockquote>
                        <div className="text-[10px] text-slate-400 pt-1 flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Strictly retrieved from uploaded document • Zero fabricated citations</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Insufficient Evidence Fallback Action */}
                {msg.sender === 'ai' && msg.groundingType === 'insufficient-evidence' && (
                  <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] text-amber-800 dark:text-amber-300">
                      Want an unverified standard Computer Science explanation?
                    </span>
                    <button
                      disabled={isTyping}
                      onClick={() => handleFallbackGeneral(msg.queryText || inputVal)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white shadow-sm transition-colors flex items-center justify-center space-x-1 shrink-0"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Ask in General Knowledge Mode</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Message metadata & actions */}
              <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400 px-1">
                <span>{msg.time}</span>
                {msg.sender === 'ai' && (
                  <>
                    <span>•</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center space-x-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-2 text-xs text-slate-500">
              <span className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span>EduPilot AI is verifying citations against uploaded text...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isTyping && inputVal.trim()) {
              handleSendMessage();
            }
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={
                selectedDocId === 'general'
                  ? 'Ask any general Computer Science theory or coding question...'
                  : `Ask a question grounded in ${activeDoc ? activeDoc.fileName : 'selected document'}...`
              }
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full px-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all pr-10"
            />
          </div>

          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="p-3 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-brand-500/20 transition-all flex items-center justify-center shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
