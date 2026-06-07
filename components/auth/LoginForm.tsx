'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Lock, AlertCircle, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            disabled={isPending}
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
            disabled={isPending}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-1"
        disabled={isPending || mobile.length !== 10 || password.length !== 4}
      >
        {isPending
          ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
          : 'Sign In'}
      </button>
    </form>
  );
}
