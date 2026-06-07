'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import type { TranscriptEntry } from '@/types/transcript';

interface TranscriptViewerProps {
  consultationId: string;
}

export function TranscriptViewer({ consultationId }: TranscriptViewerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<TranscriptEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    if (open) { setOpen(false); return; }
    if (entries !== null) { setOpen(true); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/transcript/${consultationId}`);
      const json = await res.json() as { transcript?: { full_transcript: TranscriptEntry[] } | null };
      setEntries(json.transcript?.full_transcript ?? []);
      setOpen(true);
    } catch {
      setError('Failed to load transcript.');
    } finally {
      setLoading(false);
    }
  }

  // Merge consecutive same-speaker entries into one paragraph bubble
  function groupEntries(raw: TranscriptEntry[]) {
    const groups: { speaker: string; text: string; timestamp_ms: number }[] = [];
    for (const entry of raw) {
      const last = groups[groups.length - 1];
      if (last && last.speaker === entry.speaker) {
        last.text += ' ' + entry.text.trim();
      } else {
        groups.push({ speaker: entry.speaker, text: entry.text.trim(), timestamp_ms: entry.timestamp_ms });
      }
    }
    return groups;
  }

  function formatMs(ms: number) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  }

  const grouped = entries ? groupEntries(entries) : [];

  return (
    <div className="mt-3 border-t border-[#1e1e28] pt-3">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-xs font-medium text-[#9090a8] hover:text-indigo-400 transition-colors"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : open ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
        {loading ? 'Loading transcript…' : open ? 'Hide transcript' : 'View transcript'}
      </button>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      {open && entries !== null && (
        <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
          {grouped.length === 0 ? (
            <p className="text-xs text-[#60607a]">No transcript recorded for this session.</p>
          ) : (
            grouped.map((entry, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${entry.speaker === 'rm' ? '' : 'flex-row-reverse'}`}
              >
                <span
                  className={`shrink-0 rounded-full w-6 h-6 flex items-center justify-center text-[9px] font-bold mt-0.5 ${
                    entry.speaker === 'rm'
                      ? 'bg-indigo-600/20 text-indigo-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {entry.speaker === 'rm' ? 'RM' : 'C'}
                </span>
                <div className={`flex-1 max-w-[85%] ${entry.speaker !== 'rm' ? 'flex flex-col items-end' : ''}`}>
                  <div
                    className={`inline-block rounded-2xl px-3.5 py-2.5 text-sm text-[#d4d4e8] leading-relaxed ${
                      entry.speaker === 'rm'
                        ? 'bg-[#1a1a28] rounded-tl-none'
                        : 'bg-amber-500/10 border border-amber-500/15 rounded-tr-none'
                    }`}
                  >
                    {entry.text}
                  </div>
                  {entry.timestamp_ms !== undefined && (
                    <p className="mt-1 text-[10px] text-[#60607a] px-1">{formatMs(entry.timestamp_ms)}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
