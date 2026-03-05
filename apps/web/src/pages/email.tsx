import { useState } from "react";
import { Inbox, Clock, Star, FileText, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "ABC General Contractors",
    subject: "Invoice #2847 - Payment Due",
    preview: "This is a reminder that invoice #2847 for $45,000 is due on March 15th...",
    date: "10:30 AM",
    read: false,
  },
  {
    id: "2",
    sender: "Metro Concrete Supply",
    subject: "Delivery Delay - Order #5521",
    preview: "We regret to inform you that your concrete delivery is delayed by 2 days...",
    date: "Yesterday",
    read: true,
  },
  {
    id: "3",
    sender: "City Building Dept",
    subject: "Permit Approved - Building #2024-0892",
    preview: "Your building permit application has been approved. Please find attached...",
    date: "Mar 4",
    read: true,
  },
  {
    id: "4",
    sender: "Summit Roofing LLC",
    subject: "Weather Delay Notice",
    preview: "Due to the forecasted storms, we will be postponing work until next week...",
    date: "Mar 3",
    read: false,
  },
  {
    id: "5",
    sender: "Premier Electric",
    subject: "Change Order #12 - Additional Circuits",
    preview: "Please review the attached change order for additional electrical circuits...",
    date: "Mar 2",
    read: true,
  },
];

export default function Email() {
  const [activeTab, setActiveTab] = useState("primary");

  const tabs = [
    { id: "primary", label: "Primary", icon: Inbox },
    { id: "reminders", label: "Reminders", icon: Clock },
    { id: "gcs", label: "GCs", icon: Star },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-blue-700">
            <span className="text-xl">+</span>
            Compose
          </button>
        </div>
        <nav className="px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-r-full text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.id === "primary" && (
                  <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">2</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mail"
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>1-5 of 24</span>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-auto">
          {mockEmails.map((email) => (
            <div
              key={email.id}
              className={`flex items-center gap-4 px-4 py-3 border-b border-gray-100 hover:shadow-md cursor-pointer ${
                email.read ? "bg-white" : "bg-blue-50"
              }`}
            >
              <button className="text-gray-400 hover:text-yellow-400">
                <Star className="w-5 h-5" />
              </button>
              <div className={`w-48 truncate font-medium ${email.read ? "text-gray-900" : "font-bold"}`}>
                {email.sender}
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className={`truncate ${email.read ? "text-gray-700" : "font-semibold"}`}>
                  {email.subject}
                </span>
                <span className="text-gray-500 truncate">- {email.preview}</span>
              </div>
              <div className="text-sm text-gray-500">{email.date}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
