'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, ChevronRight, RotateCcw,
  Lightbulb, Gem,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/lib/config/module5-task2-quiz';
import Link from 'next/link';

type Phase = 'intro' | 'question' | 'results';

interface TierInfo {
  label: string;
  color: string;
  ringColor: string;
  glow: string;
  message: string;
  emoji: string;
}

function getTier(score: number, total: number): TierInfo {
  const pct = score / total;
  if (pct >= 0.87) return {
    label: 'Excellent',
    color: 'text-emerald-400',
    ringColor: '#34d399',
    glow: 'rgba(52,211,153,0.18)',
    message: 'You are ready to pitch NIO with full confidence.',
    emoji: '🏆',
  };
  if (pct >= 0.67) return {
    label: 'Good',
    color: 'text-blue-400',
    ringColor: '#60a5fa',
    glow: 'rgba(96,165,250,0.18)',
    message: 'Strong foundation. Review the areas you missed.',
    emoji: '👍',
  };
  if (pct >= 0.47) return {
    label: 'Average',
    color: 'text-amber-400',
    ringColor: '#fbbf24',
    glow: 'rgba(251,191,36,0.18)',
    message: 'Review the NIO playbook before your next visit.',
    emoji: '📖',
  };
  return {
    label: 'Needs Improvement',
    color: 'text-red-400',
    ringColor: '#f87171',
    glow: 'rgba(248,113,113,0.18)',
    message: 'Study the NIO playbook thoroughly before pitching.',
    emoji: '💪',
  };
}

function useCountUp(target: number, active: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) { setCount(0); return; }
    const duration = 1200;
    let startTime: number | null = null;
    function step(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, active]);
  return count;
}

const TOPICS = ['Pricing Pitch', 'WPC vs NIO', 'Technical Specs', 'Objection Handling', 'Installation', 'Sales Strategy'];
const QUESTION_DURATION = 30;

export function QuizClient({ moduleId }: { moduleId: string }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);

  const questions = QUIZ_QUESTIONS;
  const total = questions.length;
  const question = questions[currentIndex];
  const finalScore = answers.filter((a, i) => a === questions[i].correctId).length;
  const countedScore = useCountUp(finalScore, phase === 'results');

  function handleSelect(optionId: string) {
    if (selectedId !== null) return;
    setSelectedId(optionId);
    if (optionId !== question.correctId) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  function handleNext() {
    const next = [...answers, selectedId!];
    setAnswers(next);
    setSelectedId(null);
    setShaking(false);
    if (currentIndex + 1 >= total) {
      setPhase('results');
    } else {
      setCurrentIndex(i => i + 1);
    }
  }

  const handleAutoSkip = useCallback(() => {
    const next = [...answers, ''];
    setAnswers(next);
    setSelectedId(null);
    setShaking(false);
    if (currentIndex + 1 >= total) {
      setPhase('results');
    } else {
      setCurrentIndex(i => i + 1);
    }
  }, [answers, currentIndex, total]);

  // Reset timer on new question or when quiz starts
  useEffect(() => {
    if (phase === 'question') setTimeLeft(QUESTION_DURATION);
  }, [currentIndex, phase]);

  // Countdown — pause when answered
  useEffect(() => {
    if (phase !== 'question' || selectedId !== null || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, selectedId, timeLeft]);

  // Auto-skip at 0
  useEffect(() => {
    if (phase === 'question' && selectedId === null && timeLeft === 0) {
      handleAutoSkip();
    }
  }, [timeLeft, phase, selectedId, handleAutoSkip]);

  function handleRetake() {
    setCurrentIndex(0);
    setSelectedId(null);
    setAnswers([]);
    setShaking(false);
    setTimeLeft(QUESTION_DURATION);
    setPhase('intro');
  }

  // ─── INTRO ──────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="flex items-center justify-center min-h-full py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-[#2a2a38] bg-[#13131a] overflow-hidden shadow-2xl shadow-black/50">
            {/* Hero band */}
            <div className="relative h-36 flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950/80 via-[#0e1e17] to-[#13131a]">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.18) 0%, transparent 70%)' }} />
              {/* Decorative rings */}
              <div className="absolute w-48 h-48 rounded-full border border-emerald-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute w-32 h-32 rounded-full border border-emerald-500/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl scale-150" />
                <div className="relative w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-900/40">
                  <Gem className="h-7 w-7 text-emerald-300" />
                </div>
              </motion.div>
            </div>

            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-6"
              >
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.15em] mb-2">Module 5 · Task 2</p>
                <h1 className="text-2xl font-bold text-[#f1f1f5] mb-2">NIO Product Quiz</h1>
                <p className="text-sm text-[#9090a8] leading-relaxed">
                  Pricing strategy, technical specs, objection handling — {total} questions, instant feedback.
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-2 mb-5"
              >
                {[
                  { value: String(total), label: 'Questions' },
                  { value: '4', label: 'Options Each' },
                  { value: '~8 min', label: 'Est. Time' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-[#1e1e28] bg-[#0f0f17] py-3 text-center">
                    <p className="text-sm font-bold text-[#f1f1f5]">{s.value}</p>
                    <p className="text-[10px] text-[#60607a] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Topic chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-1.5 mb-6"
              >
                {TOPICS.map(t => (
                  <span key={t} className="text-[10px] font-medium text-[#9090a8] bg-[#1c1c26] border border-[#2a2a38] rounded-full px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPhase('question')}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-4 shadow-lg shadow-emerald-900/40 transition-colors"
              >
                Start Quiz
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── RESULTS ────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const tier = getTier(finalScore, total);
    const accuracy = Math.round((finalScore / total) * 100);
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - accuracy / 100);
    const wrongIndices = questions.reduce<number[]>((acc, q, i) => {
      if (answers[i] !== q.correctId) acc.push(i);
      return acc;
    }, []);

    return (
      <div className="flex items-center justify-center min-h-full py-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg space-y-4"
        >
          {/* ── Score card ── */}
          <div className="rounded-2xl border border-[#2a2a38] bg-[#13131a] overflow-hidden shadow-2xl shadow-black/40">

            {/* Score hero */}
            <div
              className="relative flex flex-col items-center py-9 px-6 border-b border-[#1e1e28]"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${tier.glow} 0%, transparent 65%)` }}
            >
              {/* Ring */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative mb-5"
              >
                <svg width="136" height="136" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r={radius} fill="none" stroke="#1c1c26" strokeWidth="13" />
                  <motion.circle
                    cx="70" cy="70" r={radius}
                    fill="none"
                    stroke={tier.ringColor}
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.4, delay: 0.25, ease: 'easeOut' }}
                    transform="rotate(-90 70 70)"
                    style={{ filter: `drop-shadow(0 0 12px ${tier.ringColor}90)` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                  <span className="text-5xl font-black text-[#f1f1f5] leading-none tabular-nums">
                    {countedScore}
                  </span>
                  <span className="text-sm text-[#60607a] font-semibold">/ {total}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="text-3xl mb-2">{tier.emoji}</p>
                <p className={`text-2xl font-bold ${tier.color}`}>{tier.label}</p>
                <p className="text-sm text-[#9090a8] mt-1.5 max-w-xs leading-relaxed">{tier.message}</p>
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 divide-x divide-[#1e1e28]"
            >
              <div className="py-4 text-center">
                <p className="text-xl font-bold text-emerald-400">{finalScore}</p>
                <p className="text-[10px] text-[#60607a] mt-0.5 font-medium uppercase tracking-wider">Correct</p>
              </div>
              <div className="py-4 text-center">
                <p className="text-xl font-bold text-red-400">{total - finalScore}</p>
                <p className="text-[10px] text-[#60607a] mt-0.5 font-medium uppercase tracking-wider">Wrong</p>
              </div>
              <div className="py-4 text-center">
                <p className={`text-xl font-bold ${tier.color}`}>{accuracy}%</p>
                <p className="text-[10px] text-[#60607a] mt-0.5 font-medium uppercase tracking-wider">Accuracy</p>
              </div>
            </motion.div>
          </div>

          {/* ── Question breakdown ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="rounded-2xl border border-[#2a2a38] bg-[#13131a] p-5"
          >
            <p className="text-[10px] font-bold text-[#60607a] uppercase tracking-widest mb-4">Question Breakdown</p>
            <div className="flex gap-1.5 flex-wrap">
              {questions.map((q, i) => {
                const correct = answers[i] === q.correctId;
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.72 + i * 0.035, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-[calc(20%-5px)] aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 border text-[10px] font-bold select-none ${
                      correct
                        ? 'bg-emerald-500/12 border-emerald-500/35 text-emerald-400'
                        : 'bg-red-500/12 border-red-500/35 text-red-400'
                    }`}
                  >
                    <span className="text-[13px]">{correct ? '✓' : '✗'}</span>
                    <span className="opacity-60">{i + 1}</span>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-[#1e1e28]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-[#9090a8]">{finalScore} correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-xs text-[#9090a8]">{total - finalScore} missed</span>
              </div>
            </div>
          </motion.div>

          {/* ── Wrong answer review ── */}
          {wrongIndices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="rounded-2xl border border-[#2a2a38] bg-[#13131a] overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[#1e1e28] flex items-center gap-2.5">
                <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
                <p className="text-sm font-bold text-[#f1f1f5]">Review Missed Questions</p>
                <span className="ml-auto text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/25 rounded-full px-2.5 py-0.5">
                  {wrongIndices.length} missed
                </span>
              </div>

              <div className="divide-y divide-[#1e1e28]">
                {wrongIndices.map((qi) => {
                  const q = questions[qi];
                  const userOpt = q.options.find(o => o.id === answers[qi]);
                  const correctOpt = q.options.find(o => o.id === q.correctId);
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="px-5 py-5"
                    >
                      <p className="text-[10px] font-bold text-[#60607a] uppercase tracking-wider mb-2">Q{qi + 1}</p>
                      <p className="text-xs font-semibold text-[#c0c0d8] mb-3.5 leading-relaxed">{q.question}</p>

                      {userOpt && (
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="w-5 h-5 rounded-md bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <XCircle className="h-3 w-3 text-red-400" />
                          </div>
                          <p className="text-xs text-red-300/80 leading-relaxed">
                            <span className="font-semibold text-red-400">{userOpt.id}.</span>{' '}{userOpt.text}
                          </p>
                        </div>
                      )}
                      {correctOpt && (
                        <div className="flex items-start gap-2.5 mb-3.5">
                          <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          </div>
                          <p className="text-xs text-emerald-300/80 leading-relaxed">
                            <span className="font-semibold text-emerald-400">{correctOpt.id}.</span>{' '}{correctOpt.text}
                          </p>
                        </div>
                      )}

                      <div className="rounded-xl bg-[#0f0f17] border border-[#1e1e28] px-3.5 py-2.5">
                        <p className="text-[11px] text-[#9090a8] leading-relaxed">{q.explanation}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col gap-3 pb-8"
          >
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRetake}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-4 shadow-lg shadow-emerald-900/30 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </motion.button>
            <Link
              href={`/module/${moduleId}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#2a2a38] bg-[#13131a] hover:bg-[#1c1c26] active:scale-[0.98] transition-all text-[#f1f1f5] font-semibold text-sm py-4"
            >
              Back to Module
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ─── QUESTION ────────────────────────────────────────────────────────────
  const isAnswered = selectedId !== null;
  const isCorrect = selectedId === question.correctId;
  const timerR = 15;
  const timerCircumference = 2 * Math.PI * timerR;
  const timerDashOffset = timerCircumference * (1 - timeLeft / QUESTION_DURATION);
  const timerStroke = timeLeft <= 5 ? '#f87171' : timeLeft <= 10 ? '#fbbf24' : '#34d399';
  const timerTextColor = timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="flex items-start justify-center min-h-full py-6 px-4">
      <div className="w-full max-w-xl">

        {/* Segmented progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#60607a]">
              {currentIndex + 1} <span className="text-[#3a3a4a]">/ {total}</span>
            </span>
            <AnimatePresence mode="wait">
              {isAnswered ? (
                <motion.span
                  key="feedback"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    isCorrect
                      ? 'text-emerald-400 bg-emerald-500/12 border-emerald-500/30'
                      : 'text-red-400 bg-red-500/12 border-red-500/30'
                  }`}
                >
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </motion.span>
              ) : (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className={`relative flex items-center justify-center ${timeLeft <= 5 ? 'animate-pulse' : ''}`}
                  style={{ width: 44, height: 44 }}
                >
                  <svg width="44" height="44" viewBox="0 0 44 44" className="absolute inset-0">
                    <circle cx="22" cy="22" r={timerR} fill="none" stroke="#1c1c26" strokeWidth="3.5" />
                    <circle
                      cx="22" cy="22" r={timerR}
                      fill="none"
                      stroke={timerStroke}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray={timerCircumference}
                      strokeDashoffset={timerDashOffset}
                      transform="rotate(-90 22 22)"
                      style={{ transition: 'stroke-dashoffset 0.85s linear, stroke 0.3s ease' }}
                    />
                  </svg>
                  <span className={`relative z-10 text-[11px] font-mono font-black tabular-nums ${timerTextColor}`}>
                    {timeLeft}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-1">
            {questions.map((_, i) => (
              <motion.div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${
                  i < currentIndex
                    ? answers[i] === questions[i].correctId
                      ? 'bg-emerald-500'
                      : 'bg-red-500/60'
                    : i === currentIndex
                      ? 'bg-emerald-500/40'
                      : 'bg-[#1c1c26]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question + options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* Question card */}
            <div className="rounded-2xl border border-[#2a2a38] bg-[#13131a] p-5 mb-4 shadow-xl shadow-black/30">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">
                Question {currentIndex + 1}
              </p>
              <p className="text-[15px] font-semibold text-[#f1f1f5] leading-relaxed">
                {question.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-4">
              {question.options.map((option) => {
                const isSelected = option.id === selectedId;
                const isThisCorrect = option.id === question.correctId;
                const isWrongPick = isAnswered && isSelected && !isThisCorrect;
                const isDimmed = isAnswered && !isSelected && !isThisCorrect;

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    disabled={isAnswered}
                    whileTap={!isAnswered ? { scale: 0.985 } : {}}
                    animate={isWrongPick && shaking ? { x: [0, -9, 9, -9, 9, -4, 4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`w-full text-left rounded-xl px-4 py-4 flex items-center gap-3.5 transition-all duration-200 ${
                      isAnswered
                        ? isThisCorrect
                          ? 'border border-emerald-500/60 bg-emerald-500/10 text-emerald-100 cursor-default'
                          : isSelected
                            ? 'border border-red-500/60 bg-red-500/10 text-red-200 cursor-default'
                            : 'border border-[#1e1e28] bg-[#0f0f17] text-[#60607a] opacity-30 cursor-default'
                        : 'border border-[#1e1e28] bg-[#0f0f17] text-[#c0c0d8] hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-[#f1f1f5] cursor-pointer'
                    } ${isDimmed ? 'opacity-30' : ''}`}
                  >
                    {/* Letter badge */}
                    <span className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      isAnswered && isThisCorrect
                        ? 'bg-emerald-500/30 text-emerald-300'
                        : isAnswered && isSelected
                          ? 'bg-red-500/30 text-red-300'
                          : 'bg-[#1c1c26] text-[#9090a8]'
                    }`}>
                      {option.id}
                    </span>

                    <span className="text-sm leading-relaxed flex-1">{option.text}</span>

                    {/* Result icon */}
                    {isAnswered && isThisCorrect && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      </motion.div>
                    )}
                    {isAnswered && isSelected && !isThisCorrect && (
                      <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`rounded-xl overflow-hidden mb-4 border ${
                    isCorrect
                      ? 'border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 to-transparent'
                      : 'border-amber-500/25 bg-gradient-to-br from-amber-500/8 to-transparent'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className={`h-3.5 w-3.5 shrink-0 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`} />
                      <p className={`text-xs font-bold ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isCorrect ? "That's right!" : "Here's what to know"}
                      </p>
                    </div>
                    <p className="text-xs text-[#b8b8d0] leading-relaxed">{question.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            <AnimatePresence>
              {isAnswered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.08 }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-4 shadow-lg shadow-emerald-900/30 transition-colors"
                >
                  {currentIndex + 1 >= total ? 'See Results' : 'Next Question'}
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
