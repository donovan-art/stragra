'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TaskBlock, 
  InboxBlock, 
  CRMBlock, 
  CalendarBlock, 
  BriefBlock, 
  VaultBlock, 
  LegalBlock, 
  VoiceMinutesBlock,
  DashboardShell
} from '@stragra/ui';
import { Inbox, CheckSquare, Users, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Stats {
  unread: number;
  tasksPending: number;
  contacts: number;
  callsToday: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ unread: 0, tasksPending: 0, contacts: 0, callsToday: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      
      setUserEmail(session.user.email || '');
      const uid = session.user.id;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [
        { count: unread },
        { count: tasksPending },
        { count: contacts },
        { count: callsToday },
      ] = await Promise.all([
        supabase.from('inbox_messages').select('*', { count: 'exact', head: true }).eq('user_id', uid).eq('read', false),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('user_id', uid).neq('status', 'DONE'),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('call_logs').select('*', { count: 'exact', head: true }).eq('user_id', uid).gte('created_at', todayStart.toISOString()),
      ]);

      setStats({
        unread: unread || 0,
        tasksPending: tasksPending || 0,
        contacts: contacts || 0,
        callsToday: callsToday || 0,
      });
      setStatsLoaded(true);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const statCards = [
    { label: 'Unread Messages', value: statsLoaded ? stats.unread : '…', color: '#17a2b8', icon: Inbox, href: '/inbox' },
    { label: 'Tasks Pending', value: statsLoaded ? stats.tasksPending : '…', color: '#28a745', icon: CheckSquare, href: '/tasks' },
    { label: 'Total Contacts', value: statsLoaded ? stats.contacts : '…', color: '#ffc107', icon: Users, href: '/crm' },
    { label: 'Calls Today', value: statsLoaded ? stats.callsToday : '…', color: '#dc3545', icon: Phone, href: '/voice' },
  ];

  return (
    <DashboardShell title="Dashboard" userEmail={userEmail} userPlan="SOLO" onLogout={handleLogout}>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, color, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="rounded shadow-sm text-white p-4 flex items-center justify-between hover:opacity-90 transition-opacity"
            style={{ backgroundColor: color }}
          >
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs opacity-90 mt-0.5">{label}</p>
            </div>
            <Icon className="w-10 h-10 opacity-25" />
          </a>
        ))}
      </div>

      {/* Blocks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <TaskBlock />
        <InboxBlock />
        <CRMBlock />
        <CalendarBlock />
        <BriefBlock />
        <VoiceMinutesBlock />
        <VaultBlock userPlan="SOLO" />
        <LegalBlock userPlan="SOLO" />
      </div>
    </DashboardShell>
  );
}
