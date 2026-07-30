import { cn } from '@/lib/utils'
import { type HTMLAttributes, type ReactNode } from 'react'

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

/** Horizontal page padding — 20px mobile (Figma), 120px desktop. */
export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1440px] px-5 lg:px-[120px]', className)}
      {...props}
    >
      {children}
    </div>
  )
}

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  as?: 'section' | 'div'
}

export function Section({ className, children, as: Tag = 'section', ...props }: SectionProps) {
  return (
    <Tag className={cn('w-full', className)} {...props}>
      {children}
    </Tag>
  )
}
