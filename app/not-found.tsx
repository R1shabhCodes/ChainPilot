import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-slate-100 p-6 text-center">
      <div className="max-w-md w-full glass-panel rounded-2xl p-8 flex flex-col items-center gap-4">
        <div className="text-4xl font-extrabold text-cyan-400">404</div>
        <h2 className="text-xl font-bold text-slate-100">Page Not Found</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested page or route does not exist. Return to the main dashboard to continue using ChainPilot.
        </p>

        <Link
          href="/"
          className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
