import { useState } from 'react';
import Link from 'next/link';
import { 
  Gavel, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Plus,
  Search,
  Filter,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface Lien {
  id: string;
  projectName: string;
  gcName: string;
  amount: string;
  filingDeadline: string;
  status: 'filed' | 'pending' | 'expired' | 'released';
  type: 'preliminary' | 'mechanics' | 'notice';
}

const mockLiens: Lien[] = [
  { 
    id: '1', 
    projectName: 'Metro Plaza Renovation', 
    gcName: 'Metro Construction LLC', 
    amount: '$45,000', 
    filingDeadline: '2026-03-15', 
    status: 'pending',
    type: 'preliminary'
  },
  { 
    id: '2', 
    projectName: 'Harborview Apartments', 
    gcName: 'Harbor Builders Inc', 
    amount: '$128,500', 
    filingDeadline: '2026-02-28', 
    status: 'filed',
    type: 'mechanics'
  },
  { 
    id: '3', 
    projectName: 'Downtown Office Tower', 
    gcName: 'Skyline Development', 
    amount: '$89,000', 
    filingDeadline: '2026-01-15', 
    status: 'expired',
    type: 'preliminary'
  },
  { 
    id: '4', 
    projectName: 'Riverside Mall', 
    gcName: 'Riverside Construction', 
    amount: '$234,000', 
    filingDeadline: '2026-04-20', 
    status: 'pending',
    type: 'mechanics'
  },
  { 
    id: '5', 
    projectName: 'Industrial Park Phase 2', 
    gcName: 'Industrial Solutions', 
    amount: '$67,500', 
    filingDeadline: '2026-02-10', 
    status: 'released',
    type: 'notice'
  },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  filed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle, label: 'Filed' },
  pending: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock, label: 'Pending' },
  expired: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle, label: 'Expired' },
  released: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: CheckCircle, label: 'Released' },
};

const typeLabels: Record<string, string> = {
  preliminary: 'Preliminary Notice',
  mechanics: "Mechanic's Lien",
  notice: 'Notice of Intent',
};

export default function Legal() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'filed' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLiens = mockLiens.filter(lien => {
    const matchesFilter = filter === 'all' || lien.status === filter;
    const matchesSearch = lien.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lien.gcName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const urgentLiens = mockLiens.filter(l => l.status === 'pending' && new Date(l.filingDeadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <Link href="/os" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
              <span className="text-black font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-white">subStragra</span>
          </Link>
        </div>
        <nav className="p-4">
          <Link href="/os" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Gavel className="w-6 h-6 text-teal-400" />
              Legal & Lien Management
            </h1>
            <p className="text-gray-400 mt-1">Track filings, deadlines, and lien status</p>
          </div>
          <button className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            File New Lien
          </button>
        </div>

        {/* Urgent Alerts */}
        {urgentLiens.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Urgent: Deadlines within 7 days</span>
            </div>
            <div className="space-y-2">
              {urgentLiens.map(lien => (
                <div key={lien.id} className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
                  <div>
                    <p className="text-white font-medium">{lien.projectName}</p>
                    <p className="text-sm text-gray-400">{lien.gcName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-medium">Due: {lien.filingDeadline}</p>
                    <p className="text-sm text-gray-400">{lien.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Active', value: mockLiens.filter(l => l.status !== 'released').length.toString(), color: 'text-blue-400' },
            { label: 'Pending Filing', value: mockLiens.filter(l => l.status === 'pending').length.toString(), color: 'text-amber-400' },
            { label: 'Filed', value: mockLiens.filter(l => l.status === 'filed').length.toString(), color: 'text-green-400' },
            { label: 'At Risk', value: urgentLiens.length.toString(), color: 'text-red-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects or GCs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
            {(['all', 'pending', 'filed', 'expired'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === f ? 'bg-teal-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lien List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Project</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">GC</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Type</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Amount</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Deadline</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Status</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLiens.map((lien) => {
                const status = statusConfig[lien.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={lien.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-white font-medium">{lien.projectName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{lien.gcName}</td>
                    <td className="px-4 py-4 text-gray-300">{typeLabels[lien.type]}</td>
                    <td className="px-4 py-4 text-teal-400 font-medium">{lien.amount}</td>
                    <td className="px-4 py-4 text-gray-300">{lien.filingDeadline}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-teal-400 hover:text-teal-300 flex items-center gap-1 ml-auto">
                        View <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredLiens.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No liens found matching your criteria
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
