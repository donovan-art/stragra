'use client'

import { useEffect, useState } from 'react'
import { Mail, CheckCircle, Users, Phone, ArrowUpRight } from 'lucide-react'
import { useSupabase } from '../../providers/supabase-provider'
import { cn } from '../../utils'

interface MetricData {
  label: string
  value: number | string
  icon: any
  color: 'info' | 'success' | 'warning' | 'danger'
  href: string
}

export function MetricCards() {
  const { supabase, user } = useSupabase()
  const [metrics, setMetrics] = useState<MetricData[]>([
    { label: 'Unread Messages', value: '-', icon: Mail, color: 'info', href: '/dashboard/inbox' },
    { label: 'Tasks Done Today', value: '-', icon: CheckCircle, color: 'success', href: '/dashboard/tasks' },
    { label: 'New Leads', value: '-', icon: Users, color: 'warning', href: '/dashboard/crm' },
    { label: 'Calls Handled', value: '-', icon: Phone, color: 'danger', href: '/dashboard/voice' },
  ])

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return
      
      const today = new Date().toISOString().split('T')[0]
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
      
      const [
        { count: unreadCount },
        { count: doneCount },
        { count: newLeads },
        { count: callsToday }
      ] = await Promise.all([
        supabase
          .from('inbox_messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('read', false),
        supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'DONE')
          .gte('updated_at', today),
        supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
        supabase
          .from('call_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', today)
          .lt('created_at', tomorrow)
      ])

      setMetrics([
        { label: 'Unread Messages', value: unreadCount || 0, icon: Mail, color: 'info', href: '/dashboard/inbox' },
        { label: 'Tasks Done Today', value: doneCount || 0, icon: CheckCircle, color: 'success', href: '/dashboard/tasks' },
        { label: 'New Leads', value: newLeads || 0, icon: Users, color: 'warning', href: '/dashboard/crm' },
        { label: 'Calls Handled', value: callsToday || 0, icon: Phone, color: 'danger', href: '/dashboard/voice' },
      ])
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [user, supabase])

  const colorClasses = {
    info: 'bg-admin-info',
    success: 'bg-admin-success',
    warning: 'bg-admin-warning text-gray-900',
    danger: 'bg-admin-danger',
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <a
            key={metric.label}
            href={metric.href}
            className={cn(
              "metric-card group transition-transform hover:scale-[1.02]",
              colorClasses[metric.color]
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">{metric.label}</p>
                <h3 className="text-3xl font-bold">{metric.value}</h3>
              </div>
              <Icon className="h-6 w-6 opacity-80" />
            </div>
            <div className="mt-4 flex items-center text-sm opacity-80 group-hover:opacity-100">
              <span>View details</span>
              <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>
        )
      })}
    </div>
  )
}
