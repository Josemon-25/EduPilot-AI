import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Trophy,
  Award,
  ChevronRight,
  Bot,
  TrendingUp,
  Zap,
  Target,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ApiService } from '../../services/api';

export default function QuizRunner({ quiz, onFinish, onConsultTutor, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [serverResults, setServerResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Misconception Coach state
  const [misconceptions, setMisconceptions] = useState({}); // mapped by question.id
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [followUpResults, setFollowUpResults] = useState({});
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const hasSelected = selectedAnswers[currentQ.id] !== undefined;
  const isSubmitted = submittedQuestions[currentQ.id] === true;

  const handleSelectOption = (optIndex) => {
    if (isSubmitted) return; // Locked once submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  const handleSubmitAnswer = async () => {
    if (!hasSelected) return;
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: true
    }));

    const chosenIdx = selectedAnswers[currentQ.id];
    const isCorrect = chosenIdx === currentQ.correctAnswer;

    // Trigger Misconception Coach on incorrect answer
    if (!isCorrect) {
      setIsDiagnosing(true);
      try {
        const diagnosis = await ApiService.diagnoseMisconception({
          question: currentQ,
          selectedOptionIndex: chosenIdx,
          materialId: quiz.materialId || null,
          quizId: quiz.id
        });
        setMisconceptions((prev) => ({
          ...prev,
          [currentQ.id]: diagnosis
        }));
      } catch (err) {
        console.warn('Misconception diagnosis error:', err);
      } finally {
        setIsDiagnosing(false);
      }
    }
  };

  const handleFollowUpSelect = (optIndex) => {
    if (followUpResults[currentQ.id]) return; // already evaluated
    setFollowUpAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  const handleFollowUpSubmit = async () => {
    const currentDiagnosis = misconceptions[currentQ.id];
    if (!currentDiagnosis?.followUpQuestion) return;
    const selectedFollowUpOpt = followUpAnswers[currentQ.id];
    if (selectedFollowUpOpt === undefined) return;

    setIsSubmittingFollowUp(true);
    try {
      const result = await ApiService.submitFollowUp({
        followUpQuestionId: currentDiagnosis.followUpQuestion.id,
        submittedAnswer: selectedFollowUpOpt,
        originalQuestionId: currentQ.id,
        topic: currentDiagnosis.topic || currentQ.topic,
        quizId: quiz.id
      });
      setFollowUpResults((prev) => ({
        ...prev,
        [currentQ.id]: result
      }));
    } catch (err) {
      console.warn('Error submitting follow-up:', err);
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  const handleNext = async () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Final submission to API
      setIsSubmitting(true);
      try {
        const timeSpent = 600 - timeLeft;
        const results = await ApiService.submitQuiz(quiz.id, selectedAnswers, timeSpent);
        setServerResults(results);
      } catch (err) {
        console.warn('Submission error, calculated locally:', err);
      } finally {
        setIsSubmitting(false);
        setIsCompleted(true);
        if (onFinish) onFinish();
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Score calculation
  const calculateResults = () => {
    if (serverResults) {
      return {
        correctCount: serverResults.correctCount,
        totalQuestions: serverResults.totalQuestions,
        percentage: serverResults.percentage,
        timeSpent: formatTime(600 - timeLeft),
        beforeAfterComparison: serverResults.beforeAfterComparison
      };
    }
    const correctCount = quiz.questions.reduce((acc, q) => {
      return selectedAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
    }, 0);
    return {
      correctCount,
      totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
      timeSpent: formatTime(600 - timeLeft),
      beforeAfterComparison: null
    };
  };

  // Completed State View
  if (isCompleted) {
    const results = calculateResults();
    const isPassing = results.percentage >= 70;
    const comparison = results.beforeAfterComparison;

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl max-w-3xl mx-auto animate-in zoom-in-95 duration-200">
        {/* Header Icon */}
        <div className="text-center">
          <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-4 ${
            isPassing
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/20'
              : 'bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-amber-500/20'
          }`}>
            {isPassing ? <Trophy className="w-10 h-10" /> : <Award className="w-10 h-10" />}
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Assessment Completed
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {isPassing ? 'Concept Mastery Validated!' : 'Diagnostic Review Required'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {quiz.title} • {quiz.subject}
          </p>

          {/* Big score meter */}
          <div className="mt-6 flex items-baseline justify-center space-x-2">
            <span className="text-5xl font-extrabold text-slate-900 dark:text-white font-mono">
              {results.percentage}%
            </span>
            <span className="text-xs font-semibold text-slate-400">
              ({results.correctCount}/{results.totalQuestions} Questions Correct)
            </span>
          </div>

          {/* Pre vs Post Comparison Banner */}
          {comparison ? (
            <div className="mt-5 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 max-w-md mx-auto text-center">
              <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-brand-700 dark:text-brand-300">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span>Adaptive Telemetry: Pre vs Post Learning Gain</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Prior Attempt: <strong className="text-rose-500">{comparison.preScore}%</strong> → Current Attempt: <strong className="text-emerald-500">{comparison.postScore}%</strong>
              </p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {comparison.delta >= 0 ? `+${comparison.delta}% Knowledge Gain Measured` : `${comparison.delta}% Score Change`}
              </p>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center space-x-1.5">
              <Target className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Initial Diagnostic Baseline recorded at <strong>{results.percentage}%</strong>. Retake anytime to measure your learning curve!</span>
            </div>
          )}

          {/* Performance Pill */}
          <div className="mt-4 inline-flex items-center space-x-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            {isPassing ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Concept Mastery Validated • Spaced Repetition Updated (+80 XP)
                </span>
              </>
            ) : (
              <>
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Targeted Revision Recommended • Review Explanations Below
                </span>
              </>
            )}
          </div>
        </div>

        {/* Breakdown by question */}
        <div className="mt-8 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Question Review Breakdown
          </h4>

          {quiz.questions.map((q, idx) => {
            const userAns = selectedAnswers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isCorrect
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 border">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {q.keyConcept || q.topic}
                    </span>
                    {q.pageReference && (
                      <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono">
                        ({q.pageReference})
                      </span>
                    )}
                  </div>
                  {isCorrect ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1">
                      <XCircle className="w-4 h-4" />
                      <span>Review Needed</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-2">
                  {q.question}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">AI Explanation: </span>
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              setSelectedAnswers({});
              setSubmittedQuestions({});
              setMisconceptions({});
              setFollowUpAnswers({});
              setFollowUpResults({});
              setIsCompleted(false);
              setServerResults(null);
              setCurrentIndex(0);
              setTimeLeft(600);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Practice Set</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => onConsultTutor(quiz.title)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 hover:bg-indigo-100 flex items-center justify-center space-x-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>Discuss with AI Tutor</span>
            </button>

            <button
              onClick={onExit}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 flex items-center justify-center"
            >
              Done & Return
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active quiz Question View
  const isCorrect = selectedAnswers[currentQ.id] === currentQ.correctAnswer;
  const currentMisconception = misconceptions[currentQ.id];
  const followUpAns = followUpAnswers[currentQ.id];
  const followUpResult = followUpResults[currentQ.id];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl max-w-3xl mx-auto">
      {/* Top quiz status header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
            {quiz.subject}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
            {quiz.title}
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 mb-2">
        <span>Question {currentIndex + 1} of {totalQuestions}</span>
        <span>
          Key Concept:{' '}
          <strong className="text-slate-700 dark:text-slate-300">
            {currentQ.keyConcept || currentQ.topic}
          </strong>
        </span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
        <div
          className="bg-brand-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question prompt */}
      <div className="mb-6">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentQ.question}
        </h4>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {currentQ.options.map((option, optIdx) => {
          const isSelected = selectedAnswers[currentQ.id] === optIdx;
          const isOptionCorrect = optIdx === currentQ.correctAnswer;

          let optionStyle = 'border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800/70 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

          if (isSubmitted) {
            if (isOptionCorrect) {
              optionStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
            } else if (isSelected && !isOptionCorrect) {
              optionStyle = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30';
            } else {
              optionStyle = 'border-slate-200/50 dark:border-slate-800 opacity-50';
            }
          } else if (isSelected) {
            optionStyle = 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/30';
          }

          return (
            <div
              key={optIdx}
              onClick={() => handleSelectOption(optIdx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 text-xs sm:text-sm font-medium ${optionStyle}`}
            >
              <span className={`w-6 h-6 rounded-lg font-bold font-mono text-xs flex items-center justify-center shrink-0 border ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
              }`}>
                {String.fromCharCode(65 + optIdx)}
              </span>

              <span className="flex-1 leading-relaxed">{option}</span>

              {isSubmitted && isOptionCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              )}
              {isSubmitted && isSelected && !isOptionCorrect && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Immediate Feedback Section */}
      {isSubmitted && (
        <>
          {/* Case A: Correct Answer */}
          {isCorrect && (
            <div className="mt-5 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Concept Invariant Verified</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Case B: Misconception Coach Card on Incorrect Answer */}
          {!isCorrect && (
            <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-amber-50/60 dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 dark:border-amber-800/40">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Misconception Coach — Pedagogical Analysis
                    </h5>
                    <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                      Focus Invariant: {currentQ.keyConcept || currentQ.topic}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                  Adaptive Coaching
                </span>
              </div>

              {isDiagnosing ? (
                <div className="py-6 text-center text-xs text-amber-700 dark:text-amber-300 animate-pulse">
                  Analyzing error patterns & retrieving document invariants...
                </div>
              ) : currentMisconception ? (
                <div className="mt-3.5 space-y-3">
                  {/* Hypothesis */}
                  <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-200/60 dark:border-amber-700/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-amber-800 dark:text-amber-400">Diagnosis: </span>
                    {currentMisconception.misconceptionHypothesis}
                  </div>

                  {/* Why Incorrect vs Why Correct */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-rose-900 dark:text-rose-200">
                      <span className="font-bold block mb-1">Why Selected Choice Is Incorrect:</span>
                      <p className="leading-relaxed">{currentMisconception.whyIncorrect}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200">
                      <span className="font-bold block mb-1">Why Correct Invariant Holds:</span>
                      <p className="leading-relaxed">{currentMisconception.whyCorrect}</p>
                    </div>
                  </div>

                  {/* Grounded Citation */}
                  {currentMisconception.isGrounded && currentMisconception.sourceCitation && (
                    <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-xs text-indigo-900 dark:text-indigo-200">
                      <div className="flex items-center space-x-1.5 font-bold mb-1">
                        <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Source-Grounded Citation: {currentMisconception.sourceCitation}</span>
                      </div>
                      {currentMisconception.sourceExcerpt && (
                        <blockquote className="pl-3 border-l-2 border-indigo-400 italic text-[11px] text-slate-600 dark:text-slate-400">
                          "{currentMisconception.sourceExcerpt}"
                        </blockquote>
                      )}
                    </div>
                  )}

                  {/* Targeted Follow-Up Probe */}
                  {currentMisconception.followUpQuestion && (
                    <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-800/40">
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-indigo-200/80 dark:border-indigo-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Targeted Follow-Up Invariant Probe
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            Immediate Retest
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-3">
                          {currentMisconception.followUpQuestion.question}
                        </p>

                        <div className="space-y-2">
                          {currentMisconception.followUpQuestion.options.map((fOpt, fIdx) => {
                            const isFSelected = followUpAns === fIdx;
                            const isFEvaluated = Boolean(followUpResult);
                            const isFCorrect = fIdx === currentMisconception.followUpQuestion.correctAnswer;

                            let fStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400';
                            if (isFEvaluated) {
                              if (isFCorrect) {
                                fStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
                              } else if (isFSelected && !isFCorrect) {
                                fStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30';
                              } else {
                                fStyle = 'border-slate-200/50 dark:border-slate-800 opacity-50';
                              }
                            } else if (isFSelected) {
                              fStyle = 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/30';
                            }

                            return (
                              <div
                                key={fIdx}
                                onClick={() => handleFollowUpSelect(fIdx)}
                                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${fStyle}`}
                              >
                                <div className="flex items-center space-x-2.5">
                                  <span className="w-5 h-5 rounded font-mono font-bold text-[10px] flex items-center justify-center bg-slate-200 dark:bg-slate-700 shrink-0">
                                    {String.fromCharCode(65 + fIdx)}
                                  </span>
                                  <span>{fOpt}</span>
                                </div>
                                {isFEvaluated && isFCorrect && (
                                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {!followUpResult ? (
                          <button
                            disabled={followUpAns === undefined || isSubmittingFollowUp}
                            onClick={handleFollowUpSubmit}
                            className="mt-3 w-full py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors"
                          >
                            {isSubmittingFollowUp ? 'Scoring on Server...' : 'Validate Follow-Up Answer'}
                          </button>
                        ) : (
                          <div className={`mt-3 p-3 rounded-xl text-xs font-medium ${
                            followUpResult.isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200'
                              : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200'
                          }`}>
                            <p className="font-bold">{followUpResult.feedbackMessage}</p>
                            <p className="mt-1 text-[11px] opacity-90">{followUpResult.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </>
      )}

      {/* Navigation Controls */}
      <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          disabled={currentIndex === 0}
          onClick={handlePrevious}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-3">
          {!isSubmitted ? (
            <button
              disabled={!hasSelected}
              onClick={handleSubmitAnswer}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-brand-500/20 transition-all"
            >
              Validate Answer
            </button>
          ) : (
            <button
              disabled={isSubmitting}
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
            >
              <span>{isSubmitting ? 'Evaluating...' : currentIndex === totalQuestions - 1 ? 'View Final Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
