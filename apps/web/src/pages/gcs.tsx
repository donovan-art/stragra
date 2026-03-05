import { useState } from "react";
import { Star, Plus, Search } from "lucide-react";

interface GC {
  id: string;
  name: string;
  company: string;
  rating: number;
  paymentSpeed: number;
  retainagePercent: number;
}

const mockGCs: GC[] = [
  { id: "1", name: "Michael Chen", company: "Chen Construction Group", rating: 5, paymentSpeed: 12, retainagePercent: 5 },
  { id: "2", name: "Sarah Williams", company: "Williams & Associates", rating: 4, paymentSpeed: 18, retainagePercent: 10 },
  { id: "3", name: "Robert Martinez", company: "Martinez Builders LLC", rating: 3, paymentSpeed: 28, retainagePercent: 15 },
  { id: "4", name: "Jennifer Park", company: "Park Commercial Construction", rating: 5, paymentSpeed: 8, retainagePercent: 5 },
  { id: "5", name: "David Thompson", company: "Thompson Development Corp", rating: 2, paymentSpeed: 45, retainagePercent: 20 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

function PaymentSpeed({ days }: { days: number }) {
  let colorClass = "";
  if (days < 15) colorClass = "text-green-600";
  else if (days <= 30) colorClass = "text-amber-600";
  else colorClass = "text-red-600";
  return <span className={`font-medium ${colorClass}`}>{days} days</span>;
}

export default function GCS() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">GC Directory</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add GC
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search GCs..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">GC Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Payment Speed</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Retainage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockGCs.map((gc) => (
                <tr key={gc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{gc.name}</div>
                    <div className="text-sm text-gray-500">{gc.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StarRating rating={gc.rating} />
                  </td>
                  <td className="px-6 py-4">
                    <PaymentSpeed days={gc.paymentSpeed} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{gc.retainagePercent}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add GC Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add General Contractor</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Company" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
