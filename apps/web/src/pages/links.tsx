import { useState, useEffect } from "react";
import { FileText, Truck, BookOpen, Cloud, Plus, ExternalLink, X } from "lucide-react";

interface LinkCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  links: { name: string; url: string }[];
}

interface CustomLink {
  id: string;
  name: string;
  url: string;
  category: string;
}

const defaultCategories: LinkCategory[] = [
  {
    id: "permits",
    title: "Permits",
    icon: <FileText className="w-8 h-8 text-blue-600" />,
    description: "Building permits and inspection schedules",
    links: [
      { name: "City Building Dept", url: "https://building.example.gov" },
      { name: "Permit Status Lookup", url: "https://permits.example.gov" },
      { name: "Inspection Scheduler", url: "https://inspections.example.gov" },
    ],
  },
  {
    id: "suppliers",
    title: "Suppliers",
    icon: <Truck className="w-8 h-8 text-green-600" />,
    description: "Material suppliers and delivery tracking",
    links: [
      { name: "Metro Concrete", url: "https://metroconcrete.example.com" },
      { name: "Summit Roofing Supply", url: "https://summitsupply.example.com" },
      { name: "Premier Electric", url: "https://premierelec.example.com" },
    ],
  },
  {
    id: "codes",
    title: "Codes",
    icon: <BookOpen className="w-8 h-8 text-amber-600" />,
    description: "Building codes and regulations",
    links: [
      { name: "IBC 2024", url: "https://codes.iccsafe.org" },
      { name: "Local Amendments", url: "https://localcodes.example.gov" },
      { name: "Fire Code Reference", url: "https://firecode.example.gov" },
    ],
  },
  {
    id: "weather",
    title: "Weather",
    icon: <Cloud className="w-8 h-8 text-sky-600" />,
    description: "Weather forecasts and alerts",
    links: [
      { name: "NOAA Weather", url: "https://weather.gov" },
      { name: "Storm Alerts", url: "https://alerts.weather.gov" },
      { name: "10-Day Forecast", url: "https://forecast.weather.gov" },
    ],
  },
];

export default function Links() {
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("substragra_custom_links");
    if (saved) {
      setCustomLinks(JSON.parse(saved));
    }
  }, []);

  const saveCustomLink = () => {
    if (!newLinkName || !newLinkUrl) return;
    const newLink: CustomLink = {
      id: Date.now().toString(),
      name: newLinkName,
      url: newLinkUrl.startsWith("http") ? newLinkUrl : `https://${newLinkUrl}`,
      category: "custom",
    };
    const updated = [...customLinks, newLink];
    setCustomLinks(updated);
    localStorage.setItem("substragra_custom_links", JSON.stringify(updated));
    setNewLinkName("");
    setNewLinkUrl("");
    setShowModal(false);
  };

  const deleteCustomLink = (id: string) => {
    const updated = customLinks.filter((link) => link.id !== id);
    setCustomLinks(updated);
    localStorage.setItem("substragra_custom_links", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Resource Links</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Custom Link
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {defaultCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">{category.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {category.links.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <span className="text-gray-700">{link.name}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Links Section */}
        {customLinks.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Links</h2>
            <div className="space-y-2">
              {customLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  >
                    {link.name}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteCustomLink(link.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Link Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Link</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  placeholder="e.g., Supplier Portal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCustomLink}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
