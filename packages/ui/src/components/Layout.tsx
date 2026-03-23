'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Inbox, 
  Users, 
  Calendar, 
  Phone, 
  Settings, 
  LogOut,
  Mic
} from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/inbox', icon: Inbox, label: 'Inbox' },
  { href: '/contacts', icon: Users, label: 'CRM' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/calls', icon: Phone, label: 'Calls' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [voiceActive, setVoiceActive] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleVoice = () => {
    setVoiceActive(!voiceActive);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
            <span className="text-black font-bold text-lg">v</span>
          </div>
          <span className="text-white font-semibold text-xl">virtualStragra</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                router.pathname === item.href
                  ? 'bg-zinc-800 text-teal-400'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-2">
          <Button
            variant="outline"
            className={`w-full justify-start gap-2 ${voiceActive ? 'bg-teal-500/20 border-teal-500 text-teal-400' : 'border-zinc-700 text-zinc-400'}`}
            onClick={toggleVoice}
          >
            <Mic className="w-4 h-4" />
            {voiceActive ? 'Voice Active' : 'Voice Command'}
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-zinc-400 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
