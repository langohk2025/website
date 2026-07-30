'use client'

import Image from 'next/image'
import { GraduationCap, Home, School } from 'lucide-react'
import {
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'
import {
  easeDraw,
  springScroll,
  viewportDiagram,
} from '@/lib/motion'
import {
  ecosystemLayout,
  pointsToViewBox,
  resolveConnectorPoints,
  resolveHubTitlePos,
  resolveNodeLabelPos,
  roundedOrthoPath,
  PRODUCT_META,
  type EcosystemLayout,
  type EcosystemNodeId,
  type HubLayout,
  type NodeLayout,
} from '@/data/ecosystem-layout'

export type EcosystemLabels = {
  schoolLabel: string
  homeLabel: string
  schoolTagline: string
  homeTagline: string
  title: string
}

/** Stagger order for product reveals (Apple-like: center hub, then sides, then floating). */
const NODE_DELAY: Record<EcosystemNodeId, number> = {
  dashboard: 0.42,
  class: 0.5,
  school: 0.46,
  mon: 0.54,
  home: 0.62,
  parent: 0.7,
  pub: 0.76,
  'smart-pen': 0.82,
}

function ConnectorLines({
  layout,
  active,
  reduceMotion,
}: {
  layout: EcosystemLayout
  active: boolean
  reduceMotion: boolean | null
}) {
  const paths = layout.connectors
    .map((c) => {
      const pts = resolveConnectorPoints(layout, c)
      if (pts.length < 2) return null
      return roundedOrthoPath(pointsToViewBox(pts), layout.cornerRadius)
    })
    .filter(Boolean) as string[]

  return (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      aria-hidden
    >
      <g
        fill="none"
        stroke="#7A3FA0"
        strokeWidth={layout.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { pathLength: 0, opacity: 0 }
            }
            animate={
              active
                ? reduceMotion
                  ? { opacity: 1 }
                  : { pathLength: 1, opacity: 1 }
                : reduceMotion
                  ? { opacity: 0 }
                  : { pathLength: 0, opacity: 0 }
            }
            transition={
              reduceMotion
                ? { duration: 0.25, delay: 0 }
                : {
                    pathLength: {
                      duration: 0.85,
                      delay: 0.88 + i * 0.06,
                      ease: easeDraw,
                    },
                    opacity: {
                      duration: 0.35,
                      delay: 0.88 + i * 0.06,
                    },
                  }
            }
          />
        ))}
      </g>
    </svg>
  )
}

function ZoneHeader({
  type,
  label,
  x,
  y,
  active,
  delay,
  reduceMotion,
}: {
  type: 'school' | 'home'
  label: string
  x: number
  y: number
  active: boolean
  delay: number
  reduceMotion: boolean | null
}) {
  const isSchool = type === 'school'
  const Icon = isSchool ? School : Home
  // Outer keeps layout (-translate-y-1/2); motion must not own transform here.
  return (
    <div
      className="absolute z-20 flex -translate-y-1/2 items-center gap-[clamp(6px,0.7vw,12px)]"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        className="flex items-center gap-[clamp(6px,0.7vw,12px)]"
        {...enterProps(active, reduceMotion, delay, isSchool ? 'left' : 'right')}
      >
        <span
          className={cn(
            'flex aspect-square w-[clamp(28px,3vw,44px)] items-center justify-center rounded-full',
            isSchool ? 'bg-[#5B2A86]' : 'bg-[#E4198C]',
          )}
        >
          <Icon className="h-[55%] w-[55%] text-white" strokeWidth={2.2} />
        </span>
        <span
          className={cn(
            'font-poppins text-[clamp(15px,1.6vw,24px)] font-extrabold',
            isSchool ? 'text-[#5B2A86]' : 'text-[#B61B78]',
          )}
        >
          {label}
        </span>
      </motion.div>
    </div>
  )
}

function ZoneBanner({ type, children }: { type: 'school' | 'home'; children: React.ReactNode }) {
  const isSchool = type === 'school'
  const Icon = isSchool ? GraduationCap : Home
  const text = String(children).replace(/\n/g, ' ')
  const parts = text
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  const lines =
    parts.length >= 4
      ? [`${parts[0]} ${parts[1]}`, `${parts[2]} ${parts[3]}`]
      : parts.length >= 2
        ? [parts.slice(0, -1).join(' '), parts[parts.length - 1]]
        : [text]

  return (
    <div
      className={cn(
        'absolute bottom-[-4.5%] left-[2%] z-30 flex min-h-[9.5%] w-[96%] items-center gap-[2%] rounded-full px-[2.5%] py-[1.1%] text-white shadow-[0_5px_12px_rgba(74,29,110,0.16)]',
        isSchool ? 'bg-[#5B2A86]' : 'bg-gradient-to-r from-[#CF238F] to-[#E4198C]',
      )}
    >
      <span className="flex aspect-square h-[clamp(22px,55%,34px)] shrink-0 items-center justify-center rounded-full bg-white">
        <Icon
          className={cn('h-[55%] w-[55%]', isSchool ? 'text-[#5B2A86]' : 'text-[#E4198C]')}
          strokeWidth={2.2}
        />
      </span>
      <p className="min-w-0 flex-1 font-poppins text-[clamp(8px,0.78vw,12px)] font-semibold leading-[1.25] tracking-[-0.015em] text-white antialiased">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  )
}

function HubBlock({
  hub,
  title,
  selected,
  onPointerDown,
  active,
  reduceMotion,
}: {
  hub: HubLayout
  title: string
  selected?: boolean
  onPointerDown?: (e: React.PointerEvent) => void
  active: boolean
  reduceMotion: boolean | null
}) {
  const titlePos = resolveHubTitlePos(hub)
  return (
    <>
      {/* Position shell keeps -translate-x-1/2; animate only the inner. */}
      <div
        className={cn(
          'absolute z-30 flex -translate-x-1/2 flex-col items-center px-1',
          onPointerDown && 'cursor-grab touch-none active:cursor-grabbing',
          selected && 'rounded-xl ring-2 ring-brand-400 ring-offset-2 ring-offset-[#F4EFF9]',
        )}
        style={{ left: `${hub.x}%`, top: `${hub.y}%`, width: `${hub.w}%` }}
        onPointerDown={
          onPointerDown
            ? (e) => {
                e.preventDefault()
                onPointerDown(e)
              }
            : undefined
        }
      >
        <motion.div
          className="w-full"
          {...enterProps(active, reduceMotion, 0.18, 'scale')}
        >
          <div className="relative w-full" style={{ height: `${hub.logoH}cqh` }}>
            <Image
              src="/Lango_Logo.svg"
              alt="Lango"
              width={220}
              height={220}
              className="pointer-events-none mx-auto h-full w-auto"
              priority
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
      <div
        className="pointer-events-none absolute z-30 max-w-[380px] -translate-x-1/2"
        style={{ left: `${titlePos.x}%`, top: `${titlePos.y}%` }}
      >
        <motion.h3
          className="whitespace-pre-line text-center font-poppins text-[clamp(18px,2.2vw,36px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#4A1D6E]"
          {...enterProps(active, reduceMotion, 0.28, 'up')}
        >
          {title.replace(' EcoSystem', '\nEcoSystem')}
        </motion.h3>
      </div>
    </>
  )
}

function ProductNode({
  node,
  selected,
  onPointerDown,
  active,
  reduceMotion,
}: {
  node: NodeLayout
  selected?: boolean
  onPointerDown?: (e: React.PointerEvent, id: EcosystemNodeId) => void
  active: boolean
  reduceMotion: boolean | null
}) {
  const meta = PRODUCT_META[node.id]
  const labelPos = resolveNodeLabelPos(node)
  const delay = NODE_DELAY[node.id] ?? 0.5
  return (
    <>
      <div
        className={cn(
          'absolute z-20 flex flex-col items-center',
          onPointerDown && 'cursor-grab touch-none active:cursor-grabbing',
          selected && 'rounded-lg ring-2 ring-brand-400 ring-offset-2 ring-offset-[#F4EFF9]',
        )}
        style={{ left: `${node.x}%`, top: `${node.y}%`, width: `${node.w}%` }}
        onPointerDown={
          onPointerDown
            ? (e) => {
                e.preventDefault()
                onPointerDown(e, node.id)
              }
            : undefined
        }
      >
        <motion.div
          className="w-full"
          {...enterProps(active, reduceMotion, delay, 'scale')}
        >
          <div
            className="relative flex w-full items-center justify-center"
            style={{ height: `${node.h}cqh` }}
          >
            <Image
              src={meta.src}
              alt={meta.label}
              width={320}
              height={320}
              className="pointer-events-none h-full w-auto max-w-full object-contain drop-shadow-[0_8px_16px_rgba(74,29,110,0.16)]"
              unoptimized
              draggable={false}
            />
          </div>
        </motion.div>
      </div>
      <div
        className="pointer-events-none absolute z-20 -translate-x-1/2"
        style={{ left: `${labelPos.x}%`, top: `${labelPos.y}%` }}
      >
        <motion.p
          className={cn(
            'whitespace-nowrap text-center font-poppins text-[clamp(11px,1.05vw,15px)] font-bold leading-tight',
            meta.branch === 'school' ? 'text-[#5B2A86]' : 'text-[#B61B78]',
          )}
          {...enterProps(active, reduceMotion, delay + 0.08, 'up')}
        >
          {meta.label}
        </motion.p>
      </div>
    </>
  )
}

function enterProps(
  active: boolean,
  reduceMotion: boolean | null,
  delay: number,
  direction: 'up' | 'left' | 'right' | 'scale' = 'up',
) {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: active ? { opacity: 1 } : { opacity: 0 },
      transition: { duration: 0.25, delay: 0 },
    }
  }

  const hidden =
    direction === 'left'
      ? { opacity: 0, x: -40 }
      : direction === 'right'
        ? { opacity: 0, x: 40 }
        : direction === 'scale'
          ? { opacity: 0, y: 18, scale: 0.96 }
          : { opacity: 0, y: 28 }

  const visible =
    direction === 'left' || direction === 'right'
      ? { opacity: 1, x: 0 }
      : direction === 'scale'
        ? { opacity: 1, y: 0, scale: 1 }
        : { opacity: 1, y: 0 }

  return {
    initial: hidden,
    animate: active ? visible : hidden,
    transition: { ...springScroll, delay },
  }
}

/** Shared desktop canvas used by homepage + `/ecosystem-edit`. */
export function EcosystemCanvas({
  layout = ecosystemLayout,
  labels,
  className,
  interactive,
  selectedId,
  onSelect,
  onHubPointerDown,
  onNodePointerDown,
  animateOnScroll = true,
}: {
  layout?: EcosystemLayout
  labels: EcosystemLabels
  className?: string
  interactive?: boolean
  selectedId?: string | null
  onSelect?: (id: string | null) => void
  onHubPointerDown?: (e: React.PointerEvent) => void
  onNodePointerDown?: (e: React.PointerEvent, id: EcosystemNodeId) => void
  /** Apple-style staged reveal when scrolled into view (off for editor). */
  animateOnScroll?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, viewportDiagram)
  const active = !animateOnScroll || interactive ? true : inView

  return (
    <div
      ref={ref}
      className={cn(
        'relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-[#DDCDEB] bg-[#F4EFF9] [container-type:size]',
        className,
      )}
      onPointerDown={
        interactive
          ? (e) => {
              if (e.target === e.currentTarget) onSelect?.(null)
            }
          : undefined
      }
    >
      <motion.div
        className="pointer-events-none absolute z-0 rounded-[3%] border border-[#CDB6E1] bg-[#FBF8FE] shadow-[0_6px_18px_rgba(91,42,134,0.05)]"
        style={{
          left: `${layout.zoneBoxes.school.x}%`,
          top: `${layout.zoneBoxes.school.y}%`,
          width: `${layout.zoneBoxes.school.w}%`,
          height: `${layout.zoneBoxes.school.h}%`,
        }}
        {...enterProps(active, reduceMotion, 0.05, 'left')}
      >
        <ZoneBanner type="school">{labels.schoolTagline}</ZoneBanner>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute z-0 rounded-[3%] border border-[#F2B9DA] bg-[#FFF8FC] shadow-[0_6px_18px_rgba(228,25,140,0.05)]"
        style={{
          left: `${layout.zoneBoxes.home.x}%`,
          top: `${layout.zoneBoxes.home.y}%`,
          width: `${layout.zoneBoxes.home.w}%`,
          height: `${layout.zoneBoxes.home.h}%`,
        }}
        {...enterProps(active, reduceMotion, 0.08, 'right')}
      >
        <ZoneBanner type="home">{labels.homeTagline}</ZoneBanner>
      </motion.div>

      <ZoneHeader
        type="school"
        label={labels.schoolLabel}
        x={layout.zoneHeaders.school.x}
        y={layout.zoneHeaders.school.y}
        active={active}
        delay={0.22}
        reduceMotion={reduceMotion}
      />
      <ZoneHeader
        type="home"
        label={labels.homeLabel}
        x={layout.zoneHeaders.home.x}
        y={layout.zoneHeaders.home.y}
        active={active}
        delay={0.24}
        reduceMotion={reduceMotion}
      />

      <ConnectorLines
        layout={layout}
        active={active}
        reduceMotion={reduceMotion}
      />

      <HubBlock
        hub={layout.hub}
        title={labels.title}
        selected={selectedId === 'hub'}
        active={active}
        reduceMotion={reduceMotion}
        onPointerDown={
          interactive
            ? (e) => {
                e.stopPropagation()
                onSelect?.('hub')
                onHubPointerDown?.(e)
              }
            : undefined
        }
      />

      {layout.nodes.map((node) => (
        <ProductNode
          key={node.id}
          node={node}
          selected={selectedId === node.id}
          active={active}
          reduceMotion={reduceMotion}
          onPointerDown={
            interactive
              ? (e, id) => {
                  e.stopPropagation()
                  onSelect?.(id)
                  onNodePointerDown?.(e, id)
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}

export default function EcosystemDiagram() {
  const { t } = useLanguage()
  const labels: EcosystemLabels = {
    title: t('home.about.ecosystem.title'),
    schoolLabel: t('home.about.ecosystem.school'),
    homeLabel: t('home.about.ecosystem.home'),
    schoolTagline: t('home.about.ecosystem.school_tagline'),
    homeTagline: t('home.about.ecosystem.home_tagline'),
  }

  return (
    <div role="img" aria-label={t('home.about.image_alt')}>
      <EcosystemCanvas layout={ecosystemLayout} labels={labels} animateOnScroll />
    </div>
  )
}
