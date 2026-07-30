/**
 * Shared layout for the homepage ecosystem diagram + `/ecosystem-edit` calibrator.
 * Positions are percentages of the canvas (left / top / width / height).
 */

export type EcosystemNodeId =
  | 'dashboard'
  | 'class'
  | 'school'
  | 'mon'
  | 'home'
  | 'parent'
  | 'pub'
  | 'smart-pen'

export type NodeLayout = {
  id: EcosystemNodeId
  x: number
  y: number
  w: number
  /** Image box height as % of canvas height */
  h: number
  /** Free product label position (canvas %). Auto under image if omitted. */
  labelX?: number
  labelY?: number
}

export type HubLayout = {
  /** Horizontal center % */
  x: number
  y: number
  w: number
  /** Logo height as % of canvas height */
  logoH: number
  /** Free hub title position (canvas %). Auto under logo if omitted. */
  titleX?: number
  titleY?: number
}

export type ZoneHeaderLayout = {
  x: number
  y: number
}

export type ZoneBoxLayout = {
  x: number
  y: number
  w: number
  h: number
}

export type PointPct = { x: number; y: number }

/**
 * Connector as a free-form polyline (Canva-style).
 * `from` / `to` are semantic anchors used only when `points` is omitted
 * (auto orthogonal route). Once the user edits a line, `points` becomes
 * the source of truth and can be dragged independently of the nodes.
 */
export type ConnectorDef = {
  from: 'hub' | EcosystemNodeId
  to: EcosystemNodeId
  /** Free waypoints in canvas %. When set, rendered as-is. */
  points?: PointPct[]
}

export type EcosystemLayout = {
  aspect: '16/10'
  hub: HubLayout
  nodes: NodeLayout[]
  connectors: ConnectorDef[]
  /** School / Home header text positions */
  zoneHeaders: {
    school: ZoneHeaderLayout
    home: ZoneHeaderLayout
  }
  /** School / Home background panel boxes */
  zoneBoxes: {
    school: ZoneBoxLayout
    home: ZoneBoxLayout
  }
  /** SVG stroke width in px (non-scaling). */
  strokeWidth: number
  /**
   * Rounded corner radius for ortho bends, in viewBox units (0–1000).
   * ~36–55 looks like soft S-curve elbows.
   */
  cornerRadius: number
}

export const PRODUCT_META: Record<
  EcosystemNodeId,
  { src: string; label: string; branch: 'school' | 'home' }
> = {
  dashboard: {
    src: '/ecosystem/dashboard.png',
    label: 'Lango Dashboard',
    branch: 'school',
  },
  class: {
    src: '/ecosystem/class.png',
    label: 'Lango Class',
    branch: 'school',
  },
  school: {
    src: '/ecosystem/school.png',
    label: 'Lango School App',
    branch: 'home',
  },
  mon: {
    src: '/ecosystem/mon.png',
    label: 'Lango Mon',
    branch: 'home',
  },
  home: {
    src: '/ecosystem/home.png',
    label: 'Lango Home',
    branch: 'home',
  },
  parent: {
    src: '/ecosystem/parent.png',
    label: 'Lango Parent',
    branch: 'home',
  },
  pub: {
    src: '/ecosystem/pub.png',
    label: 'Lango Pub',
    branch: 'home',
  },
  'smart-pen': {
    src: '/ecosystem/smart-pen.png',
    label: 'Lango Smart Pen',
    branch: 'home',
  },
}

/** Defaults matching the previous hard-coded desktop diagram. */
export const defaultEcosystemLayout: EcosystemLayout = {
  aspect: '16/10',
  strokeWidth: 2.2,
  cornerRadius: 42,
  hub: { x: 50, y: 5, w: 32, logoH: 16 },
  zoneHeaders: {
    school: { x: 5, y: 8 },
    home: { x: 70, y: 8 },
  },
  zoneBoxes: {
    school: { x: 2, y: 5, w: 33, h: 85 },
    home: { x: 65, y: 5, w: 33, h: 85 },
  },
  nodes: [
    { id: 'dashboard', x: 4, y: 16, w: 28, h: 22 },
    { id: 'class', x: 4, y: 48, w: 28, h: 20 },
    { id: 'school', x: 68, y: 14, w: 12, h: 26 },
    { id: 'mon', x: 84, y: 20, w: 10, h: 12 },
    { id: 'home', x: 76, y: 52, w: 16, h: 16 },
    { id: 'parent', x: 40, y: 56, w: 9, h: 24 },
    { id: 'pub', x: 50, y: 60, w: 12, h: 13 },
    { id: 'smart-pen', x: 62, y: 55, w: 6, h: 18 },
  ],
  connectors: [
    { from: 'hub', to: 'dashboard' },
    { from: 'dashboard', to: 'class' },
    { from: 'hub', to: 'school' },
    { from: 'school', to: 'mon' },
    { from: 'school', to: 'home' },
    { from: 'hub', to: 'parent' },
    { from: 'hub', to: 'pub' },
    { from: 'hub', to: 'smart-pen' },
  ],
}

/** Live homepage layout — paste editor output over this object. */
export const ecosystemLayout: EcosystemLayout = {
  aspect: '16/10',
  strokeWidth: 5.9,
  cornerRadius: 42,
  hub: { x: 51.3, y: 0, w: 34.6, logoH: 27.8, titleX: 50.2, titleY: 22.6 },
  zoneHeaders: {
    school: { x: 5, y: 8 },
    home: { x: 70, y: 8 },
  },
  zoneBoxes: {
    school: { x: 2, y: 5, w: 33, h: 85 },
    home: { x: 65, y: 5, w: 33, h: 85 },
  },
  nodes: [
    { id: 'dashboard', x: -1.7, y: 5.3, w: 41.7, h: 34.5, labelX: 19.2, labelY: 34 },
    { id: 'class', x: 2.8, y: 47.4, w: 32.9, h: 32.6, labelX: 19.3, labelY: 76.2 },
    { id: 'school', x: 66.4, y: 8.4, w: 15.3, h: 31.7, labelX: 74.1, labelY: 37 },
    { id: 'mon', x: 87, y: 15, w: 10, h: 12, labelX: 92, labelY: 25 },
    { id: 'home', x: 82, y: 40, w: 17.7, h: 19.3, labelX: 90.9, labelY: 56.8 },
    { id: 'parent', x: 41.5, y: 57.9, w: 17.1, h: 32.1, labelX: 50.3, labelY: 87.6 },
    { id: 'pub', x: 71.7, y: 61.5, w: 15.4, h: 17.1, labelX: 80, labelY: 76.2 },
    { id: 'smart-pen', x: 84, y: 61.5, w: 10.1, h: 19.9, labelX: 87.3, labelY: 80 },
  ],
  connectors: [
    { from: 'hub', to: 'dashboard', points: [{ x: 38.8, y: 21.1 }, { x: 32, y: 21.1 }] },
    { from: 'dashboard', to: 'class', points: [{ x: 19.2, y: 40 }, { x: 19.2, y: 50 }] },
    { from: 'hub', to: 'school', points: [{ x: 58.8, y: 21.1 }, { x: 68.5, y: 21.1 }] },
    { from: 'school', to: 'mon', points: [{ x: 80, y: 21 }, { x: 87.3, y: 21 }] },
    { from: 'school', to: 'home', points: [{ x: 57.1, y: 37 }, { x: 57.1, y: 49.7 }, { x: 82, y: 49.7 }] },
    { from: 'hub', to: 'parent', points: [{ x: 50, y: 37 }, { x: 50, y: 60.2 }] },
    { from: 'hub', to: 'pub', points: [{ x: 54.7, y: 37 }, { x: 54.7, y: 69.7 }, { x: 71.7, y: 69.7 }] },
    { from: 'hub', to: 'smart-pen', points: [{ x: 92, y: 47.4 }, { x: 92, y: 45.6 }] },
  ],
}

export function getNode(
  layout: EcosystemLayout,
  id: EcosystemNodeId,
): NodeLayout | undefined {
  return layout.nodes.find((n) => n.id === id)
}

/** Image-box center in % of canvas (label sits below, so we use image box only). */
export function nodeImageCenter(node: NodeLayout): { x: number; y: number } {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 }
}

/** Hub anchor: bottom of logo (title is free text now). */
export function hubAnchor(hub: HubLayout): { x: number; y: number } {
  return { x: hub.x, y: hub.y + hub.logoH + 2 }
}

/** Product label position — free coords or auto under image. */
export function resolveNodeLabelPos(node: NodeLayout): PointPct {
  if (typeof node.labelX === 'number' && typeof node.labelY === 'number') {
    return { x: node.labelX, y: node.labelY }
  }
  return { x: round1(node.x + node.w / 2), y: round1(node.y + node.h + 1.2) }
}

/** Hub title position — free coords or auto under logo. */
export function resolveHubTitlePos(hub: HubLayout): PointPct {
  if (typeof hub.titleX === 'number' && typeof hub.titleY === 'number') {
    return { x: hub.titleX, y: hub.titleY }
  }
  return { x: hub.x, y: round1(hub.y + hub.logoH + 0.8) }
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

export function resolveAnchor(
  layout: EcosystemLayout,
  id: 'hub' | EcosystemNodeId,
): PointPct | null {
  if (id === 'hub') return hubAnchor(layout.hub)
  const node = getNode(layout, id)
  return node ? nodeImageCenter(node) : null
}

/** Auto orthogonal L between two anchors (canvas %). */
export function autoOrthoPoints(from: PointPct, to: PointPct): PointPct[] {
  const dx = Math.abs(to.x - from.x)
  const dy = Math.abs(to.y - from.y)
  if (dx >= dy) {
    return [
      { ...from },
      { x: to.x, y: from.y },
      { ...to },
    ]
  }
  return [
    { ...from },
    { x: from.x, y: to.y },
    { ...to },
  ]
}

/** Soft S / step bend (HVH or VHV) like rounded orthogonal connectors. */
export function autoStepPoints(from: PointPct, to: PointPct): PointPct[] {
  const dx = Math.abs(to.x - from.x)
  const dy = Math.abs(to.y - from.y)
  if (dx >= dy) {
    const midX = round1((from.x + to.x) / 2)
    return [
      { ...from },
      { x: midX, y: from.y },
      { x: midX, y: to.y },
      { ...to },
    ]
  }
  const midY = round1((from.y + to.y) / 2)
  return [
    { ...from },
    { x: from.x, y: midY },
    { x: to.x, y: midY },
    { ...to },
  ]
}

/**
 * Force every segment horizontal or vertical (keeps rounded elbows valid).
 */
export function enforceOrthoPoints(points: PointPct[]): PointPct[] {
  if (points.length <= 1) return points.map((p) => ({ ...p }))
  const pts = points.map((p) => ({ x: round1(p.x), y: round1(p.y) }))

  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const dx = Math.abs(b.x - a.x)
    const dy = Math.abs(b.y - a.y)
    if (dx < 0.05 || dy < 0.05) continue

    if (i === pts.length - 1 && i >= 2) {
      // Keep endpoint free; fix previous elbow into a clean Z/L
      const prev = pts[i - 2]
      const elbow = pts[i - 1]
      const candA = { x: round1(b.x), y: round1(prev.y) }
      const candB = { x: round1(prev.x), y: round1(b.y) }
      const distA = Math.hypot(candA.x - elbow.x, candA.y - elbow.y)
      const distB = Math.hypot(candB.x - elbow.x, candB.y - elbow.y)
      pts[i - 1] = distA <= distB ? candA : candB
      continue
    }

    if (dx >= dy) pts[i] = { x: b.x, y: a.y }
    else pts[i] = { x: a.x, y: b.y }
  }

  // Collapse near-duplicates
  const cleaned: PointPct[] = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const prev = cleaned[cleaned.length - 1]
    if (Math.hypot(pts[i].x - prev.x, pts[i].y - prev.y) < 0.15) continue
    cleaned.push(pts[i])
  }
  if (cleaned.length < 2) return pts
  return cleaned
}

/**
 * Move one waypoint, then repair orthogonal routing.
 * Mid bends: drag shifts the elbow; ends: drag endpoint and reshape elbow.
 */
export function moveOrthoPoint(
  points: PointPct[],
  index: number,
  next: PointPct,
): PointPct[] {
  if (index < 0 || index >= points.length) return points
  const pts = points.map((p) => ({ ...p }))
  pts[index] = { x: round1(next.x), y: round1(next.y) }

  if (index > 0 && index < pts.length - 1) {
    // Elbow: keep ortho to both neighbors by choosing axis from drag delta
    const prev = pts[index - 1]
    const fol = pts[index + 1]
    const preferVertical =
      Math.abs(next.x - prev.x) + Math.abs(next.x - fol.x) <
      Math.abs(next.y - prev.y) + Math.abs(next.y - fol.y)
    if (preferVertical) {
      // vertical run through this elbow → share X with one neighbor
      const shareX =
        Math.abs(next.x - prev.x) <= Math.abs(next.x - fol.x) ? prev.x : fol.x
      pts[index] = { x: round1(shareX), y: round1(next.y) }
      // Pull neighbors onto the ortho grid
      if (Math.abs(prev.x - pts[index].x) > 0.05 && Math.abs(prev.y - pts[index].y) > 0.05) {
        pts[index - 1] = { x: pts[index].x, y: prev.y }
      }
      if (Math.abs(fol.x - pts[index].x) > 0.05 && Math.abs(fol.y - pts[index].y) > 0.05) {
        pts[index + 1] = { x: pts[index].x, y: fol.y }
      }
    } else {
      const shareY =
        Math.abs(next.y - prev.y) <= Math.abs(next.y - fol.y) ? prev.y : fol.y
      pts[index] = { x: round1(next.x), y: round1(shareY) }
      if (Math.abs(prev.x - pts[index].x) > 0.05 && Math.abs(prev.y - pts[index].y) > 0.05) {
        pts[index - 1] = { x: prev.x, y: pts[index].y }
      }
      if (Math.abs(fol.x - pts[index].x) > 0.05 && Math.abs(fol.y - pts[index].y) > 0.05) {
        pts[index + 1] = { x: fol.x, y: pts[index].y }
      }
    }
  }

  return enforceOrthoPoints(pts)
}

/** Insert an S-step bend (rounded ortho style). */
export function insertOrthoBend(points: PointPct[]): PointPct[] {
  const pts = enforceOrthoPoints(points)
  if (pts.length < 2) return pts

  if (pts.length === 2) {
    return autoStepPoints(pts[0], pts[1])
  }

  // Find longest segment and turn it into a step
  let bestI = 0
  let bestLen = -1
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    const len = Math.abs(b.x - a.x) + Math.abs(b.y - a.y)
    if (len > bestLen) {
      bestLen = len
      bestI = i
    }
  }
  const a = pts[bestI]
  const b = pts[bestI + 1]
  const horizontal = Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)
  const mid = horizontal
    ? [
        { x: round1((a.x + b.x) / 2), y: a.y },
        { x: round1((a.x + b.x) / 2), y: b.y },
      ]
    : [
        { x: a.x, y: round1((a.y + b.y) / 2) },
        { x: b.x, y: round1((a.y + b.y) / 2) },
      ]

  return enforceOrthoPoints([
    ...pts.slice(0, bestI + 1),
    ...mid,
    ...pts.slice(bestI + 1),
  ])
}

/**
 * Resolved waypoints for a connector.
 * Free `points` win; otherwise auto-route from anchors.
 */
export function resolveConnectorPoints(
  layout: EcosystemLayout,
  connector: ConnectorDef,
): PointPct[] {
  if (connector.points && connector.points.length >= 2) {
    return enforceOrthoPoints(connector.points.map((p) => ({ x: p.x, y: p.y })))
  }
  const from = resolveAnchor(layout, connector.from)
  const to = resolveAnchor(layout, connector.to)
  if (!from || !to) return []
  return autoOrthoPoints(from, to)
}

/** Bake auto route into editable free points (call on first user edit). */
export function bakeConnectorPoints(
  layout: EcosystemLayout,
  connector: ConnectorDef,
): ConnectorDef {
  if (connector.points && connector.points.length >= 2) {
    return { ...connector, points: enforceOrthoPoints(connector.points) }
  }
  return {
    ...connector,
    points: resolveConnectorPoints(layout, connector),
  }
}

/** viewBox 1000×1000 coords from % points. */
export function pointsToViewBox(points: PointPct[]): [number, number][] {
  return points.map((p) => [p.x * 10, p.y * 10])
}

/** Rounded orthogonal SVG path (viewBox coords). */
export function roundedOrthoPath(
  points: [number, number][],
  radius = 42,
): string {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`
  }
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length - 1; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    const [x2, y2] = points[i + 1]
    const dxIn = Math.sign(x1 - x0)
    const dyIn = Math.sign(y1 - y0)
    const dxOut = Math.sign(x2 - x1)
    const dyOut = Math.sign(y2 - y1)
    // Skip collinear joints
    if (dxIn === dxOut && dyIn === dyOut) {
      d += ` L ${x1} ${y1}`
      continue
    }
    const segIn = Math.abs(x1 - x0) + Math.abs(y1 - y0)
    const segOut = Math.abs(x2 - x1) + Math.abs(y2 - y1)
    const r = Math.min(radius, segIn / 2, segOut / 2)
    if (r < 1) {
      d += ` L ${x1} ${y1}`
      continue
    }
    d += ` L ${x1 - dxIn * r} ${y1 - dyIn * r}`
    d += ` Q ${x1} ${y1} ${x1 + dxOut * r} ${y1 + dyOut * r}`
  }
  const [lx, ly] = points[points.length - 1]
  d += ` L ${lx} ${ly}`
  return d
}

/** @deprecated use resolveConnectorPoints + pointsToViewBox */
export function orthoPoints(
  from: PointPct,
  to: PointPct,
): [number, number][] {
  return pointsToViewBox(autoOrthoPoints(from, to))
}

function formatPoint(p: PointPct): string {
  return `{ x: ${p.x}, y: ${p.y} }`
}

function formatConnector(c: ConnectorDef): string {
  const parts = [`from: '${c.from}'`, `to: '${c.to}'`]
  if (c.points && c.points.length >= 2) {
    parts.push(`points: [${c.points.map(formatPoint).join(', ')}]`)
  }
  return `    { ${parts.join(', ')} },`
}

/** Serialize layout as TypeScript source for copy-paste into this file. */
export function formatEcosystemLayoutTs(layout: EcosystemLayout): string {
  const hub = layout.hub
  const hubParts = [
    `x: ${hub.x}`,
    `y: ${hub.y}`,
    `w: ${hub.w}`,
    `logoH: ${hub.logoH}`,
  ]
  if (typeof hub.titleX === 'number') hubParts.push(`titleX: ${hub.titleX}`)
  if (typeof hub.titleY === 'number') hubParts.push(`titleY: ${hub.titleY}`)

  const nodes = layout.nodes
    .map((n) => {
      const parts = [
        `id: '${n.id}'`,
        `x: ${n.x}`,
        `y: ${n.y}`,
        `w: ${n.w}`,
        `h: ${n.h}`,
      ]
      if (typeof n.labelX === 'number') parts.push(`labelX: ${n.labelX}`)
      if (typeof n.labelY === 'number') parts.push(`labelY: ${n.labelY}`)
      return `    { ${parts.join(', ')} },`
    })
    .join('\n')
  const connectors = layout.connectors.map(formatConnector).join('\n')
  const zh = layout.zoneHeaders
  const zb = layout.zoneBoxes

  return `export const ecosystemLayout: EcosystemLayout = {
  aspect: '16/10',
  strokeWidth: ${layout.strokeWidth},
  cornerRadius: ${layout.cornerRadius},
  hub: { ${hubParts.join(', ')} },
  zoneHeaders: {
    school: { x: ${zh.school.x}, y: ${zh.school.y} },
    home: { x: ${zh.home.x}, y: ${zh.home.y} },
  },
  zoneBoxes: {
    school: { x: ${zb.school.x}, y: ${zb.school.y}, w: ${zb.school.w}, h: ${zb.school.h} },
    home: { x: ${zb.home.x}, y: ${zb.home.y}, w: ${zb.home.w}, h: ${zb.home.h} },
  },
  nodes: [
${nodes}
  ],
  connectors: [
${connectors}
  ],
}`
}
