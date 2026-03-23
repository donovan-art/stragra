'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { LayoutDashboard, Inbox, CheckSquare, Users, Calendar, Share2, Shield, FileText, Phone, Settings, LogOut } from 'lucide-react'
import { useSupabase } from '../../providers/supabase-provider'
import { cn } from '../../utils'

interface SidebarProps {
  user: User
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inbox', href: '/dashboard/inbox', icon: Inbox, badge: '3' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'CRM', href: '/dashboard/crm', icon: Users },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Social', href: '/dashboard/social', icon: Share2 },
  { name: 'Vault', href: '/dashboard/vault', icon: Shield },
  { name: 'Legal', href: '/dashboard/legal', icon: FileText },
  { name: 'Voice Agent', href: '/dashboard/voice', icon: Phone },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const { supabase } = useSupabase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-sidebar flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">virtualStragra</h1>
            <p className="text-xs text-sidebar-foreground">Your staffed office</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors group",
                isActive 
                  ? "bg-sidebar-active text-white" 
                  : "text-sidebar-foreground hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  isActive ? "bg-white/20" : "bg-primary text-white"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {user.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{user.user_metadata?.name || user.email}</p>
            <p className="text-xs text-sidebar-foreground capitalize">{user.user_metadata?.plan || 'Solo'} Plan</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-sidebar-foreground hover:text-white transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
