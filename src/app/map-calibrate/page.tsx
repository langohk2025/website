'use client'

import Image from 'next/image'
import { useCallback, useMemo, useState } from 'react'

const STEPS = [
  { id: 'hk', label: 'Hong Kong' },
  { id: 'jp', label: 'Japan' },
  { id: 'th', label: 'Thailand' },
  { id: 'my', label: 'Malaysia' },
  { id: 'sg', label: 'Singapore' },
  { id: 'id', label: 'Indonesia' },
] as const

type StepId = (typeof STEPS)[number]['id']

type Point = { x: number; y: number }

const LABEL_SIDE: Record<StepId, 'left' | 'right' | 'top'> = {
  hk: 'right',
  jp: 'left',
  th: 'left',
  my: 'left',
  sg: 'right',
  id: 'right',
}
export default function MapCalibratePage() {
  const [step, setStep] = useState(0)
  const [points, setPoints] = useState<Partial<Record<StepId, Point>>>({})

  const current = STEPS[step]
  const done = step >= STEPS.length

  const onMapClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (done || !current) return
      const rect = event.currentTarget.getBoundingClientRect()
      const x = +(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)
      const y = +(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)
      setPoints((prev) => ({ ...prev, [current.id]: { x, y } }))
      setStep((s) => s + 1)
    },
    [current, done]
  )

  const code = useMemo(() => {
    const lines = STEPS.map(({ id }) => {
      const p = points[id]
      if (!p) return `  // { id: '${id}', x: ?, y: ?, labelSide: '${LABEL_SIDE[id]}' },`
      return `  { id: '${id}', x: ${p.x}, y: ${p.y}, labelSide: '${LABEL_SIDE[id]}' },`
    })
    return `const regions = [\n${lines.join('\n')}\n]`
  }, [points])

  return (
    <main className="min-h-screen bg-bg-500 px-4 py-10 text-font-600">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="font-poppins text-2xl font-semibold">Map pin calibrator</h1>
        <p className="mt-2 max-w-2xl font-inter text-sm text-font-500">
          Click the exact spot on the map for each country, in order. When finished, copy the
          generated coordinates and send them in chat (or paste into{' '}
          <code className="rounded bg-white/70 px-1">AsiaMap.tsx</code>).
        </p>

        <div className="mt-6 rounded-2xl border border-[rgba(199,126,185,0.25)] bg-white/70 p-4 backdrop-blur">
          {!done ? (
            <p className="font-poppins text-lg font-medium">
              Step {step + 1}/{STEPS.length}: click{' '}
              <span className="text-brand-500">{current.label}</span>
            </p>
          ) : (
            <p className="font-poppins text-lg font-medium text-brand-500">
              Done — copy the code below.
            </p>
          )}

          <ol className="mt-3 flex flex-wrap gap-2">
            {STEPS.map((s, i) => {
              const p = points[s.id]
              return (
                <li
                  key={s.id}
                  className={`rounded-full px-3 py-1 font-inter text-xs ${
                    p ? 'bg-brand-500 text-white' : i === step ? 'bg-brand-300 text-font-600' : 'bg-bg-400 text-font-400'
                  }`}
                >
                  {s.label}
                  {p ? ` (${p.x}, ${p.y})` : ''}
                </li>
              )
            })}
          </ol>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="rounded-full bg-font-500 px-4 py-2 font-inter text-sm text-white"
              onClick={() => {
                setStep(0)
                setPoints({})
              }}
            >
              Reset
            </button>
            {step > 0 && !done && (
              <button
                type="button"
                className="rounded-full border border-font-200 bg-white px-4 py-2 font-inter text-sm"
                onClick={() => {
                  const prev = STEPS[step - 1]
                  setPoints((p) => {
                    const next = { ...p }
                    delete next[prev.id]
                    return next
                  })
                  setStep((s) => s - 1)
                }}
              >
                Undo last
              </button>
            )}
          </div>
        </div>

        <div
          className="relative mt-6 cursor-crosshair overflow-hidden rounded-[28px] ring-2 ring-brand-400/40"
          onClick={onMapClick}
        >
          <Image
            src="/figma/asia-map-base.png"
            alt="Asia map for calibration"
            width={1536}
            height={1024}
            className="h-auto w-full select-none"
            draggable={false}
            priority
          />

          {STEPS.map((s) => {
            const p = points[s.id]
            if (!p) return null
            return (
              <div
                key={s.id}
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span className="block size-4 rounded-full bg-brand-500 ring-[3px] ring-white" />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 font-poppins text-[11px] font-semibold shadow">
                  {s.id} {p.x},{p.y}
                </span>
              </div>
            )
          })}
        </div>

        <pre className="mt-6 overflow-x-auto rounded-2xl bg-[#310f32] p-4 font-mono text-sm text-[#f4eef2]">
          {code}
        </pre>
      </div>
    </main>
  )
}
