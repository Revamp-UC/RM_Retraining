'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, X, Copy, Check } from 'lucide-react';

const SUPPORT_EMAIL = 'vaibhavmishra.int@urbancompany.com';

export function HelpButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function copyEmail() {
    navigator.clipboard.writeText(SUPPORT_EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
      >
        Get help
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 z-50">
          {/* Arrow */}
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#1e1e2e] border-r border-b border-[#2a2a38]" />

          <div className="rounded-xl border border-[#2a2a38] bg-[#1e1e2e] shadow-2xl shadow-black/60 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#f1f1f5]">Contact Support</div>
                  <div className="text-[10px] text-[#60607a]">RM Excellence Programme</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#60607a] hover:text-[#9090a8] transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="bg-[#13131a] rounded-lg border border-[#2a2a38] px-3 py-2.5 flex items-center justify-between gap-2">
              <span className="text-xs text-[#9090a8] truncate select-all">{SUPPORT_EMAIL}</span>
              <button
                onClick={copyEmail}
                className="shrink-0 text-[#60607a] hover:text-indigo-400 transition-colors"
                title="Copy email"
              >
                {copied
                  ? <Check className="h-3.5 w-3.5 text-green-400" />
                  : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="text-[10px] text-[#60607a] mt-2.5 leading-relaxed">
              Having trouble logging in? Reach out and we&apos;ll reset your credentials.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
