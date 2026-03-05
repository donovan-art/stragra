import { Play, Shield, Clock, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Substragra</h1>
          <nav className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/demo" className="text-gray-900 font-medium">Demo</Link>
            <Link href="/signup" className="text-gray-600 hover:text-gray-900">Sign Up</Link>
          </nav>
        </div>
      </header>

      {/* Video Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">See How It Works</h2>
          <p className="text-lg text-gray-600 mb-8">
            Watch how Substragra streamlines your construction payment workflows
          </p>
          <div className="bg-gray-800 rounded-xl aspect-video flex items-center justify-center shadow-2xl">
            <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Built for Construction Professionals
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Payment Protection</h4>
              <p className="text-gray-600">Secure lien rights and payment documentation. Never miss a deadline.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Time Tracking</h4>
              <p className="text-gray-600">Automated timeline management for notices and payment deadlines.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Cash Flow Insights</h4>
              <p className="text-gray-600">Real-time visibility into outstanding payments and retainage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of contractors who trust Substragra
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
