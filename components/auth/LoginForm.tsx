'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const WALL_INSIGHTS = [
  "Transform your wall, transform your room.",
  "Luxury begins with the wall you look at every day.",
  "A beautiful wall creates a beautiful space.",
  "Give your home a designer touch — without major renovation.",
  "From plain walls to statement walls.",
  "Every great room starts with one great wall.",
  "The wall you choose reflects the home you envision.",
];

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % WALL_INSIGHTS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPending]);

  function validate(): boolean {
    if (!/^\d{10}$/.test(mobile.trim())) {
      setError('Enter a valid 10-digit mobile number');
      return false;
    }
    if (!/^\d{4}$/.test(password.trim())) {
      setError('Enter your 4-digit password');
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    startTransition(async () => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile_number: mobile.trim(), password: password.trim() }),
        });
        const data = await res.json() as { error?: string };
        if (!res.ok) {
          setError(data.error ?? 'Login failed. Please try again.');
          return;
        }
        router.push('/dashboard');
        router.refresh();
      } catch {
        setError('Network error. Please check your connection.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AnimatePresence mode="wait">

        {isPending ? (

          /* ── Loading state: rotating wall insights ── */
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center py-10 px-2"
          >
            {/* Glow icon */}
            <div className="mb-5 w-11 h-11 rounded-full bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>

            {/* Label */}
            <p className="text-[10px] font-bold text-indigo-400/60 uppercase tracking-[0.18em] mb-5">
              Wall Design Insight
            </p>

            {/* Rotating quote */}
            <div className="min-h-[72px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="text-center text-[#e8e8f0] text-[15px] font-semibold leading-relaxed max-w-[260px]"
                >
                  &ldquo;{WALL_INSIGHTS[quoteIndex]}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mt-6 mb-5">
              {WALL_INSIGHTS.map((_, i) => (
                <motion.span
                  key={i}
                  animate={{
                    width: i === quoteIndex ? 16 : 4,
                    backgroundColor: i === quoteIndex ? '#818cf8' : '#2a2a38',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-1 rounded-full block"
                />
              ))}
            </div>

            {/* Signing in status */}
            <div className="flex items-center gap-2 text-xs text-[#60607a]">
              <Loader2 className="h-3 w-3 animate-spin" />
              Signing you in…
            </div>
          </motion.div>

        ) : (

          /* ── Normal form state ── */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3"
              >
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#9090a8] uppercase tracking-wider" htmlFor="mobile">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#60607a] pointer-events-none" />
                <input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '')); setError(''); }}
                  autoComplete="tel"
                  className="flex h-11 w-full rounded-lg border border-[#2a2a38] bg-[#0d0d14] pl-10 pr-4 py-2 text-sm text-[#f1f1f5] placeholder:text-[#60607a] transition-colors focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/15"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#9090a8] uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#60607a] pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="4-digit password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value.replace(/\D/g, '')); setError(''); }}
                  autoComplete="current-password"
                  className="flex h-11 w-full rounded-lg border border-[#2a2a38] bg-[#0d0d14] pl-10 pr-4 py-2 text-sm text-[#f1f1f5] placeholder:text-[#60607a] transition-colors focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/15"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-1"
              disabled={mobile.length !== 10 || password.length !== 4}
            >
              Sign In
            </button>
          </motion.div>

        )}
      </AnimatePresence>
    </form>
  );
}
