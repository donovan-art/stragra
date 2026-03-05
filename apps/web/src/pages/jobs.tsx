import { useState } from "react";
import { Plus, DollarSign, Calendar } from "lucide-react";

type JobStatus = "lead" | "contract" | "active" | "complete" | "paid";

interface Job {
  id: string;
  name: string;
  gc: string;
  amount: number;
  status: JobStatus;
}

const mockJobs: Job[] = [
  { id: "1", name: "Downtown Office Renovation", gc: "Chen Construction Group", amount: 145000, status: "active" },
  { id: "2", name: "Highland Residence Addition", gc: "Williams & Associates", amount: 87500, status: "contract" },
  { id: "3", name: "Metro Plaza Foundation", gc: "Martinez Builders LLC", amount: 320000, status: "lead" },
  { id: "4", name: "Oak Street Commercial", gc: "Park Commercial Construction", amount: 210000, status: "complete" },
  { id: "5", name: "Riverside Apartments Phase 1", gc: "Thompson Development Corp", amount: 450000, status: "paid" },
  { id: "6", name: "Sunset Plaza Parking", gc: "Chen Construction Group", amount: 185000, status: "active" },
  { id: "7", name: "Westside Medical Center", gc: "Williams & Associates", amount: 675000, status: "lead" },
  { id: "8", name: "Northpoint Warehouse", gc: "Martinez Builders LLC", amount: 125000, status: "contract" },
];

const columns: { id: JobStatus; label: string; color: string; borderColor: string }[] = [
  { id: "lead", label: "Lead", color: "bg-gray-100", borderColor: "border-l-gray-400" },
  { id: "contract", label: "Contract", color: "bg-amber-100", borderColor: "border-l-amber-400" },
  { id: "active", label: "Active", color: "bg-blue-100", borderColor: "border-l-blue-400" },
  { id: "complete", label: "Complete", color: "bg-teal-100", borderColor: "border-l-teal-400" },
  { id: "paid", label: "Paid", color: "bg-green-100", borderColor: "border-l-green-400" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function JobCard({ job, borderColor }: { job: Job; borderColor: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${borderColor} p-4 mb-3 hover:shadow-md cursor-pointer`}>
      <h4 className="font-medium text-gray-900 text-sm mb-2">{job.name}</h4>
      <p className="text-xs text-gray-500 mb-3">{job.gc}</p>
      <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
        <DollarSign className="w-4 h-4" />
        {formatCurrency(job.amount)}
      </div>
    </div>
  );
}

export default function Jobs() {
  const [showModal, setShowModal] = useState(false);

  const getJobsByStatus = (status: JobStatus) => mockJobs.filter((job) => job.status === status);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Job Board</h1>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            New Job
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnJobs = getJobsByStatus(column.id);
            return (
              <div key={column.id} className={`flex-shrink-0 w-72 ${column.color} rounded-lg`}>
                <div className="p-4 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{column.label}</h3>
                    <span className="bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full">{columnJobs.length}</span>
                  </div>
                </div>
                <div className="p-3">
                  {columnJobs.map((job) => (
                    <JobCard key={job.id} job={job} borderColor={column.borderColor} />
                  ))}
                  <button className="w-full py-2 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-lg">
                    <Plus className="w-4 h-4" />
                    Add job
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Job</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Job name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="General Contractor" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" placeholder="Amount" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
