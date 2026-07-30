/** Apple-style spring presets: critically damped by default, bounce only for momentum. */
export const springSnappy = { type: 'spring' as const, bounce: 0, duration: 0.45 }
export const springUI = { type: 'spring' as const, bounce: 0, duration: 0.4 }
export const springDrawer = { type: 'spring' as const, bounce: 0.15, duration: 0.35 }
/** Slightly longer settle for scroll-enter story moments (Apple response ~0.5s). */
export const springScroll = { type: 'spring' as const, bounce: 0, duration: 0.55 }

export const easeOut = [0.23, 1, 0.32, 1] as const
export const easeInOut = [0.77, 0, 0.175, 1] as const
/** Soft draw for SVG connectors — ease-out, no bounce. */
export const easeDraw = [0.22, 1, 0.36, 1] as const

/** Trigger when ~18% of the element is visible — Apple-like scroll reveal timing. */
export const viewportEnter = {
  once: true,
  amount: 0.18,
  margin: '0px 0px -10% 0px' as const,
}

/** Diagram choreography: wait until a meaningful slice is on screen. */
export const viewportDiagram = {
  once: true,
  amount: 0.28,
  margin: '0px 0px -8% 0px' as const,
}

export const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export const revealLeftVariants = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0 },
}

export const revealRightVariants = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0 },
}

export const revealScaleVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export const revealReducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export type RevealDirection = 'up' | 'left' | 'right' | 'scale'

export function getRevealVariants(
  direction: RevealDirection,
  reduceMotion: boolean | null
) {
  if (reduceMotion) return revealReducedVariants

  switch (direction) {
    case 'left':
      return revealLeftVariants
    case 'right':
      return revealRightVariants
    case 'scale':
      return revealScaleVariants
    default:
      return revealVariants
  }
}
