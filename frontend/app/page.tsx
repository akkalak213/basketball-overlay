import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>

      <main className="flex flex-col items-center text-center z-10 max-w-3xl w-full">
        <div className="mb-12 inline-flex items-center justify-center p-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
          <span className="text-5xl mr-4">🏟️</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
            Multi-Sport Score Overlay
          </h1>
        </div>
        
        <p className="text-neutral-400 text-lg md:text-xl mb-12 max-w-xl leading-relaxed">
          Select a module to continue. The Admin Panel controls the score, and the Yolobox Overlay displays it.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          {/* Admin Panel Card */}
          <Link
            href="/admin"
            className="group relative flex flex-col items-center justify-center p-8 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 hover:border-blue-500/50 rounded-3xl transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Admin Panel</h2>
            <p className="text-neutral-500 text-sm">Control scores, colors, and game clock</p>
          </Link>

          {/* Yolobox Overlay Card */}
          <Link
            href="/overlay"
            className="group relative flex flex-col items-center justify-center p-8 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 hover:border-red-500/50 rounded-3xl transition-all duration-300 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-red-400 transition-colors">Yolobox Overlay</h2>
            <p className="text-neutral-500 text-sm">Clean output for Yolobox Pro</p>
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-neutral-600 text-sm font-medium">
        Running on ws://localhost:3001
      </footer>
    </div>
  );
}
