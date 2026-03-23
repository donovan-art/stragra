'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Search, Bell, Plus } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface TopNavProps {
  user: User
}

export function TopNav({ user }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  return (
    <header className="h-16 bg-white border-b border-admin-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts, tasks, messages..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button size="sm" onClick={() => router.push('/dashboard/tasks?create=true')}>
          <Plus className="h-4 w-4 mr-1" />
          New Task
        </Button>
        
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  )
}
