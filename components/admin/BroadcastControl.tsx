'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Send, X } from 'lucide-react';

export function BroadcastControl() {
  const [text, setText] = useState('');
  const [activeMessage, setActiveMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/system-message')
      .then(r => r.json())
      .then((d: { message?: string }) => {
        const msg = d.message ?? '';
        if (msg) {
          setText(msg);
          setActiveMessage(msg);
        }
      })
      .catch(() => {});
  }, []);

  async function send() {
    if (!text.trim()) return;
    setStatus('sending');
    const res = await fetch('/api/admin/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text.trim() }),
    });
    if (res.ok) {
      setActiveMessage(text.trim());
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  async function clear() {
    setStatus('sending');
    const res = await fetch('/api/admin/broadcast', { method: 'DELETE' });
    if (res.ok) {
      setText('');
      setActiveMessage('');
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28]">
        <Megaphone className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-bold text-[#f1f1f5]">Broadcast Message</h2>
        {activeMessage && (
          <span className="ml-auto text-[10px] font-semibold text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 uppercase tracking-wide">
            Active
          </span>
        )}
      </div>

      <div className="px-5 py-4 space-y-3">
        {activeMessage && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
            <p className="text-[10px] font-semibold text-amber-400/70 uppercase tracking-wide mb-1">
              Currently showing to all RMs
            </p>
            <p className="text-sm text-amber-200">{activeMessage}</p>
          </div>
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message to show on all RM screens..."
          rows={2}
          className="w-full resize-none rounded-lg bg-[#0f0f16] border border-[#2a2a38] px-3 py-2.5 text-sm text-[#f1f1f5] placeholder:text-[#60607a] focus:outline-none focus:border-amber-500/50 transition-colors"
        />

        <div className="flex gap-2">
          <button
            onClick={send}
            disabled={!text.trim() || status === 'sending'}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50 px-3.5 py-2 text-sm font-semibold text-amber-300 hover:text-amber-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : status === 'error' ? 'Error' : 'Broadcast'}
          </button>

          {activeMessage && (
            <button
              onClick={clear}
              disabled={status === 'sending'}
              className="flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 hover:border-red-500/40 px-3.5 py-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
