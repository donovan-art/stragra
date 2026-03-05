import Link from 'next/link';
import DualColumnScroller from '../components/DualColumnScroller';
import { ArrowRight, Mic, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            sub<span className="text-teal-400">Stragra</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            AI Agent for Construction Subcontractors. Never lose retainage again.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="bg-teal-500 hover:bg-teal-600 text-black px-8 py-3 rounded-lg font-semibold flex items-center">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="/demo" className="border border-gray-700 hover:border-teal-400 text-white px-8 py-3 rounded-lg font-semibold">
              Watch Demo
            </Link>
          </div>
        </div>

        {/* Dual Column Scroll */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">The Problem → Our Solution</h2>
          <DualColumnScroller />
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <Mic className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Voice AI</h3>
            <p className="text-gray-400">Spacebar-to-speak commands. Control your business hands-free.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <Shield className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Lien Protection</h3>
            <p className="text-gray-400">Never miss a deadline. Automated preliminary notices & filings.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
            <Clock className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Payment Tracking</h3>
            <p className="text-gray-400">Automated reminders. Know exactly who owes what and when.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-900 border border-gray-800 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to protect your retainage?</h2>
          <p className="text-gray-400 mb-8">Join subcontractors saving $50K+ annually with AI automation.</p>
          <Link href="/signup" className="bg-teal-500 hover:bg-teal-600 text-black px-8 py-3 rounded-lg font-semibold inline-flex items-center">
            Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
