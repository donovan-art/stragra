'use client'

import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { User } from '@supabase/supabase-js'

interface DashboardShellProps {
  children: React.ReactNode
  user: User
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <div className="min-h-screen flex bg-admin-bg">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav user={user} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
