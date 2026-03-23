'use client'

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard, Inbox, CheckSquare, Users, Calendar,
  Sparkles, Shield, FileText, Phone, Settings, LogOut, Bell, Search, ChevronRight
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Daily Brief', href: '/brief', icon: Sparkles },
  { name: 'Vault', href: '/vault', icon: Shield, pro: true },
  { name: 'Legal', href: '/legal', icon: FileText, pro: true },
  { name: 'Voice Agent', href: '/voice', icon: Phone },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface Props {
  children: ReactNode;
  title?: string;
  breadcrumb?: string;
}

export function DashboardLayout({ children, title = 'Dashboard', breadcrumb }: Props) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userPlan] = useState<'SOLO' | 'PRO'>('SOLO');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
      else setUserEmail(session.user.email || '');
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const currentPath = router.pathname;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f4f6f9' }}>
      {/* Sidebar */}
      <aside className="w-56 flex flex-col h-screen sticky top-0 flex-shrink-0 z-20" style={{ backgroundColor: '#343a40' }}>
        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">virtualStragra</p>
              <p className="text-xs" style={{ color: '#c2c7d0' }}>Your staffed office</p>
            </div>
          </a>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#6c757d' }}>
            Main Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
            return (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sm transition-all group"
                style={{
                  color: isActive ? '#fff' : '#c2c7d0',
                  backgroundColor: isActive ? '#007bff' : 'transparent',
                  borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {(item as any).pro && !isActive && (
                  <span className="text-xs px-1 py-0.5 rounded font-medium" style={{ backgroundColor: '#ffc107', color: '#212529' }}>
                    Pro
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {userEmail[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-medium truncate">{userEmail}</p>
              <p className="text-xs" style={{ color: '#6c757d' }}>{userPlan} Plan</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs w-full py-1 rounded transition-colors hover:bg-white/10"
            style={{ color: '#c2c7d0' }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top nav */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">virtualStragra</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="font-semibold text-gray-700">{title}</span>
            {breadcrumb && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-300" />
                <span className="text-gray-400">{breadcrumb}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
              />
            </div>
            <button className="relative p-1.5 text-gray-500 hover:text-gray-800 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
