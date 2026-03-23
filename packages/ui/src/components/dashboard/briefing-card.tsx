import { formatDistanceToNow } from 'date-fns'
import { Sun, Moon, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'

interface BriefingCardProps {
  content: string
  type: 'MORNING' | 'EVENING'
  deliveredAt: string
}

export function BriefingCard({ content, type, deliveredAt }: BriefingCardProps) {
  const isMorning = type === 'MORNING'

  return (
    <div className="admin-card border-l-4 border-l-primary">
      <div className="admin-card-header">
        <div className="flex items-center gap-2">
          {isMorning ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-500" />
          )}
          <h3 className="font-semibold">
            {isMorning ? 'Good Morning' : 'Evening Summary'}
          </h3>
          <span className="text-xs text-muted-foreground ml-2">
            {formatDistanceToNow(new Date(deliveredAt), { addSuffix: true })}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <p className="text-sm leading-relaxed whitespace-pre-line">{content}</p>
      </div>
    </div>
  )
}
