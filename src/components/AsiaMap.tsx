'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  revealReducedVariants,
  revealScaleVariants,
  revealVariants,
  springDrawer,
  springScroll,
  springSnappy,
  viewportDiagram,
} from '@/lib/motion'
import { cn } from '@/lib/utils'

type RegionId = 'hk' | 'jp' | 'th' | 'my' | 'sg' | 'id'

type Region = {
  id: RegionId
  /** % of the map IMAGE box (not the outer card) */
  x: number
  y: number
  labelSide: 'left' | 'right' | 'top'
}

/**
 * Percentages relative to asia-map-base.png.
 * Calibrated via /map-calibrate
 */
const regions: Region[] = [
  { id: 'hk', x: 52.4, y: 45.3, labelSide: 'right' },
  { id: 'jp', x: 72, y: 29.8, labelSide: 'left' },
  { id: 'th', x: 38.2, y: 53.7, labelSide: 'left' },
  { id: 'my', x: 38.7, y: 70.7, labelSide: 'left' },
  { id: 'sg', x: 40, y: 74.1, labelSide: 'right' },
  { id: 'id', x: 38.7, y: 79.3, labelSide: 'right' },
]

const pinVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
}

export default function AsiaMap() {
  const { t } = useLanguage()
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<RegionId | null>(null)
  const [hovered, setHovered] = useState<RegionId | null>(null)
  const labelId = useId()

  const isInView = useInView(rootRef, { once: true, amount: 0.2 })
  const focus = active ?? hovered

  const mapVariants = reduceMotion ? revealReducedVariants : revealScaleVariants
  const pinMotionVariants = reduceMotion ? revealReducedVariants : pinVariants
  const captionVariants = reduceMotion ? revealReducedVariants : revealVariants

  useEffect(() => {
    if (!active) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setActive(null)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [active])

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[1100px]">
      <motion.div
        animate={
          isInView && !reduceMotion ? { y: [0, -4, 0] } : undefined
        }
        transition={
          isInView && !reduceMotion
            ? { duration: 7.5, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
        className="relative"
      >
        <div className="overflow-hidden rounded-[24px] bg-gradient-to-b from-[#f3e7ff] to-[#fff6fb] shadow-[0_28px_64px_-30px_rgba(104,50,102,0.32)] ring-1 ring-[rgba(199,126,185,0.2)] lg:rounded-[36px]">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={viewportDiagram}
            variants={captionVariants}
            transition={springScroll}
            className="px-5 pt-5 text-center font-inter text-base leading-relaxed text-font-500 lg:px-12 lg:pt-8 lg:text-base"
          >
            {t('home.asia.caption')}
          </motion.p>

          <div className="mx-auto w-full max-w-[1000px] px-1 pb-2 pt-1 sm:px-4 sm:pb-4">
            {/*
              Pins MUST sit on this wrapper — it sizes to the real <img>,
              so left/top % match image pixels (no fill/object-contain drift).
            */}
            <motion.div
              ref={mapRef}
              className="relative w-full"
              initial="hidden"
              whileInView="visible"
              viewport={viewportDiagram}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduceMotion ? 0 : 0.09,
                    delayChildren: reduceMotion ? 0 : 0.12,
                  },
                },
              }}
            >
              <motion.div variants={mapVariants} transition={springScroll}>
                <Image
                  src="/figma/asia-map-base.png"
                  alt={t('home.asia.map_alt')}
                  width={1536}
                  height={1024}
                  sizes="(max-width: 1100px) 100vw, 1000px"
                  className="block h-auto w-full select-none"
                  priority={false}
                  draggable={false}
                />
              </motion.div>

              {regions.map((region, index) => {
                const isOn = focus === region.id
                const name = t(`home.asia.country.${region.id}.name`)

                return (
                  <motion.div
                    key={region.id}
                    className="absolute z-10"
                    style={{ left: `${region.x}%`, top: `${region.y}%` }}
                    variants={pinMotionVariants}
                    transition={springSnappy}
                    onMouseEnter={() => setHovered(region.id)}
                    onMouseLeave={() => setHovered((h) => (h === region.id ? null : h))}
                  >
                    <button
                      type="button"
                      aria-expanded={isOn}
                      aria-controls={`${labelId}-${region.id}`}
                      aria-label={name}
                      className={cn(
                        'relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center',
                        'size-12 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60'
                      )}
                      onFocus={() => setHovered(region.id)}
                      onClick={() => setActive((a) => (a === region.id ? null : region.id))}
                    >
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-[-40%] rounded-full bg-brand-500/25 blur-2xl"
                        initial={false}
                        animate={{ opacity: isOn ? 1 : 0, scale: isOn ? 1 : 0.6 }}
                        transition={springSnappy}
                      />

                      {isInView && !reduceMotion && (
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute size-5 rounded-full border-2 border-brand-500/50 sm:size-6"
                          animate={
                            isOn
                              ? { opacity: 0, scale: 1.8 }
                              : { opacity: [0.55, 0, 0.55], scale: [1, 1.7, 1] }
                          }
                          transition={
                            isOn
                              ? { duration: 0.28 }
                              : {
                                  duration: 2.4,
                                  repeat: Infinity,
                                  delay: index * 0.22,
                                  ease: 'easeInOut',
                                }
                          }
                        />
                      )}

                      <motion.span
                        aria-hidden
                        className="relative block size-3 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 shadow-[0_4px_12px_rgba(201,44,151,0.45)] ring-[3px] ring-white sm:size-3.5"
                        animate={{ scale: isOn ? 1.22 : 1 }}
                        transition={springSnappy}
                        whileTap={{ scale: 0.9 }}
                      />

                      <span
                        className={cn(
                          'pointer-events-none absolute whitespace-nowrap rounded-full px-2.5 py-1',
                          'bg-white/85 font-poppins text-[11px] font-semibold text-font-600 shadow-sm backdrop-blur-sm sm:text-xs',
                          'ring-1 ring-[rgba(199,126,185,0.2)]',
                          region.labelSide === 'right' &&
                            'left-[calc(100%+6px)] top-1/2 -translate-y-1/2',
                          region.labelSide === 'left' &&
                            'right-[calc(100%+6px)] top-1/2 -translate-y-1/2',
                          region.labelSide === 'top' &&
                            'bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2',
                          focus && !isOn && 'opacity-40',
                          isOn && 'bg-white text-font-600 ring-brand-300/50'
                        )}
                      >
                        {name}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isOn && (
                        <div className="pointer-events-none absolute bottom-full left-0 z-30 mb-3 -translate-x-1/2">
                          <motion.div
                            id={`${labelId}-${region.id}`}
                            role="tooltip"
                            initial={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.92 }
                            }
                            animate={{ opacity: 1, scale: 1 }}
                            exit={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.96 }
                            }
                            transition={springDrawer}
                            style={{ transformOrigin: 'bottom center' }}
                            className={cn(
                              'w-[min(240px,72vw)] rounded-2xl border border-white/85 bg-[#fefcff]/96 px-4 py-3 text-left',
                              'shadow-[0_18px_44px_rgba(104,50,102,0.2)] backdrop-blur-md'
                            )}
                          >
                            <p className="font-poppins text-sm font-semibold text-font-600">
                              {t(`home.asia.country.${region.id}.name`)}
                            </p>
                            <p className="mt-1 font-inter text-xs leading-snug text-font-500">
                              {t(`home.asia.country.${region.id}.blurb`)}
                            </p>
                            <p className="mt-2 font-poppins text-xs font-medium text-brand-500">
                              {t(`home.asia.country.${region.id}.learners`)}
                            </p>
                            <span
                              aria-hidden
                              className="absolute left-1/2 top-full -translate-x-1/2 border-x-[7px] border-t-[8px] border-x-transparent border-t-[#fefcff]/96"
                            />
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={viewportDiagram}
        variants={captionVariants}
        transition={{ ...springScroll, delay: reduceMotion ? 0 : 0.55 }}
        className="mt-4 text-center font-inter text-xs text-font-400 sm:text-sm"
      >
        {t('home.asia.map_hint')}
      </motion.p>
    </div>
  )
}
