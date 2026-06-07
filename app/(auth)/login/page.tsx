import type { Metadata } from 'next';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { HelpButton } from '@/components/auth/HelpButton';
import { AnimatedLoginContent, AnimatedItem, AnimatedFade } from '@/components/auth/AnimatedLoginContent';

export const metadata: Metadata = {
  title: 'RM Retraining | Urban Company',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0a0a0f]">

      {/* Background gradients */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 -left-60 h-[500px] w-[500px] rounded-full bg-indigo-800/35 blur-3xl" />
        <div className="absolute -bottom-60 -right-60 h-[500px] w-[500px] rounded-full bg-purple-800/35 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-900/20 blur-3xl" />
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <AnimatedLoginContent>

          {/* Logo */}
          <AnimatedItem className="flex justify-center mb-6">
            <div
              className="relative bg-white rounded-2xl shadow-lg shadow-black/30 overflow-hidden"
              style={{ width: 220, height: 80 }}
            >
              <Image
                src="/images/urban-company-logo.png"
                alt="Urban Company"
                fill
                className="object-cover object-center scale-[1.08]"
                priority
              />
            </div>
          </AnimatedItem>

          {/* Title */}
          <AnimatedItem delay={0.1} className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-[#f1f1f5] tracking-tight">RM Retraining</h1>
            <p className="text-sm text-[#9090a8] mt-2 leading-relaxed max-w-xs mx-auto">
              Practice real-world customer consultations with an AI-powered simulated customer. Get scored, get better.
            </p>
          </AnimatedItem>

          {/* Login form card */}
          <AnimatedItem delay={0.2} className="rounded-2xl border border-[#2a2a38] bg-[#13131a] p-6 shadow-2xl shadow-black/40">
            <LoginForm />
          </AnimatedItem>

          {/* Secure indicator */}
          <AnimatedFade delay={0.35} className="flex items-center justify-center gap-1.5 mt-4">
            <Lock className="h-3 w-3 text-[#60607a]" />
            <p className="text-xs text-[#60607a]">Secure, encrypted login</p>
          </AnimatedFade>

          {/* Help text */}
          <AnimatedFade delay={0.4} className="text-center text-xs text-[#60607a] mt-2">
            Trouble signing in? <HelpButton />
          </AnimatedFade>

        </AnimatedLoginContent>
      </div>

      {/* Page footer */}
      <footer className="relative border-t border-[#1a1a24] py-4 px-6">
        <div className="flex items-center justify-center gap-3 text-[11px] text-[#60607a]">
          <span>© {new Date().getFullYear()} Urban Company. All rights reserved.</span>
          <span className="text-[#2a2a38]">|</span>
          <span>Revamp by <span className="text-[#9090a8] font-medium">Urban Company</span></span>
        </div>
      </footer>

    </main>
  );
}
