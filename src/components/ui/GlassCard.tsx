import { cn } from '@/lib/utils'
import { type HTMLAttributes, type ReactNode } from 'react'

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  hover?: boolean
}

/** Translucent card with depth — Apple material pattern. */
export function GlassCard({ children, className, hover = true, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-[40px] border border-white/60',
        'shadow-[0px_20px_25px_-5px_rgba(104,50,102,0.08),0px_8px_10px_-6px_rgba(104,50,102,0.06)]',
        hover && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
