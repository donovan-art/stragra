import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage = () => {
  const [stamped, setStamped] = useState([false, false, false, false]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStamped(prev => [true, prev[1], prev[2], prev[3]]), 500),
      setTimeout(() => setStamped(prev => [prev[0], true, prev[2], prev[3]]), 800),
      setTimeout(() => setStamped(prev => [prev[0], prev[1], true, prev[3]]), 1100),
      setTimeout(() => setStamped(prev => [prev[0], prev[1], prev[2], true]), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const staffCards = [
    {
      role: 'Receptionist',
      salary: '$2,500/mo',
      image: '/phone_receptionist.png',
    },
    {
      role: 'Bookkeeper',
      salary: '$3,000/mo',
      image: '/filing_documents1.png',
    },
    {
      role: 'Office Manager',
      salary: '$4,000/mo',
      image: '/manager_scheduling.png',
    },
    {
      role: 'AI Secretary',
      salary: '$2,000/mo',
      image: '/4_professionals_at_their_pro_desks.png',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a1628]/95 backdrop-blur-sm z-50 border-b border-[#c9a962]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">
            sub<span className="text-[#5eead4]">Stragra</span>
          </div>
          <div className="bg-[#0a1628] text-[#5eead4] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#5eead4]/30">
            Built for Subcontractors
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight">
          Your Entire Office<br />
          <span className="text-[#5eead4]">$349 per month</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          <strong className="text-white">subStragra</strong> is not a platform. 
          It is your fully staffed office.<br />
          Welcome to your new office.
        </p>

        {/* Comparison Cards Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {staffCards.map((card, index) => (
            <div key={index} className="bg-[#1e3a5f]/50 rounded-xl overflow-hidden border border-[#5eead4]/10 hover:border-[#5eead4]/30 transition-all duration-300 hover:-translate-y-1">
              <div className="h-40 overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.role}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="font-bold text-lg mb-2">{card.role}</h3>
                <div className="relative h-8 mb-2">
                  <span className={`text-2xl font-bold transition-all duration-300 ${stamped[index] ? 'text-gray-600 line-through decoration-red-500 decoration-[3px]' : 'text-gray-400'}`}>
                    {card.salary}
                  </span>
                  {stamped[index] && (
                    <span className="absolute left-0 top-0 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold transform -rotate-6 animate-stamp">
                      X
                    </span>
                  )}
                </div>
                <div className={`transition-all duration-500 ${stamped[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  <span className="inline-block bg-[#0a1628] text-[#5eead4] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#5eead4]/30">
                    Included
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reveal Section */}
        <div className="max-w-xl mx-auto bg-gradient-to-br from-[#5eead4] to-[#2dd4bf] rounded-2xl p-8 text-[#0a1628] shadow-2xl shadow-[#5eead4]/20">
          <div className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">
            Total Value: $11,500+/mo
          </div>
          <div className="text-6xl font-bold mb-2">
            $349<span className="text-2xl">/mo</span>
          </div>
          <div className="text-lg font-medium mb-4 opacity-80">
            Your entire staffed office
          </div>
          <p className="mb-6 opacity-90">
            All four roles. One flat fee. Cancel anytime.
          </p>
          <Link href="/login">
            <button className="bg-[#0a1628] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1e3a5f] transition-all hover:-translate-y-0.5 hover:shadow-lg">
              Get Started
            </button>
          </Link>
        </div>

        {/* Subcontractor Badge */}
        <div className="mt-8 inline-flex items-center gap-2 bg-[#5eead4]/10 text-[#5eead4] px-4 py-2 rounded-full text-sm font-medium border border-[#5eead4]/30">
          <span>⚡</span>
          <span>Platform designed specifically for subcontractors</span>
        </div>
      </section>

      {/* Setup Section */}
      <section className="py-20 px-6 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Up and running in minutes</h2>
          <p className="text-gray-400 mb-12">No training, no payroll, no headaches. Just your office, finally staffed.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-[#1e3a5f]/30 p-6 rounded-xl border-l-4 border-[#5eead4]">
              <div className="text-4xl font-bold text-[#5eead4]/40 mb-2">01</div>
              <h3 className="font-bold text-lg mb-2">Forward your calls</h3>
              <p className="text-gray-400 text-sm">Send your business line to subStragra. Or port your number. Takes 2 minutes.</p>
            </div>
            <div className="bg-[#1e3a5f]/30 p-6 rounded-xl border-l-4 border-[#5eead4]">
              <div className="text-4xl font-bold text-[#5eead4]/40 mb-2">02</div>
              <h3 className="font-bold text-lg mb-2">Upload your jobs</h3>
              <p className="text-gray-400 text-sm">Import from Excel or QuickBooks. The AI learns your projects instantly.</p>
            </div>
            <div className="bg-[#1e3a5f]/30 p-6 rounded-xl border-l-4 border-[#5eead4]">
              <div className="text-4xl font-bold text-[#5eead4]/40 mb-2">03</div>
              <h3 className="font-bold text-lg mb-2">Let it work</h3>
              <p className="text-gray-400 text-sm">While you're on the job site, your office staff handles everything else.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-2">One plan. No surprises.</h2>
          <p className="text-gray-400 mb-8">Everything your subcontracting business needs.</p>

          <div className="bg-[#1e3a5f]/50 rounded-2xl p-8 border border-[#5eead4]/20 text-left">
            <div className="text-center border-b border-[#5eead4]/20 pb-6 mb-6">
              <div className="text-sm font-bold text-[#5eead4] uppercase tracking-widest mb-2">Complete Office Staff</div>
              <div className="text-5xl font-bold">$349<span className="text-xl text-gray-400">/mo</span></div>
              <p className="text-gray-400 text-sm mt-2">Cancel anytime. No setup fees.</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-[#5eead4] font-bold">✓</span>
                <span>Unlimited AI phone calls answered 24/7</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#5eead4] font-bold">✓</span>
                <span>Retainage tracking & deadline alerts</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#5eead4] font-bold">✓</span>
                <span>GC appointment scheduling</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#5eead4] font-bold">✓</span>
                <span>Payment reminder automation</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#5eead4] font-bold">✓</span>
                <span>Document storage & compliance</span>
              </li>
            </ul>

            <Link href="/login">
              <button className="w-full bg-[#5eead4] text-[#0a1628] py-3 rounded-lg font-bold hover:bg-[#2dd4bf] transition-all hover:-translate-y-0.5">
                Start Your Office Staff
              </button>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes stamp {
          0% { transform: rotate(-5deg) scale(0); }
          50% { transform: rotate(-5deg) scale(1.2); }
          100% { transform: rotate(-5deg) scale(1); }
        }
        .animate-stamp {
          animation: stamp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
