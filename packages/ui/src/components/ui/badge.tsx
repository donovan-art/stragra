import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Task-specific variants
        todo: "border-transparent bg-slate-500/15 text-slate-500 hover:bg-slate-500/25",
        in_progress: "border-transparent bg-blue-500/15 text-blue-500 hover:bg-blue-500/25",
        done: "border-transparent bg-green-500/15 text-green-500 hover:bg-green-500/25",
        // Priority variants
        low: "border-transparent bg-gray-500/15 text-gray-500",
        medium: "border-transparent bg-yellow-500/15 text-yellow-600",
        high: "border-transparent bg-red-500/15 text-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
