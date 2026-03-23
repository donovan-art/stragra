import { Phone, CheckSquare, Users, Inbox, Calendar, Sparkles, Shield, FileText, ArrowRight, Check, Zap, Clock, DollarSign } from 'lucide-react';

const features = [
  { icon: Inbox, color: '#17a2b8', title: 'Unified Inbox', desc: 'Email + SMS in one place via Nylas' },
  { icon: CheckSquare, color: '#28a745', title: 'Smart Tasks', desc: 'Kanban board with AI prioritization' },
  { icon: Users, color: '#6f42c1', title: 'CRM', desc: 'Contacts, leads & interaction history' },
  { icon: Calendar, color: '#fd7e14', title: 'Calendar', desc: 'Scheduling & appointments via Cal.com' },
  { icon: Sparkles, color: '#007bff', title: 'Daily Brief', desc: 'AI-generated morning & evening summaries' },
  { icon: Phone, color: '#dc3545', title: 'Voice Agent', desc: 'Handles inbound calls 24/7 with AI' },
  { icon: Shield, color: '#6f42c1', title: 'Vault', desc: 'Encrypted password manager (Pro)' },
  { icon: FileText, color: '#fd7e14', title: 'Legal Docs', desc: 'OCR scanner for contracts & receipts (Pro)' },
];

const plans = [
  {
    name: 'Solo',
    price: '$49',
    period: '/month',
    color: '#007bff',
    features: [
      '5 blocks (Inbox, Tasks, CRM, Calendar, Brief)',
      '90 voice minutes/month',
      'AI Daily Briefings',
      'Email support',
      '5GB document storage',
    ],
    cta: 'Start Solo',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/month',
    color: '#6f42c1',
    badge: 'Most Popular',
    features: [
      'All 8 blocks including Vault & Legal',
      '180 voice minutes/month',
      'Priority support',
      'CRM import (HubSpot, Salesforce, CSV)',
      '50GB document storage',
      'Real-time sync across devices',
    ],
    cta: 'Start Pro',
    href: '/signup?plan=pro',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">virtualStragra</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden md:block">Pricing</a>
            <a href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign in</a>
            <a
              href="/signup"
              className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#007bff' }}
            >
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #f4f6f9 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 border" style={{ backgroundColor: '#e3f2fd', color: '#1565c0', borderColor: '#90caf9' }}>
            <Zap className="w-3 h-3" />
            AI-powered virtual office for solo founders
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Your entire business<br />
            <span style={{ color: '#007bff' }}>staffed by AI</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            virtualStragra is an AI operating system that handles your calls, emails, tasks, and scheduling — so you can focus on what actually moves the needle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 shadow-md"
              style={{ backgroundColor: '#007bff' }}
            >
              Start free — $49/mo
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Sign in
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-4">No credit card required to start</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { icon: Clock, stat: '<600ms', label: 'Voice response time' },
            { icon: DollarSign, stat: '$0.018', label: 'Per voice minute' },
            { icon: Zap, stat: '2x daily', label: 'AI briefings' },
          ].map(({ icon: Icon, stat, label }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stat}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6" style={{ backgroundColor: '#f4f6f9' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need, in one dashboard</h2>
            <p className="text-gray-500 max-w-xl mx-auto">8 modular blocks. Each one handles a core part of your business, all connected and updated in real time.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: color + '20' }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple pricing</h2>
            <p className="text-gray-500">One person, one price. No per-seat nonsense.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border-2 p-7 relative"
                style={{ borderColor: plan.badge ? plan.color : '#e5e7eb' }}
              >
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: plan.color }}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: plan.color }}>{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className="block w-full py-3 rounded-lg text-center font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: plan.color, color: '#fff' }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6" style={{ backgroundColor: '#343a40' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Phone className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">virtualStragra</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 virtualStragra. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
