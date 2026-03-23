'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '../../providers/supabase-provider'
import { TaskBlock } from '../blocks/task-block'
import { InboxBlock } from '../blocks/inbox-block'
import { CRMBlock } from '../blocks/crm-block'
import { CalendarBlock } from '../blocks/calendar-block'
import { Button } from '../ui/button'
import { LayoutGrid, Lock } from 'lucide-react'

const availableBlocks = [
  { id: 'tasks', name: 'Tasks', component: TaskBlock, solo: true },
  { id: 'inbox', name: 'Inbox', component: InboxBlock, solo: true },
  { id: 'crm', name: 'Recent Contacts', component: CRMBlock, solo: true },
  { id: 'calendar', name: 'Up Next', component: CalendarBlock, solo: true },
]

export function BlockGrid() {
  const { supabase, user } = useSupabase()
  const [plan, setPlan] = useState<'SOLO' | 'PRO'>('SOLO')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) return
      
      const { data } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setPlan(data.plan)
      }
      setLoading(false)
    }
    
    fetchUserPlan()
  }, [user, supabase])

  const visibleBlocks = plan === 'PRO' 
    ? availableBlocks 
    : availableBlocks.filter(b => b.solo)

  if (loading) {
    return <div className="h-96 flex items-center justify-center">Loading blocks...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Your Workspace
        </h2>
        {plan === 'SOLO' && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Lock className="h-4 w-4" />
            4 of 8 blocks (Upgrade to Pro for all blocks)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visibleBlocks.map((block) => {
          const BlockComponent = block.component
          return (
            <div key={block.id} className="admin-card">
              <div className="admin-card-header">
                <h3 className="font-semibold">{block.name}</h3>
              </div>
              <div className="p-4">
                <BlockComponent compact />
              </div>
            </div>
          )
        })}
      </div>

      {plan === 'SOLO' && (
        <div className="admin-card p-6 text-center">
          <h3 className="font-semibold mb-2">Unlock More Blocks</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upgrade to Pro to access Social, Vault, Legal, and Daily Brief blocks
          </p>
          <Button>Upgrade to Pro</Button>
        </div>
      )}
    </div>
  )
}
