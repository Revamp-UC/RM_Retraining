import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-[#2a2a38] mb-4">404</p>
        <h1 className="text-xl font-semibold text-[#f1f1f5] mb-2">Page not found</h1>
        <p className="text-sm text-[#9090a8] mb-6">The page you are looking for does not exist.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-5 py-2.5 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
