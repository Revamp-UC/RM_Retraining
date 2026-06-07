export function formatScore(score: number | null): string {
  if (score === null || score === undefined) return '—';
  return score.toFixed(1);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function getPerformanceTier(score: number): 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' {
  if (score >= 42) return 'Excellent';
  if (score >= 32) return 'Good';
  if (score >= 20) return 'Average';
  return 'Needs Improvement';
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'Excellent': return 'text-emerald-400';
    case 'Good': return 'text-blue-400';
    case 'Average': return 'text-amber-400';
    case 'Needs Improvement': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

export function getScorePercent(score: number, max: number): number {
  return Math.round((score / max) * 100);
}
