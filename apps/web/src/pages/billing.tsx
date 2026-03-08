import { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter,
  ChevronRight,
  ArrowLeft,
  FileText,
  Download,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  projectName: string;
  gcName: string;
  amount: string;
  issuedDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'disputed';
  items: { description: string; quantity: number; rate: string; total: string }[];
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-001',
    projectName: 'Metro Plaza Renovation',
    gcName: 'Metro Construction LLC',
    amount: '$45,000.00',
    issuedDate: '2026-02-15',
    dueDate: '2026-03-15',
    status: 'sent',
    items: [
      { description: 'Electrical rough-in', quantity: 1, rate: '$25,000.00', total: '$25,000.00' },
      { description: 'Panel installation', quantity: 1, rate: '$20,000.00', total: '$20,000.00' },
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-002',
    projectName: 'Harborview Apartments - Phase 1',
    gcName: 'Harbor Builders Inc',
    amount: '$128,500.00',
    issuedDate: '2026-02-01',
    dueDate: '2026-03-01',
    status: 'overdue',
    items: [
      { description: 'Complete electrical package', quantity: 1, rate: '$100,000.00', total: '$100,000.00' },
      { description: 'Low voltage systems', quantity: 1, rate: '$28,500.00', total: '$28,500.00' },
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-003',
    projectName: 'Downtown Office Tower',
    gcName: 'Skyline Development',
    amount: '$89,000.00',
    issuedDate: '2026-01-20',
    dueDate: '2026-02-20',
    status: 'paid',
    items: [
      { description: 'Emergency lighting upgrade', quantity: 1, rate: '$45,000.00', total: '$45,000.00' },
      { description: 'Generator installation', quantity: 1, rate: '$44,000.00', total: '$44,000.00' },
    ]
  },
  {
    id: '4',
    invoiceNumber: 'INV-2026-004',
    projectName: 'Riverside Mall - Electrical',
    gcName: 'Riverside Construction',
    amount: '$234,000.00',
    issuedDate: '2026-03-01',
    dueDate: '2026-04-01',
    status: 'draft',
    items: [
      { description: 'Service upgrade', quantity: 1, rate: '$150,000.00', total: '$150,000.00' },
      { description: 'LED retrofit', quantity: 1, rate: '$84,000.00', total: '$84,000.00' },
    ]
  },
  {
    id: '5',
    invoiceNumber: 'INV-2026-005',
    projectName: 'Industrial Park Phase 2',
    gcName: 'Industrial Solutions',
    amount: '$67,500.00',
    issuedDate: '2026-02-10',
    dueDate: '2026-03-10',
    status: 'disputed',
    items: [
      { description: 'Conduit and wiring', quantity: 1, rate: '$67,500.00', total: '$67,500.00' },
    ]
  },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  draft: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: FileText, label: 'Draft' },
  sent: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Send, label: 'Sent' },
  paid: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle, label: 'Paid' },
  overdue: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertCircle, label: 'Overdue' },
  disputed: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: XCircle, label: 'Disputed' },
};

export default function Billing() {
  const [filter, setFilter] = useState<'all' | 'sent' | 'overdue' | 'paid'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = mockInvoices.filter(inv => {
    const matchesFilter = filter === 'all' || inv.status === filter || (filter === 'overdue' && inv.status === 'disputed');
    const matchesSearch = inv.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.gcName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalOutstanding = mockInvoices
    .filter(i => i.status === 'sent' || i.status === 'overdue' || i.status === 'disputed')
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, '')), 0);

  const totalOverdue = mockInvoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, '')), 0);

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
              <DollarSign className="w-6 h-6 text-teal-400" />
              Billing & Invoices
            </h1>
            <p className="text-gray-400 mt-1">Manage invoices, payments, and outstanding balances</p>
          </div>
          <button className="bg-teal-500 hover:bg-teal-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Outstanding', value: `$${totalOutstanding.toLocaleString()}`, color: 'text-amber-400' },
            { label: 'Overdue', value: `$${totalOverdue.toLocaleString()}`, color: 'text-red-400' },
            { label: 'Paid This Month', value: '$89,000', color: 'text-green-400' },
            { label: 'Draft Invoices', value: mockInvoices.filter(i => i.status === 'draft').length.toString(), color: 'text-gray-400' },
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
              placeholder="Search invoices, projects, or GCs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
            {(['all', 'sent', 'overdue', 'paid'] as const).map((f) => (
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

        {/* Invoice List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Invoice #</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Project</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">GC</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Amount</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Due Date</th>
                <th className="text-left text-gray-400 font-medium px-4 py-3">Status</th>
                <th className="text-right text-gray-400 font-medium px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                const StatusIcon = status.icon;
                const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => setSelectedInvoice(invoice)}>
                    <td className="px-4 py-4 text-teal-400 font-medium">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-4 text-white font-medium">{invoice.projectName}</td>
                    <td className="px-4 py-4 text-gray-300">{invoice.gcName}</td>
                    <td className="px-4 py-4 text-white font-medium">{invoice.amount}</td>
                    <td className="px-4 py-4">
                      <span className={isOverdue ? 'text-red-400' : 'text-gray-300'}>
                        {invoice.dueDate}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    </td>
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
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No invoices found matching your criteria
            </div>
          )}
        </div>

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedInvoice(null)}>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedInvoice.invoiceNumber}</h3>
                  <p className="text-gray-400">{selectedInvoice.projectName}</p>
                </div>
                {(() => {
                  const status = statusConfig[selectedInvoice.status];
                  const StatusIcon = status.icon;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {status.label}
                    </span>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">General Contractor</p>
                  <p className="text-white">{selectedInvoice.gcName}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Issue Date</p>
                  <p className="text-white">{selectedInvoice.issuedDate}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Due Date</p>
                  <p className="text-white">{selectedInvoice.dueDate}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Total Amount</p>
                  <p className="text-teal-400 font-bold text-lg">{selectedInvoice.amount}</p>
                </div>
              </div>

              <h4 className="text-white font-semibold mb-3">Line Items</h4>
              <div className="bg-gray-800/30 rounded-lg overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="text-left text-gray-400 font-medium px-4 py-2">Description</th>
                      <th className="text-right text-gray-400 font-medium px-4 py-2">Qty</th>
                      <th className="text-right text-gray-400 font-medium px-4 py-2">Rate</th>
                      <th className="text-right text-gray-400 font-medium px-4 py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-white">{item.description}</td>
                        <td className="px-4 py-3 text-right text-gray-300">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-300">{item.rate}</td>
                        <td className="px-4 py-3 text-right text-teal-400 font-medium">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Reminder
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
