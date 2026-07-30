import { cn } from '@/lib/utils'
import { type HTMLAttributes, type ReactNode } from 'react'

type TypographyProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

export function H1({ className, children, as: Tag = 'h1', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-poppins text-[67px] font-extrabold leading-[1.5] tracking-normal',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function H1Gradient({ className, children, as: Tag = 'span', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'text-display bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end bg-clip-text',
        'font-poppins text-[clamp(2.5rem,6vw,4.1875rem)] font-extrabold text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function H1Sub({ className, children, as: Tag = 'span', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'text-heading font-poppins text-[clamp(1.75rem,3.5vw,2.375rem)] font-bold text-font-500',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function H2({ className, children, as: Tag = 'h2', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'text-heading font-poppins text-[28px] font-semibold leading-[1.2] text-font-500 lg:text-[clamp(2rem,4vw,3.125rem)]',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

/** Figma H4 — product feature titles (38px Poppins Medium). */
export function H4({ className, children, as: Tag = 'h3', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-poppins text-[38px] font-medium leading-[1.5] text-font-500',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

/** Figma Paragraph 1 — product body copy (21px Inter, line-height 1.4). */
export function ProductBody({ className, children, as: Tag = 'p', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-inter text-[21px] font-normal leading-[1.4] text-font-400',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function Label1({ className, children, as: Tag = 'span', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-poppins text-[28px] font-normal leading-[1.2] text-font-500',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function Label2({ className, children, as: Tag = 'span', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-poppins text-[21px] font-bold leading-[1.2]',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function Label3({ className, children, as: Tag = 'span', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-poppins text-[21px] font-semibold leading-[1.2] text-font-500',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function Label4({ className, children, as: Tag = 'span', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-poppins text-[21px] font-normal leading-[1.5]',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function Label6({ className, children, as: Tag = 'span', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-poppins text-base font-medium leading-[1.2] text-font-500',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function P1({ className, children, as: Tag = 'p', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'text-body font-inter text-[clamp(1rem,1.5vw,1.3125rem)] font-normal text-font-400',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function P3({ className, children, as: Tag = 'p', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-inter text-base font-normal leading-normal text-font-400',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function P4({ className, children, as: Tag = 'p', ...props }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'font-inter text-xs font-normal leading-normal text-font-400',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

type SectionHeadingProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
      {...props}
    >
      {typeof title === 'string' ? <H2>{title}</H2> : title}
      {subtitle && (
        typeof subtitle === 'string' ? (
          <P1
            className={cn(
              align === 'center' ? 'max-w-[858px]' : 'max-w-2xl',
              'text-base lg:text-[clamp(1rem,1.5vw,1.3125rem)]'
            )}
          >
            {subtitle}
          </P1>
        ) : (
          subtitle
        )
      )}
    </div>
  )
}
