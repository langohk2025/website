'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { GraduationCap, Home, School, ZoomIn, ZoomOut } from 'lucide-react'
import {
  bakeConnectorPoints,
  defaultEcosystemLayout,
  ecosystemLayout,
  enforceOrthoPoints,
  formatEcosystemLayoutTs,
  insertOrthoBend,
  moveOrthoPoint,
  pointsToViewBox,
  PRODUCT_META,
  resolveConnectorPoints,
  resolveHubTitlePos,
  resolveNodeLabelPos,
  roundedOrthoPath,
  type ConnectorDef,
  type EcosystemLayout,
  type EcosystemNodeId,
  type NodeLayout,
  type PointPct,
} from '@/data/ecosystem-layout'
import { cn } from '@/lib/utils'

type NodeDragKind = 'hub' | EcosystemNodeId
type ZoneKey = 'school' | 'home'
type ZoneDragKind = `zone-${ZoneKey}`
type LineMoveKind = `line-move-${number}`
type LineSegKind = `line-seg-${number}-${number}`
type LinePointKind = `line-point-${number}-${number}`
type TextDragKind =
  | `label-${EcosystemNodeId}`
  | 'hub-title'
  | 'school-header'
  | 'home-header'
type ResizeCorner = 'nw' | 'ne' | 'sw' | 'se'
type ResizeDragKind = `resize-${ResizeCorner}`
type DragKind =
  | NodeDragKind
  | ZoneDragKind
  | LineMoveKind
  | LineSegKind
  | LinePointKind
  | TextDragKind
  | ResizeDragKind
  | 'pan'

type DragState = {
  kind: DragKind
  startX: number
  startY: number
  originX: number
  originY: number
  originW?: number
  originH?: number
  /** Snapshot of points when starting a line drag */
  originPoints?: PointPct[]
  segIndex?: number
  segAxis?: 'h' | 'v'
  /** End segment can stretch (lengthen) along its axis */
  stretchIndex?: number
  canvasW: number
  canvasH: number
  panOriginX?: number
  panOriginY?: number
  selectedId?: string
}

type GuideLines = { v: number[]; h: number[] }

const LABELS = {
  title: 'Lango 3.0 EcoSystem',
  schoolLabel: 'School',
  homeLabel: 'Home',
  schoolTagline:
    'Designed for Teachers. Built for Classrooms. Teach Smarter. Learn Better.',
  homeTagline:
    'Designed for Families. Built for Everyday Learning. Learn Anytime. Grow Together.',
}

const SNAP_PX = 1.2
const MIN_ZOOM = 0.4
const MAX_ZOOM = 2.5

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function bannerLines(text: string): [string, string] | [string] {
  const parts = text
    .replace(/\n/g, ' ')
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (parts.length >= 4) {
    return [`${parts[0]} ${parts[1]}`, `${parts[2]} ${parts[3]}`]
  }
  if (parts.length >= 2) {
    return [parts.slice(0, -1).join(' '), parts[parts.length - 1]]
  }
  return [text]
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

function cloneLayout(layout: EcosystemLayout): EcosystemLayout {
  return structuredClone(layout)
}

function isLineMoveKind(kind: string): kind is LineMoveKind {
  return kind.startsWith('line-move-')
}

function isLineSegKind(kind: string): kind is LineSegKind {
  return kind.startsWith('line-seg-')
}

function isLinePointKind(kind: string): kind is LinePointKind {
  return kind.startsWith('line-point-')
}

function isResizeKind(kind: string): kind is ResizeDragKind {
  return kind.startsWith('resize-')
}

function isZoneDragKind(kind: string): kind is ZoneDragKind {
  return kind === 'zone-school' || kind === 'zone-home'
}

function zoneSelectedId(key: ZoneKey) {
  return `zone:${key}`
}

function parseZoneKey(selectedId: string | null): ZoneKey | null {
  if (!selectedId?.startsWith('zone:')) return null
  const key = selectedId.slice(5) as ZoneKey
  return key === 'school' || key === 'home' ? key : null
}

function zoneKeyFromDrag(kind: ZoneDragKind): ZoneKey {
  return kind === 'zone-school' ? 'school' : 'home'
}

function isTextDragKind(kind: string): kind is TextDragKind {
  return (
    kind === 'hub-title' ||
    kind === 'school-header' ||
    kind === 'home-header' ||
    kind.startsWith('label-')
  )
}

function textSelectedId(kind: TextDragKind) {
  return `text:${kind}`
}

function parseTextKind(selectedId: string | null): TextDragKind | null {
  if (!selectedId?.startsWith('text:')) return null
  return selectedId.slice(5) as TextDragKind
}

function lineSelectedId(index: number) {
  return `line:${index}`
}

function parseLineIndex(selectedId: string | null): number | null {
  if (!selectedId?.startsWith('line:')) return null
  const n = Number(selectedId.slice(5))
  return Number.isFinite(n) ? n : null
}

function connectorLabel(c: ConnectorDef) {
  const from = c.from === 'hub' ? 'Hub' : PRODUCT_META[c.from]?.label ?? c.from
  const to = PRODUCT_META[c.to]?.label ?? c.to
  return `${from} → ${to}`
}

function collectSnapTargets(
  layout: EcosystemLayout,
  excludeId: string | null,
): { xs: number[]; ys: number[] } {
  const xs = [0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100]
  const ys = [0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100]

  xs.push(layout.hub.x)
  ys.push(layout.hub.y, layout.hub.y + layout.hub.logoH)
  const title = resolveHubTitlePos(layout.hub)
  xs.push(title.x)
  ys.push(title.y)
  xs.push(layout.zoneHeaders.school.x, layout.zoneHeaders.home.x)
  ys.push(layout.zoneHeaders.school.y, layout.zoneHeaders.home.y)
  for (const box of [layout.zoneBoxes.school, layout.zoneBoxes.home]) {
    xs.push(box.x, box.x + box.w / 2, box.x + box.w)
    ys.push(box.y, box.y + box.h / 2, box.y + box.h)
  }

  for (const node of layout.nodes) {
    if (node.id === excludeId) continue
    xs.push(node.x, node.x + node.w / 2, node.x + node.w)
    ys.push(node.y, node.y + node.h / 2, node.y + node.h)
    const label = resolveNodeLabelPos(node)
    xs.push(label.x)
    ys.push(label.y)
  }

  for (const c of layout.connectors) {
    for (const p of resolveConnectorPoints(layout, c)) {
      xs.push(p.x)
      ys.push(p.y)
    }
  }

  return { xs, ys }
}

function snapAxis(
  value: number,
  targets: number[],
  threshold = SNAP_PX,
): { value: number; guide: number | null } {
  let best = value
  let guide: number | null = null
  let bestDist = threshold
  for (const t of targets) {
    const d = Math.abs(value - t)
    if (d <= bestDist) {
      bestDist = d
      best = t
      guide = t
    }
  }
  return { value: round1(best), guide }
}

/** Distance from point to segment in canvas % space. */
function distToSegment(px: number, py: number, a: PointPct, b: PointPct) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len2 = dx * dx + dy * dy
  if (len2 < 1e-6) return Math.hypot(px - a.x, py - a.y)
  let t = ((px - a.x) * dx + (py - a.y) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy))
}

function nearestSegmentIndex(pts: PointPct[], x: number, y: number) {
  let best = 0
  let bestD = Infinity
  for (let i = 0; i < pts.length - 1; i++) {
    const d = distToSegment(x, y, pts[i], pts[i + 1])
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return best
}

type PreviewMode = 'desktop' | 'mobile'

export default function EcosystemEditPage() {
  const [layout, setLayout] = useState<EcosystemLayout>(() =>
    cloneLayout(ecosystemLayout),
  )
  const [history, setHistory] = useState<EcosystemLayout[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [spaceDown, setSpaceDown] = useState(false)
  const [preview, setPreview] = useState<PreviewMode>('desktop')
  const [guides, setGuides] = useState<GuideLines>({ v: [], h: [] })

  const viewportRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const layoutRef = useRef(layout)
  const panRef = useRef(pan)
  layoutRef.current = layout
  panRef.current = pan

  const code = useMemo(() => formatEcosystemLayoutTs(layout), [layout])
  const selectedLineIndex = parseLineIndex(selectedId)
  const selectedConnector =
    selectedLineIndex !== null ? layout.connectors[selectedLineIndex] : null
  const selectedLinePoints =
    selectedLineIndex !== null
      ? resolveConnectorPoints(layout, layout.connectors[selectedLineIndex])
      : null
  const selectedZoneKey = parseZoneKey(selectedId)
  const selectedZone = selectedZoneKey ? layout.zoneBoxes[selectedZoneKey] : null
  const selectedNode: NodeLayout | null =
    selectedId &&
    selectedId !== 'hub' &&
    !selectedId.startsWith('line:') &&
    !selectedId.startsWith('text:') &&
    !selectedId.startsWith('zone:')
      ? layout.nodes.find((n) => n.id === selectedId) ?? null
      : null

  const pushHistory = useCallback((prev: EcosystemLayout) => {
    setHistory((h) => [...h.slice(-39), cloneLayout(prev)])
  }, [])

  const endDrag = useCallback(() => {
    dragRef.current = null
    setDragging(false)
    setGuides({ v: [], h: [] })
  }, [])

  const boardRect = () => boardRef.current?.getBoundingClientRect() ?? null

  const applyDrag = useCallback((clientX: number, clientY: number) => {
    const drag = dragRef.current
    if (!drag) return

    const dxPct = ((clientX - drag.startX) / drag.canvasW) * 100
    const dyPct = ((clientY - drag.startY) / drag.canvasH) * 100

    if (drag.kind === 'pan') {
      setPan({
        x: (drag.panOriginX ?? 0) + (clientX - drag.startX),
        y: (drag.panOriginY ?? 0) + (clientY - drag.startY),
      })
      return
    }

    setLayout((prev) => {
      const next = cloneLayout(prev)
      const nextGuides: GuideLines = { v: [], h: [] }

      if (isTextDragKind(drag.kind)) {
        let x = round1(drag.originX + dxPct)
        let y = round1(drag.originY + dyPct)
        const targets = collectSnapTargets(next, null)
        const sx = snapAxis(x, targets.xs)
        const sy = snapAxis(y, targets.ys)
        x = sx.value
        y = sy.value
        if (sx.guide !== null) nextGuides.v.push(sx.guide)
        if (sy.guide !== null) nextGuides.h.push(sy.guide)

        if (drag.kind === 'hub-title') {
          next.hub.titleX = x
          next.hub.titleY = y
        } else if (drag.kind === 'school-header') {
          next.zoneHeaders.school = { x, y }
        } else if (drag.kind === 'home-header') {
          next.zoneHeaders.home = { x, y }
        } else if (drag.kind.startsWith('label-')) {
          const nodeId = drag.kind.slice('label-'.length) as EcosystemNodeId
          const node = next.nodes.find((n) => n.id === nodeId)
          if (!node) return prev
          node.labelX = x
          node.labelY = y
        }
        setGuides(nextGuides)
        return next
      }

      if (isLineMoveKind(drag.kind)) {
        const index = Number(drag.kind.slice('line-move-'.length))
        const origin = drag.originPoints
        if (!origin || !next.connectors[index]) return prev
        next.connectors[index] = {
          ...next.connectors[index],
          points: enforceOrthoPoints(
            origin.map((p) => ({
              x: round1(p.x + dxPct),
              y: round1(p.y + dyPct),
            })),
          ),
        }
        setGuides({ v: [], h: [] })
        return next
      }

      if (isLineSegKind(drag.kind)) {
        const parts = drag.kind.split('-')
        const index = Number(parts[2])
        const segIndex = drag.segIndex ?? Number(parts[3])
        const origin = drag.originPoints
        const axis = drag.segAxis
        if (!origin || !next.connectors[index] || axis == null) return prev
        if (segIndex < 0 || segIndex >= origin.length - 1) return prev

        const targets = collectSnapTargets(next, null)
        const nextGuidesLocal: GuideLines = { v: [], h: [] }
        const isFirstSeg = segIndex === 0
        const isLastSeg = segIndex === origin.length - 2
        const along = axis === 'h' ? dxPct : dyPct
        const perp = axis === 'h' ? dyPct : dxPct

        // On end segments: drag along the segment → lengthen/shorten that free end
        if (
          (isFirstSeg || isLastSeg) &&
          Math.abs(along) >= Math.abs(perp)
        ) {
          const stretchIndex =
            drag.stretchIndex ?? (isFirstSeg ? 0 : origin.length - 1)
          const originPt = origin[stretchIndex]
          let x = originPt.x + (axis === 'h' ? dxPct : 0)
          let y = originPt.y + (axis === 'v' ? dyPct : 0)
          if (axis === 'h') {
            const sx = snapAxis(x, targets.xs)
            x = sx.value
            if (sx.guide !== null) nextGuidesLocal.v.push(sx.guide)
          } else {
            const sy = snapAxis(y, targets.ys)
            y = sy.value
            if (sy.guide !== null) nextGuidesLocal.h.push(sy.guide)
          }
          next.connectors[index] = {
            ...next.connectors[index],
            points: moveOrthoPoint(origin, stretchIndex, { x, y }),
          }
          setGuides(nextGuidesLocal)
          return next
        }

        // Otherwise reshape bend (move segment perpendicular)
        const pts = origin.map((p) => ({ ...p }))
        if (axis === 'h') {
          let y = origin[segIndex].y + dyPct
          const sy = snapAxis(y, targets.ys)
          y = sy.value
          if (sy.guide !== null) nextGuidesLocal.h.push(sy.guide)
          pts[segIndex] = { ...pts[segIndex], y }
          pts[segIndex + 1] = { ...pts[segIndex + 1], y }
        } else {
          let x = origin[segIndex].x + dxPct
          const sx = snapAxis(x, targets.xs)
          x = sx.value
          if (sx.guide !== null) nextGuidesLocal.v.push(sx.guide)
          pts[segIndex] = { ...pts[segIndex], x }
          pts[segIndex + 1] = { ...pts[segIndex + 1], x }
        }

        next.connectors[index] = {
          ...next.connectors[index],
          points: enforceOrthoPoints(pts),
        }
        setGuides(nextGuidesLocal)
        return next
      }

      if (isLinePointKind(drag.kind)) {
        const parts = drag.kind.split('-')
        const index = Number(parts[2])
        const pointIndex = Number(parts[3])
        const connector = next.connectors[index]
        if (!connector?.points?.[pointIndex]) return prev
        let x = drag.originX + dxPct
        let y = drag.originY + dyPct
        const targets = collectSnapTargets(next, null)
        const sx = snapAxis(x, targets.xs)
        const sy = snapAxis(y, targets.ys)
        x = sx.value
        y = sy.value
        if (sx.guide !== null) nextGuides.v.push(sx.guide)
        if (sy.guide !== null) nextGuides.h.push(sy.guide)
        next.connectors[index] = {
          ...connector,
          points: moveOrthoPoint(connector.points, pointIndex, { x, y }),
        }
        setGuides(nextGuides)
        return next
      }

      if (drag.kind === 'hub') {
        const x = clamp(drag.originX + dxPct, 5, 95)
        const y = clamp(drag.originY + dyPct, -5, 80)
        const targets = collectSnapTargets(next, 'hub')
        const sx = snapAxis(x, targets.xs)
        const sy = snapAxis(y, targets.ys)
        next.hub.x = sx.value
        next.hub.y = sy.value
        if (sx.guide !== null) nextGuides.v.push(sx.guide)
        if (sy.guide !== null) nextGuides.h.push(sy.guide)
        setGuides(nextGuides)
        return next
      }

      if (isResizeKind(drag.kind)) {
        const corner = drag.kind.slice(7) as ResizeCorner
        const id = drag.selectedId
        if (!id) return prev
        if (id === 'hub') {
          let w = drag.originW ?? next.hub.w
          let logoH = drag.originH ?? next.hub.logoH
          if (corner === 'se' || corner === 'ne') w += dxPct
          if (corner === 'sw' || corner === 'nw') w -= dxPct
          if (corner === 'se' || corner === 'sw') logoH += dyPct
          if (corner === 'ne' || corner === 'nw') logoH -= dyPct
          next.hub.w = round1(clamp(w, 12, 70))
          next.hub.logoH = round1(clamp(logoH, 6, 40))
          setGuides({ v: [], h: [] })
          return next
        }
        const zoneKey = parseZoneKey(id)
        if (zoneKey) {
          if (drag.originW == null || drag.originH == null) return prev
          let x = drag.originX
          let y = drag.originY
          let w = drag.originW
          let h = drag.originH
          if (corner.includes('e')) w = drag.originW + dxPct
          if (corner.includes('w')) {
            w = drag.originW - dxPct
            x = drag.originX + dxPct
          }
          if (corner.includes('s')) h = drag.originH + dyPct
          if (corner.includes('n')) {
            h = drag.originH - dyPct
            y = drag.originY + dyPct
          }
          w = clamp(w, 10, 70)
          h = clamp(h, 15, 95)
          if (corner.includes('w')) x = drag.originX + drag.originW - w
          if (corner.includes('n')) y = drag.originY + drag.originH - h
          next.zoneBoxes[zoneKey] = {
            x: round1(x),
            y: round1(y),
            w: round1(w),
            h: round1(h),
          }
          setGuides({ v: [], h: [] })
          return next
        }
        const node = next.nodes.find((n) => n.id === id)
        if (!node || drag.originW == null || drag.originH == null) return prev
        let x = drag.originX
        let y = drag.originY
        let w = drag.originW
        let h = drag.originH
        if (corner.includes('e')) w = drag.originW + dxPct
        if (corner.includes('w')) {
          w = drag.originW - dxPct
          x = drag.originX + dxPct
        }
        if (corner.includes('s')) h = drag.originH + dyPct
        if (corner.includes('n')) {
          h = drag.originH - dyPct
          y = drag.originY + dyPct
        }
        w = clamp(w, 3, 55)
        h = clamp(h, 4, 50)
        if (corner.includes('w')) x = drag.originX + drag.originW - w
        if (corner.includes('n')) y = drag.originY + drag.originH - h
        node.x = round1(x)
        node.y = round1(y)
        node.w = round1(w)
        node.h = round1(h)
        setGuides({ v: [], h: [] })
        return next
      }

      if (isZoneDragKind(drag.kind)) {
        const zoneKey = zoneKeyFromDrag(drag.kind)
        const box = next.zoneBoxes[zoneKey]
        let x = drag.originX + dxPct
        let y = drag.originY + dyPct
        const targets = collectSnapTargets(next, null)
        const left = snapAxis(x, targets.xs)
        const center = snapAxis(x + box.w / 2, targets.xs)
        const right = snapAxis(x + box.w, targets.xs)
        const xCandidates = [
          { x: left.value, guide: left.guide, dist: Math.abs(x - left.value) },
          {
            x: center.value - box.w / 2,
            guide: center.guide,
            dist: Math.abs(x + box.w / 2 - (center.guide ?? 999)),
          },
          {
            x: right.value - box.w,
            guide: right.guide,
            dist: Math.abs(x + box.w - (right.guide ?? 999)),
          },
        ].sort((a, b) => a.dist - b.dist)
        if (xCandidates[0].guide !== null && xCandidates[0].dist <= SNAP_PX) {
          x = xCandidates[0].x
          nextGuides.v.push(xCandidates[0].guide)
        }
        const top = snapAxis(y, targets.ys)
        const midY = snapAxis(y + box.h / 2, targets.ys)
        const bottom = snapAxis(y + box.h, targets.ys)
        const yCandidates = [
          { y: top.value, guide: top.guide, dist: Math.abs(y - top.value) },
          {
            y: midY.value - box.h / 2,
            guide: midY.guide,
            dist: Math.abs(y + box.h / 2 - (midY.guide ?? 999)),
          },
          {
            y: bottom.value - box.h,
            guide: bottom.guide,
            dist: Math.abs(y + box.h - (bottom.guide ?? 999)),
          },
        ].sort((a, b) => a.dist - b.dist)
        if (yCandidates[0].guide !== null && yCandidates[0].dist <= SNAP_PX) {
          y = yCandidates[0].y
          nextGuides.h.push(yCandidates[0].guide)
        }
        next.zoneBoxes[zoneKey] = {
          ...box,
          x: round1(x),
          y: round1(y),
        }
        setGuides(nextGuides)
        return next
      }

      const node = next.nodes.find((n) => n.id === drag.kind)
      if (!node) return prev
      let x = drag.originX + dxPct
      let y = drag.originY + dyPct
      const targets = collectSnapTargets(next, node.id)
      const left = snapAxis(x, targets.xs)
      const center = snapAxis(x + node.w / 2, targets.xs)
      const right = snapAxis(x + node.w, targets.xs)
      const xCandidates = [
        { x: left.value, guide: left.guide, dist: Math.abs(x - left.value) },
        {
          x: center.value - node.w / 2,
          guide: center.guide,
          dist: Math.abs(x + node.w / 2 - (center.guide ?? 999)),
        },
        {
          x: right.value - node.w,
          guide: right.guide,
          dist: Math.abs(x + node.w - (right.guide ?? 999)),
        },
      ].sort((a, b) => a.dist - b.dist)
      if (xCandidates[0].guide !== null && xCandidates[0].dist <= SNAP_PX) {
        x = xCandidates[0].x
        nextGuides.v.push(xCandidates[0].guide)
      }
      const top = snapAxis(y, targets.ys)
      const midY = snapAxis(y + node.h / 2, targets.ys)
      const bottom = snapAxis(y + node.h, targets.ys)
      const yCandidates = [
        { y: top.value, guide: top.guide, dist: Math.abs(y - top.value) },
        {
          y: midY.value - node.h / 2,
          guide: midY.guide,
          dist: Math.abs(y + node.h / 2 - (midY.guide ?? 999)),
        },
        {
          y: bottom.value - node.h,
          guide: bottom.guide,
          dist: Math.abs(y + node.h - (bottom.guide ?? 999)),
        },
      ].sort((a, b) => a.dist - b.dist)
      if (yCandidates[0].guide !== null && yCandidates[0].dist <= SNAP_PX) {
        y = yCandidates[0].y
        nextGuides.h.push(yCandidates[0].guide)
      }
      node.x = round1(x)
      node.y = round1(y)
      setGuides(nextGuides)
      return next
    })
  }, [])

  const beginDrag = (
    state: Omit<DragState, 'canvasW' | 'canvasH'> &
      Partial<Pick<DragState, 'canvasW' | 'canvasH'>>,
    target?: Element,
    pointerId?: number,
    opts?: { skipHistory?: boolean },
  ) => {
    const rect = boardRect()
    if (!rect || rect.width < 10) return
    if (target && pointerId != null) {
      try {
        ;(target as HTMLElement).setPointerCapture?.(pointerId)
      } catch {
        // ignore
      }
    }
    if (state.kind !== 'pan' && !opts?.skipHistory) {
      pushHistory(layoutRef.current)
    }
    dragRef.current = {
      ...state,
      canvasW: state.canvasW ?? rect.width,
      canvasH: state.canvasH ?? rect.height,
    }
    setDragging(true)
  }

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current) return
      applyDrag(e.clientX, e.clientY)
    }
    const onUp = () => {
      if (dragRef.current) endDrag()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [applyDrag, endDrag])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        const delta = -e.deltaY * 0.0015
        setZoom((z) => round1(clamp(z + delta, MIN_ZOOM, MAX_ZOOM)))
        return
      }
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const isTyping = (el: EventTarget | null) => {
      const t = el as HTMLElement | null
      return (
        t?.tagName === 'INPUT' ||
        t?.tagName === 'TEXTAREA' ||
        t?.isContentEditable
      )
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isTyping(e.target)) {
        e.preventDefault()
        setSpaceDown(true)
        return
      }
      if ((e.key === '=' || e.key === '+') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setZoom((z) => round1(clamp(z + 0.1, MIN_ZOOM, MAX_ZOOM)))
        return
      }
      if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setZoom((z) => round1(clamp(z - 0.1, MIN_ZOOM, MAX_ZOOM)))
        return
      }
      if (e.key === '0' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setZoom(1)
        setPan({ x: 0, y: 0 })
        return
      }

      // Delete selected line point
      if (
        (e.key === 'Backspace' || e.key === 'Delete') &&
        selectedLineIndex !== null &&
        selectedPoint !== null &&
        !isTyping(e.target)
      ) {
        e.preventDefault()
        pushHistory(layoutRef.current)
        setLayout((prev) => {
          const next = cloneLayout(prev)
          const c = next.connectors[selectedLineIndex]
          const pts = resolveConnectorPoints(next, c)
          if (pts.length <= 2) return prev
          const points = pts.filter((_, i) => i !== selectedPoint)
          next.connectors[selectedLineIndex] = { ...c, points }
          return next
        })
        setSelectedPoint(null)
        return
      }

      if (!selectedId || isTyping(e.target)) return
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
        return
      e.preventDefault()
      const step = e.shiftKey ? 2 : 0.5
      const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0
      const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0
      pushHistory(layoutRef.current)
      setLayout((prev) => {
        const next = cloneLayout(prev)
        if (selectedId === 'hub') {
          next.hub.x = round1(next.hub.x + dx)
          next.hub.y = round1(next.hub.y + dy)
          return next
        }
        const textKind = parseTextKind(selectedId)
        if (textKind) {
          if (textKind === 'hub-title') {
            const pos = resolveHubTitlePos(next.hub)
            next.hub.titleX = round1(pos.x + dx)
            next.hub.titleY = round1(pos.y + dy)
          } else if (textKind === 'school-header') {
            next.zoneHeaders.school = {
              x: round1(next.zoneHeaders.school.x + dx),
              y: round1(next.zoneHeaders.school.y + dy),
            }
          } else if (textKind === 'home-header') {
            next.zoneHeaders.home = {
              x: round1(next.zoneHeaders.home.x + dx),
              y: round1(next.zoneHeaders.home.y + dy),
            }
          } else {
            const nodeId = textKind.slice('label-'.length) as EcosystemNodeId
            const node = next.nodes.find((n) => n.id === nodeId)
            if (!node) return prev
            const pos = resolveNodeLabelPos(node)
            node.labelX = round1(pos.x + dx)
            node.labelY = round1(pos.y + dy)
          }
          return next
        }
        const lineIdx = parseLineIndex(selectedId)
        if (lineIdx !== null) {
          const c = bakeConnectorPoints(next, next.connectors[lineIdx])
          const pts = c.points ?? []
          let points: PointPct[]
          if (selectedPoint !== null) {
            const p = pts[selectedPoint]
            points = moveOrthoPoint(pts, selectedPoint, {
              x: round1(p.x + dx),
              y: round1(p.y + dy),
            })
          } else {
            points = enforceOrthoPoints(
              pts.map((p) => ({ x: round1(p.x + dx), y: round1(p.y + dy) })),
            )
          }
          next.connectors[lineIdx] = { ...c, points }
          return next
        }
        const zoneKey = parseZoneKey(selectedId)
        if (zoneKey) {
          const box = next.zoneBoxes[zoneKey]
          next.zoneBoxes[zoneKey] = {
            ...box,
            x: round1(box.x + dx),
            y: round1(box.y + dy),
          }
          return next
        }
        const node = next.nodes.find((n) => n.id === selectedId)
        if (!node) return prev
        node.x = round1(node.x + dx)
        node.y = round1(node.y + dy)
        return next
      })
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceDown(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [selectedId, selectedPoint, selectedLineIndex, pushHistory])

  const startNodeDrag = (kind: NodeDragKind, e: ReactPointerEvent) => {
    if (spaceDown) return
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    e.stopPropagation()
    const current = layoutRef.current
    let originX = 0
    let originY = 0
    if (kind === 'hub') {
      originX = current.hub.x
      originY = current.hub.y
    } else {
      const node = current.nodes.find((n) => n.id === kind)
      if (!node) return
      originX = node.x
      originY = node.y
    }
    setSelectedId(kind)
    setSelectedPoint(null)
    beginDrag(
      { kind, startX: e.clientX, startY: e.clientY, originX, originY },
      e.currentTarget,
      e.pointerId,
    )
  }

  const startZoneDrag = (key: ZoneKey, e: ReactPointerEvent) => {
    if (spaceDown) return
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    e.stopPropagation()
    const current = layoutRef.current
    const box = current.zoneBoxes[key]
    setSelectedId(zoneSelectedId(key))
    setSelectedPoint(null)
    beginDrag(
      {
        kind: `zone-${key}`,
        startX: e.clientX,
        startY: e.clientY,
        originX: box.x,
        originY: box.y,
      },
      e.currentTarget,
      e.pointerId,
    )
  }

  /** Drag segment: near ends / along end segment = stretch length; mid = reshape bend. Shift = move whole line. */
  const startLineEdit = (index: number, e: ReactPointerEvent) => {
    if (spaceDown) return
    e.preventDefault()
    e.stopPropagation()
    const board = boardRef.current
    if (!board) return
    const rect = board.getBoundingClientRect()
    const xPct = ((e.clientX - rect.left) / rect.width) * 100
    const yPct = ((e.clientY - rect.top) / rect.height) * 100

    const next = cloneLayout(layoutRef.current)
    next.connectors[index] = bakeConnectorPoints(next, next.connectors[index])
    const originPoints = (next.connectors[index].points ?? []).map((p) => ({
      ...p,
    }))
    if (originPoints.length < 2) return

    pushHistory(layoutRef.current)
    layoutRef.current = next
    setLayout(next)
    setSelectedId(lineSelectedId(index))
    setSelectedPoint(null)

    // Shift: translate entire polyline
    if (e.shiftKey) {
      beginDrag(
        {
          kind: `line-move-${index}`,
          startX: e.clientX,
          startY: e.clientY,
          originX: 0,
          originY: 0,
          originPoints,
        },
        e.currentTarget,
        e.pointerId,
        { skipHistory: true },
      )
      return
    }

    const last = originPoints.length - 1
    const dStart = Math.hypot(
      xPct - originPoints[0].x,
      yPct - originPoints[0].y,
    )
    const dEnd = Math.hypot(
      xPct - originPoints[last].x,
      yPct - originPoints[last].y,
    )
    const END_HIT = 6

    // Grab near a tip → stretch / reposition that end (lengthen/shorten)
    if (dStart <= END_HIT || dEnd <= END_HIT) {
      const pointIndex = dStart <= dEnd ? 0 : last
      const pt = originPoints[pointIndex]
      setSelectedPoint(pointIndex)
      beginDrag(
        {
          kind: `line-point-${index}-${pointIndex}`,
          startX: e.clientX,
          startY: e.clientY,
          originX: pt.x,
          originY: pt.y,
          originPoints,
        },
        e.currentTarget,
        e.pointerId,
        { skipHistory: true },
      )
      return
    }

    const segIndex = nearestSegmentIndex(originPoints, xPct, yPct)
    const a = originPoints[segIndex]
    const b = originPoints[segIndex + 1]
    const segAxis: 'h' | 'v' =
      Math.abs(b.x - a.x) >= Math.abs(b.y - a.y) ? 'h' : 'v'
    const stretchIndex =
      segIndex === 0 ? 0 : segIndex === last - 1 ? last : undefined

    beginDrag(
      {
        kind: `line-seg-${index}-${segIndex}`,
        startX: e.clientX,
        startY: e.clientY,
        originX: 0,
        originY: 0,
        originPoints,
        segIndex,
        segAxis,
        stretchIndex,
      },
      e.currentTarget,
      e.pointerId,
      { skipHistory: true },
    )
  }

  /** Drag free text (product labels, hub title, zone headers) */
  const startTextDrag = (kind: TextDragKind, e: ReactPointerEvent) => {
    if (spaceDown) return
    e.preventDefault()
    e.stopPropagation()
    const current = layoutRef.current
    let origin: PointPct = { x: 0, y: 0 }

    if (kind === 'hub-title') {
      origin = resolveHubTitlePos(current.hub)
    } else if (kind === 'school-header') {
      origin = { ...current.zoneHeaders.school }
    } else if (kind === 'home-header') {
      origin = { ...current.zoneHeaders.home }
    } else {
      const nodeId = kind.slice('label-'.length) as EcosystemNodeId
      const node = current.nodes.find((n) => n.id === nodeId)
      if (!node) return
      origin = resolveNodeLabelPos(node)
    }

    setSelectedId(textSelectedId(kind))
    setSelectedPoint(null)
    beginDrag(
      {
        kind,
        startX: e.clientX,
        startY: e.clientY,
        originX: origin.x,
        originY: origin.y,
      },
      e.currentTarget,
      e.pointerId,
    )
  }

  const startResize = (corner: ResizeCorner, e: ReactPointerEvent) => {
    if (!selectedId || selectedId.startsWith('line:') || spaceDown) return
    e.preventDefault()
    e.stopPropagation()
    const current = layoutRef.current
    if (selectedId === 'hub') {
      beginDrag(
        {
          kind: `resize-${corner}`,
          startX: e.clientX,
          startY: e.clientY,
          originX: current.hub.x,
          originY: current.hub.y,
          originW: current.hub.w,
          originH: current.hub.logoH,
          selectedId: 'hub',
        },
        e.currentTarget,
        e.pointerId,
      )
      return
    }
    const zoneKey = parseZoneKey(selectedId)
    if (zoneKey) {
      const box = current.zoneBoxes[zoneKey]
      beginDrag(
        {
          kind: `resize-${corner}`,
          startX: e.clientX,
          startY: e.clientY,
          originX: box.x,
          originY: box.y,
          originW: box.w,
          originH: box.h,
          selectedId,
        },
        e.currentTarget,
        e.pointerId,
      )
      return
    }
    const node = current.nodes.find((n) => n.id === selectedId)
    if (!node) return
    beginDrag(
      {
        kind: `resize-${corner}`,
        startX: e.clientX,
        startY: e.clientY,
        originX: node.x,
        originY: node.y,
        originW: node.w,
        originH: node.h,
        selectedId,
      },
      e.currentTarget,
      e.pointerId,
    )
  }

  const startPan = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!(spaceDown || e.button === 1)) return
    e.preventDefault()
    beginDrag({
      kind: 'pan',
      startX: e.clientX,
      startY: e.clientY,
      originX: 0,
      originY: 0,
      panOriginX: panRef.current.x,
      panOriginY: panRef.current.y,
      canvasW: 1,
      canvasH: 1,
    })
  }

  const onUndo = () => {
    setHistory((h) => {
      if (!h.length) return h
      setLayout(h[h.length - 1])
      return h.slice(0, -1)
    })
  }

  const onReset = () => {
    pushHistory(layout)
    setLayout(cloneLayout(defaultEcosystemLayout))
    setSelectedId(null)
    setSelectedPoint(null)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy layout:', code)
    }
  }

  const patchStrokeWidth = (strokeWidth: number) => {
    pushHistory(layout)
    setLayout((prev) => ({ ...cloneLayout(prev), strokeWidth: round1(strokeWidth) }))
  }

  const patchCornerRadius = (cornerRadius: number) => {
    pushHistory(layout)
    setLayout((prev) => ({
      ...cloneLayout(prev),
      cornerRadius: Math.round(cornerRadius),
    }))
  }

  const patchSelectedNode = (
    patch: Partial<NodeLayout> | Partial<EcosystemLayout['hub']>,
  ) => {
    if (!selectedId || selectedId.startsWith('line:')) return
    pushHistory(layout)
    setLayout((prev) => {
      const next = cloneLayout(prev)
      if (selectedId === 'hub') {
        next.hub = { ...next.hub, ...(patch as Partial<EcosystemLayout['hub']>) }
      } else {
        next.nodes = next.nodes.map((n) =>
          n.id === selectedId ? { ...n, ...(patch as Partial<NodeLayout>) } : n,
        )
      }
      return next
    })
  }

  const patchSelectedZone = (patch: Partial<EcosystemLayout['zoneBoxes']['school']>) => {
    if (!selectedZoneKey) return
    pushHistory(layout)
    setLayout((prev) => {
      const next = cloneLayout(prev)
      next.zoneBoxes[selectedZoneKey] = {
        ...next.zoneBoxes[selectedZoneKey],
        ...patch,
      }
      return next
    })
  }

  const addBend = () => {
    if (selectedLineIndex === null) return
    pushHistory(layout)
    setLayout((prev) => {
      const next = cloneLayout(prev)
      const baked = bakeConnectorPoints(next, next.connectors[selectedLineIndex])
      const points = insertOrthoBend(baked.points ?? [])
      next.connectors[selectedLineIndex] = { ...baked, points }
      return next
    })
  }

  const resetLineAuto = () => {
    if (selectedLineIndex === null) return
    pushHistory(layout)
    setLayout((prev) => {
      const next = cloneLayout(prev)
      const current = next.connectors[selectedLineIndex]
      next.connectors[selectedLineIndex] = {
        from: current.from,
        to: current.to,
      }
      return next
    })
    setSelectedPoint(null)
  }

  const deleteSelectedPoint = () => {
    if (selectedLineIndex === null || selectedPoint === null) return
    pushHistory(layout)
    setLayout((prev) => {
      const next = cloneLayout(prev)
      const c = next.connectors[selectedLineIndex]
      const pts = resolveConnectorPoints(next, c)
      if (pts.length <= 2) return prev
      next.connectors[selectedLineIndex] = {
        ...c,
        points: pts.filter((_, i) => i !== selectedPoint),
      }
      return next
    })
    setSelectedPoint(null)
  }

  const renderedConnectors = layout.connectors.map((c, index) => {
    const pts = resolveConnectorPoints(layout, c)
    if (pts.length < 2) return null
    return {
      index,
      c,
      pts,
      d: roundedOrthoPath(pointsToViewBox(pts), layout.cornerRadius),
    }
  })

  const selectionBox = (() => {
    if (selectedId === 'hub') {
      return {
        left: layout.hub.x - layout.hub.w / 2,
        top: layout.hub.y,
        width: layout.hub.w,
        height: Math.max(layout.hub.logoH, 12),
      }
    }
    if (selectedNode) {
      return {
        left: selectedNode.x,
        top: selectedNode.y,
        width: selectedNode.w,
        height: selectedNode.h,
      }
    }
    if (selectedZone) {
      return {
        left: selectedZone.x,
        top: selectedZone.y,
        width: selectedZone.w,
        height: selectedZone.h,
      }
    }
    return null
  })()

  const statusLabel = (() => {
    if (dragging && isTextDragKind(dragRef.current?.kind ?? '')) {
      return 'Moving text…'
    }
    if (dragging && isLineSegKind(dragRef.current?.kind ?? '')) {
      return 'Reshaping bend (no dots)…'
    }
    if (dragging && isLineMoveKind(dragRef.current?.kind ?? '')) {
      return 'Moving whole line…'
    }
    if (dragging && isLinePointKind(dragRef.current?.kind ?? '')) {
      return 'Moving line point…'
    }
    if (dragging) return 'Editing…'
    const textKind = parseTextKind(selectedId)
    if (textKind === 'hub-title') return 'Text: Hub title'
    if (textKind === 'school-header') return 'Text: School header'
    if (textKind === 'home-header') return 'Text: Home header'
    if (textKind?.startsWith('label-')) {
      const id = textKind.slice('label-'.length) as EcosystemNodeId
      return `Text: ${PRODUCT_META[id]?.label ?? id}`
    }
    if (selectedLineIndex !== null && selectedConnector) {
      const free = Boolean(selectedConnector.points?.length)
      return `Line: ${connectorLabel(selectedConnector)}${free ? ' (free)' : ' (auto)'} · tip = stretch · mid = bend · Shift = move`
    }
    if (selectedId === 'hub') return 'Hub logo selected'
    if (selectedZoneKey === 'school') return 'School zone panel selected'
    if (selectedZoneKey === 'home') return 'Home zone panel selected'
    if (selectedId && PRODUCT_META[selectedId as EcosystemNodeId]) {
      return PRODUCT_META[selectedId as EcosystemNodeId].label
    }
    return 'Drag images · zones · text · lines independently'
  })()

  return (
    <main className="min-h-screen bg-[#ebe4f2] text-font-600">
      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-4 py-6">
        <header className="shrink-0">
          <h1 className="font-poppins text-2xl font-semibold">Ecosystem studio</h1>
          <p className="mt-1 max-w-3xl font-inter text-sm text-font-500">
            Edits apply to both desktop and mobile — they share one layout.
            Drag near a tip to lengthen/shorten; drag a middle segment to reshape
            the bend; Shift-drag to move the whole line. “+ Step bend” adds an
            S-curve; Corner roundness tunes the fillet.
          </p>
        </header>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-[rgba(199,126,185,0.25)] bg-white/80 p-3 backdrop-blur">
          <button
            type="button"
            className="rounded-full bg-font-500 px-4 py-2 font-inter text-sm text-white"
            onClick={onReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="rounded-full border border-font-200 bg-white px-4 py-2 font-inter text-sm disabled:opacity-40"
            onClick={onUndo}
            disabled={history.length === 0}
          >
            Undo
          </button>
          <button
            type="button"
            className="rounded-full bg-brand-500 px-4 py-2 font-inter text-sm text-white"
            onClick={onCopy}
          >
            {copied ? 'Copied!' : 'Copy layout TS'}
          </button>

          <div className="mx-1 h-6 w-px bg-font-200/60" />

          <div className="flex rounded-full border border-font-200 bg-white p-0.5">
            {(['desktop', 'mobile'] as PreviewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className={cn(
                  'rounded-full px-3 py-1.5 font-inter text-xs capitalize',
                  preview === mode
                    ? 'bg-brand-500 text-white'
                    : 'text-font-500 hover:text-font-600',
                )}
                onClick={() => {
                  setPreview(mode)
                  setPan({ x: 0, y: 0 })
                  setZoom(1)
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="mx-1 h-6 w-px bg-font-200/60" />

          <button
            type="button"
            className="rounded-full border border-font-200 bg-white p-2"
            onClick={() => setZoom((z) => round1(clamp(z - 0.1, MIN_ZOOM, MAX_ZOOM)))}
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            type="button"
            className="min-w-[4.5rem] rounded-full border border-font-200 bg-white px-3 py-2 font-inter text-xs"
            onClick={() => {
              setZoom(1)
              setPan({ x: 0, y: 0 })
            }}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            className="rounded-full border border-font-200 bg-white p-2"
            onClick={() => setZoom((z) => round1(clamp(z + 0.1, MIN_ZOOM, MAX_ZOOM)))}
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>

          <span className="ml-auto font-inter text-xs text-font-400">{statusLabel}</span>
        </div>

        <div className="mt-3 grid shrink-0 gap-3 rounded-2xl border border-[rgba(199,126,185,0.25)] bg-white/80 p-3 backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          <Slider
            label="Line stroke"
            min={0.8}
            max={8}
            step={0.1}
            value={layout.strokeWidth}
            onChange={patchStrokeWidth}
          />
          <Slider
            label="Corner roundness"
            min={8}
            max={80}
            step={1}
            value={layout.cornerRadius}
            onChange={patchCornerRadius}
          />
          {selectedId === 'hub' && (
            <>
              <Slider
                label="Hub width %"
                min={12}
                max={70}
                value={layout.hub.w}
                onChange={(v) => patchSelectedNode({ w: v })}
              />
              <Slider
                label="Logo height %"
                min={6}
                max={40}
                value={layout.hub.logoH}
                onChange={(v) => patchSelectedNode({ logoH: v })}
              />
            </>
          )}
          {selectedNode && (
            <>
              <Slider
                label="Width %"
                min={3}
                max={55}
                value={selectedNode.w}
                onChange={(v) => patchSelectedNode({ w: v })}
              />
              <Slider
                label="Height %"
                min={4}
                max={50}
                value={selectedNode.h}
                onChange={(v) => patchSelectedNode({ h: v })}
              />
            </>
          )}
          {selectedZone && (
            <>
              <Slider
                label="Zone X %"
                min={-5}
                max={95}
                value={selectedZone.x}
                onChange={(v) => patchSelectedZone({ x: v })}
              />
              <Slider
                label="Zone Y %"
                min={0}
                max={90}
                value={selectedZone.y}
                onChange={(v) => patchSelectedZone({ y: v })}
              />
              <Slider
                label="Zone width %"
                min={10}
                max={70}
                value={selectedZone.w}
                onChange={(v) => patchSelectedZone({ w: v })}
              />
              <Slider
                label="Zone height %"
                min={15}
                max={95}
                value={selectedZone.h}
                onChange={(v) => patchSelectedZone({ h: v })}
              />
            </>
          )}
          {selectedConnector && selectedLineIndex !== null && (
            <>
              <div className="flex flex-col justify-end gap-2">
                <span className="font-inter text-xs">Line tools</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-font-200 bg-white px-3 py-2 font-inter text-sm"
                    onClick={addBend}
                  >
                    + Step bend
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-font-200 bg-white px-3 py-2 font-inter text-sm disabled:opacity-40"
                    onClick={deleteSelectedPoint}
                    disabled={
                      selectedPoint === null ||
                      (selectedLinePoints?.length ?? 0) <= 2
                    }
                  >
                    Delete point
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-font-200 bg-white px-3 py-2 font-inter text-sm"
                    onClick={resetLineAuto}
                  >
                    Reset auto
                  </button>
                </div>
              </div>
              {selectedPoint !== null && selectedLinePoints?.[selectedPoint] && (
                <>
                  <Slider
                    label="Point X %"
                    min={0}
                    max={100}
                    value={selectedLinePoints[selectedPoint].x}
                    onChange={(v) => {
                      pushHistory(layout)
                      setLayout((prev) => {
                        const next = cloneLayout(prev)
                        const baked = bakeConnectorPoints(
                          next,
                          next.connectors[selectedLineIndex],
                        )
                        const points = (baked.points ?? []).map((p, i) =>
                          i === selectedPoint ? { ...p, x: round1(v) } : p,
                        )
                        next.connectors[selectedLineIndex] = { ...baked, points }
                        return next
                      })
                    }}
                  />
                  <Slider
                    label="Point Y %"
                    min={0}
                    max={100}
                    value={selectedLinePoints[selectedPoint].y}
                    onChange={(v) => {
                      pushHistory(layout)
                      setLayout((prev) => {
                        const next = cloneLayout(prev)
                        const baked = bakeConnectorPoints(
                          next,
                          next.connectors[selectedLineIndex],
                        )
                        const points = (baked.points ?? []).map((p, i) =>
                          i === selectedPoint ? { ...p, y: round1(v) } : p,
                        )
                        next.connectors[selectedLineIndex] = { ...baked, points }
                        return next
                      })
                    }}
                  />
                </>
              )}
            </>
          )}
        </div>

        <div
          ref={viewportRef}
          className={cn(
            'relative mt-4 min-h-[70vh] flex-1 overflow-hidden rounded-[24px] border border-[#DDCDEB] bg-[#d8cce6]',
            spaceDown ? 'cursor-grab' : 'cursor-default',
            dragging && dragRef.current?.kind === 'pan' && 'cursor-grabbing',
          )}
          onPointerDown={startPan}
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(74,29,110,0.12) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 origin-center transition-[width] duration-300"
            style={{
              width: preview === 'mobile' ? '390px' : 'min(1100px, 92%)',
              transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
            }}
          >
            <div
              ref={boardRef}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-[#cbb6e0] bg-[#F4EFF9] shadow-[0_20px_60px_rgba(74,29,110,0.18)]"
              onPointerDown={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedId(null)
                  setSelectedPoint(null)
                }
              }}
            >
              {(['school', 'home'] as ZoneKey[]).map((key) => {
                const box = layout.zoneBoxes[key]
                const isSchool = key === 'school'
                const tagline = isSchool ? LABELS.schoolTagline : LABELS.homeTagline
                return (
                  <div
                    key={key}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      'absolute z-[1] cursor-grab rounded-[3%] border touch-none active:cursor-grabbing',
                      isSchool
                        ? 'border-[#CDB6E1] bg-[#FBF8FE]'
                        : 'border-[#F2B9DA] bg-[#FFF8FC]',
                      selectedId === zoneSelectedId(key) &&
                        'outline outline-2 outline-[#E4198C]/70',
                    )}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.w}%`,
                      height: `${box.h}%`,
                    }}
                    onPointerDown={(e) => startZoneDrag(key, e)}
                  >
                    <div
                      className={cn(
                        'pointer-events-none absolute bottom-[-4.5%] left-[2%] flex min-h-[9.5%] w-[96%] items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold leading-snug text-white',
                        isSchool ? 'bg-[#5B2A86]' : 'bg-[#E4198C]',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white',
                          isSchool ? 'text-[#5B2A86]' : 'text-[#E4198C]',
                        )}
                      >
                        {isSchool ? <GraduationCap size={12} /> : <Home size={12} />}
                      </span>
                      <span className="min-w-0">
                        {bannerLines(tagline).map((line, i) => (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Free zone header texts */}
              <button
                type="button"
                className={cn(
                  'absolute z-[22] flex -translate-y-1/2 cursor-grab items-center gap-2 touch-none active:cursor-grabbing',
                  selectedId === textSelectedId('school-header') &&
                    'rounded-lg outline outline-2 outline-[#E4198C]/70',
                )}
                style={{
                  left: `${layout.zoneHeaders.school.x}%`,
                  top: `${layout.zoneHeaders.school.y}%`,
                }}
                onPointerDown={(e) => startTextDrag('school-header', e)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5B2A86] text-white">
                  <School size={16} />
                </span>
                <span className="font-poppins text-lg font-extrabold text-[#5B2A86]">
                  {LABELS.schoolLabel}
                </span>
              </button>
              <button
                type="button"
                className={cn(
                  'absolute z-[22] flex -translate-y-1/2 cursor-grab items-center gap-2 touch-none active:cursor-grabbing',
                  selectedId === textSelectedId('home-header') &&
                    'rounded-lg outline outline-2 outline-[#E4198C]/70',
                )}
                style={{
                  left: `${layout.zoneHeaders.home.x}%`,
                  top: `${layout.zoneHeaders.home.y}%`,
                }}
                onPointerDown={(e) => startTextDrag('home-header', e)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4198C] text-white">
                  <Home size={16} />
                </span>
                <span className="font-poppins text-lg font-extrabold text-[#B61B78]">
                  {LABELS.homeLabel}
                </span>
              </button>

              {guides.v.map((x) => (
                <div
                  key={`v-${x}`}
                  className="pointer-events-none absolute bottom-0 top-0 z-[40] w-px bg-[#E4198C]/80"
                  style={{ left: `${x}%` }}
                />
              ))}
              {guides.h.map((y) => (
                <div
                  key={`h-${y}`}
                  className="pointer-events-none absolute left-0 right-0 z-[40] h-px bg-[#E4198C]/80"
                  style={{ top: `${y}%` }}
                />
              ))}

              <svg
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
                className="absolute inset-0 z-[5] h-full w-full"
                aria-hidden
              >
                <g fill="none" stroke="transparent" strokeWidth={22} strokeLinecap="round">
                  {renderedConnectors.map((item) =>
                    item ? (
                      <path
                        key={`hit-${item.index}`}
                        d={item.d}
                        className="cursor-move"
                        style={{ pointerEvents: 'stroke' }}
                        onPointerDown={(e) => startLineEdit(item.index, e)}
                      />
                    ) : null,
                  )}
                </g>
                <g
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ pointerEvents: 'none' }}
                >
                  {renderedConnectors.map((item) =>
                    item ? (
                      <path
                        key={`line-${item.index}`}
                        d={item.d}
                        stroke={
                          selectedLineIndex === item.index ? '#E4198C' : '#7A3FA0'
                        }
                        strokeWidth={
                          selectedLineIndex === item.index
                            ? Math.max(layout.strokeWidth, 2.8)
                            : layout.strokeWidth
                        }
                      />
                    ) : null,
                  )}
                </g>
              </svg>

              {/* No corner/endpoint dots — reshape by dragging line segments */}

              {/* Hub logo (image only) */}
              <div
                role="button"
                tabIndex={0}
                className={cn(
                  'absolute z-30 flex -translate-x-1/2 cursor-grab flex-col items-center touch-none active:cursor-grabbing',
                  selectedId === 'hub' && 'outline outline-2 outline-[#E4198C]/70',
                )}
                style={{
                  left: `${layout.hub.x}%`,
                  top: `${layout.hub.y}%`,
                  width: `${layout.hub.w}%`,
                  height: `${Math.max(layout.hub.logoH, 12)}%`,
                }}
                onPointerDown={(e) => startNodeDrag('hub', e)}
              >
                <div className="pointer-events-none relative h-full w-full">
                  <Image
                    src="/Lango_Logo.svg"
                    alt="Lango"
                    width={220}
                    height={220}
                    className="mx-auto h-full w-auto"
                    draggable={false}
                    priority
                  />
                </div>
              </div>

              {/* Free hub title text */}
              {(() => {
                const titlePos = resolveHubTitlePos(layout.hub)
                return (
                  <button
                    type="button"
                    className={cn(
                      'absolute z-30 max-w-[380px] -translate-x-1/2 cursor-grab whitespace-pre-line text-center font-poppins text-[clamp(16px,2vw,32px)] font-extrabold leading-[1.05] text-[#4A1D6E] touch-none active:cursor-grabbing',
                      selectedId === textSelectedId('hub-title') &&
                        'rounded-lg outline outline-2 outline-[#E4198C]/70',
                    )}
                    style={{ left: `${titlePos.x}%`, top: `${titlePos.y}%` }}
                    onPointerDown={(e) => startTextDrag('hub-title', e)}
                  >
                    {LABELS.title.replace(' EcoSystem', '\nEcoSystem')}
                  </button>
                )
              })()}

              {/* Product images */}
              {layout.nodes.map((node) => {
                const meta = PRODUCT_META[node.id]
                return (
                  <div
                    key={node.id}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      'absolute z-20 flex cursor-grab items-center justify-center touch-none active:cursor-grabbing',
                      selectedId === node.id &&
                        'outline outline-2 outline-[#E4198C]/70',
                    )}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      width: `${node.w}%`,
                      height: `${node.h}%`,
                    }}
                    onPointerDown={(e) => startNodeDrag(node.id, e)}
                  >
                    <Image
                      src={meta.src}
                      alt={meta.label}
                      width={320}
                      height={320}
                      className="pointer-events-none h-full w-auto max-w-full object-contain drop-shadow-[0_6px_12px_rgba(74,29,110,0.14)]"
                      unoptimized
                      draggable={false}
                    />
                  </div>
                )
              })}

              {/* Free product labels */}
              {layout.nodes.map((node) => {
                const meta = PRODUCT_META[node.id]
                const labelPos = resolveNodeLabelPos(node)
                const kind = `label-${node.id}` as TextDragKind
                return (
                  <button
                    key={`label-${node.id}`}
                    type="button"
                    className={cn(
                      'absolute z-[24] -translate-x-1/2 cursor-grab whitespace-nowrap text-center font-poppins text-[clamp(10px,1vw,14px)] font-bold touch-none active:cursor-grabbing',
                      meta.branch === 'school'
                        ? 'text-[#5B2A86]'
                        : 'text-[#B61B78]',
                      selectedId === textSelectedId(kind) &&
                        'rounded outline outline-2 outline-[#E4198C]/70',
                    )}
                    style={{ left: `${labelPos.x}%`, top: `${labelPos.y}%` }}
                    onPointerDown={(e) => startTextDrag(kind, e)}
                  >
                    {meta.label}
                  </button>
                )
              })}

              {selectionBox && (
                <div
                  className="pointer-events-none absolute z-[35] border border-[#E4198C]"
                  style={{
                    left: `${selectionBox.left}%`,
                    top: `${selectionBox.top}%`,
                    width: `${selectionBox.width}%`,
                    height: `${selectionBox.height}%`,
                  }}
                >
                  {(['nw', 'ne', 'sw', 'se'] as ResizeCorner[]).map((corner) => (
                    <button
                      key={corner}
                      type="button"
                      aria-label={`Resize ${corner}`}
                      className={cn(
                        'pointer-events-auto absolute h-3.5 w-3.5 rounded-[3px] border-2 border-white bg-[#E4198C] shadow touch-none',
                        corner[0] === 'n' ? '-top-1.5' : '-bottom-1.5',
                        corner[1] === 'w' ? '-left-1.5' : '-right-1.5',
                        (corner === 'nw' || corner === 'se') && 'cursor-nwse-resize',
                        (corner === 'ne' || corner === 'sw') && 'cursor-nesw-resize',
                      )}
                      onPointerDown={(e) => startResize(corner, e)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <pre className="mt-4 max-h-48 overflow-auto rounded-2xl bg-[#310f32] p-4 font-mono text-xs text-[#f4eef2]">
          {code}
        </pre>
      </div>
    </main>
  )
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
  step = 0.5,
}: {
  label: string
  min: number
  max: number
  value: number
  onChange: (v: number) => void
  step?: number
}) {
  return (
    <label className="block font-inter text-xs">
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full"
      />
      <span className="text-font-400">{value}</span>
    </label>
  )
}
