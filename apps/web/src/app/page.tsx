'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Glossy background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="text-2xl font-bold text-white tracking-tight">
            Stragra
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Login
          </Link>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            AI Agency Platform
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12">
            Deploy autonomous AI agents for your business operations. 
            Monitor performance, track metrics, and scale your workforce.
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-zinc-900 text-white font-medium rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 text-center text-sm text-zinc-600">
          © 2026 Stragra. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
