import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Mail, 
  Gavel, 
  Users, 
  Briefcase, 
  Link as LinkIcon, 
  Play,
  Mic,
  Home,
  Settings,
  Bell
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/os', icon: Home },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Email', href: '/email', icon: Mail },
  { name: 'Legal', href: '/legal', icon: Gavel },
  { name: 'GC Network', href: '/gcs', icon: Users },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Links', href: '/links', icon: LinkIcon },
  { name: 'Demo', href: '/demo', icon: Play },
];

export default function Dashboard() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && e.target === document.body) {
        e.preventDefault();
        setIsListening(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsListening(false);
        // Process voice command here
        if (transcript) {
          console.log('Voice command:', transcript);
          setTranscript('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [transcript]);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
              <span className="text-black font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-white">subStragra</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-black font-semibold text-sm">U</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Voice UI Indicator */}
          <div className={`mb-6 p-4 rounded-lg border transition-all ${
            isListening 
              ? 'bg-teal-500/10 border-teal-500' 
              : 'bg-gray-900 border-gray-800'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                isListening ? 'bg-teal-500 animate-pulse' : 'bg-gray-800'
              }`}>
                <Mic className={`w-6 h-6 ${isListening ? 'text-black' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-white font-medium">
                  {isListening ? 'Listening...' : 'Hold spacebar to speak'}
                </p>
                <p className="text-sm text-gray-400">
                  {isListening 
                    ? 'Say something like "Show me jobs" or "Create reminder"' 
                    : 'Voice commands enabled'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Active Jobs', value: '8', color: 'text-blue-400' },
              { label: 'Pending Payments', value: '$124K', color: 'text-amber-400' },
              { label: 'GCs in Network', value: '24', color: 'text-green-400' },
              { label: 'Lien Deadlines', value: '3', color: 'text-red-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { name: 'New Job', href: '/jobs', color: 'bg-blue-500' },
                { name: 'Send Invoice', href: '/billing', color: 'bg-green-500' },
                { name: 'Add GC', href: '/gcs', color: 'bg-purple-500' },
                { name: 'File Lien', href: '/legal', color: 'bg-red-500' },
              ].map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className={`${action.color} hover:opacity-90 text-white px-4 py-3 rounded-lg font-medium text-center transition-opacity`}
                >
                  {action.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
