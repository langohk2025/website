'use client'

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion'
import { type ComponentProps, type ReactNode } from 'react'
import {
  getRevealVariants,
  springSnappy,
  viewportEnter,
  type RevealDirection,
} from '@/lib/motion'
import { cn } from '@/lib/utils'

type RevealProps = HTMLMotionProps<'div'> & {
  children: ReactNode
  delay?: number
  direction?: RevealDirection
}

/** Scroll-triggered entrance — once only, respects reduced motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  ...props
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const variants: Variants = getRevealVariants(direction, reduceMotion)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportEnter}
      transition={{ ...springSnappy, delay }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
}: StaggerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportEnter}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : stagger,
            delayChildren: reduceMotion ? 0 : delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
  direction?: RevealDirection
}

export function StaggerItem({
  children,
  className,
  direction = 'up',
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion()
  const variants: Variants = getRevealVariants(direction, reduceMotion)

  return (
    <motion.div variants={variants} transition={springSnappy} className={className}>
      {children}
    </motion.div>
  )
}

type PressableLinkProps = ComponentProps<'a'> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function PressableLink({
  className,
  variant = 'primary',
  children,
  ...props
}: PressableLinkProps) {
  return (
    <motion.a
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'pressable inline-flex items-center justify-center',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        variant === 'ghost' && 'btn-ghost',
        className
      )}
      {...(props as HTMLMotionProps<'a'>)}
    >
      {children}
    </motion.a>
  )
}

export function PressableButton({
  className,
  children,
  ...props
}: ComponentProps<'button'>) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
      className={cn('pressable', className)}
      {...(props as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  )
}
