import { useMemo } from 'react'

/* Deterministic pseudo-random generator so every "photograph" is stable
   across renders, reloads and routes. */
function rng(seed) {
  let a = seed * 1831565813 + 0x6d2b79f5
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 300
const H = 400

const C = {
  skyHi: '#eef5f8',
  far: '#93a9b8',
  mid: '#6d8697',
  near: '#3f5766',
  deep: '#243844',
  night: '#172a35',
  frost: '#afc4d2',
  steel: '#8fa8b8',
  light: '#dde8ed',
  white: '#f4f7f8',
}

const ridgePoints = (r, baseY, amp, steps = 7) => {
  const pts = []
  for (let i = 0; i <= steps; i += 1) {
    const x = (i / steps) * W
    const peak = i % 2 === 0 ? amp : amp * (0.3 + r() * 0.42)
    const y = baseY - peak * (0.62 + r() * 0.72)
    pts.push([x, Math.max(6, Math.min(baseY, y))])
  }
  return pts
}

const toLine = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
const toArea = (pts) => `M0,${H} L${toLine(pts)} L${W},${H} Z`

const snow = (r, count, yMax = H) =>
  Array.from({ length: count }).map((_, i) => (
    <circle
      key={`sn${i}`}
      cx={(r() * W).toFixed(1)}
      cy={(r() * yMax).toFixed(1)}
      r={(0.5 + r() * 1.5).toFixed(2)}
      fill={C.white}
      opacity={(0.16 + r() * 0.44).toFixed(2)}
    />
  ))

/* ---------- landscape ---------- */
function peaks(r, uid, soft = false) {
  const layers = soft
    ? [
        { y: 250, amp: 92, fill: C.far, o: 0.55 },
        { y: 282, amp: 74, fill: C.mid, o: 0.7 },
        { y: 318, amp: 56, fill: C.near, o: 0.86 },
        { y: 352, amp: 38, fill: C.night, o: 0.95 },
      ]
    : [
        { y: 258, amp: 104, fill: C.far, o: 0.5 },
        { y: 288, amp: 86, fill: C.mid, o: 0.72 },
        { y: 324, amp: 62, fill: C.near, o: 0.9 },
        { y: 362, amp: 42, fill: C.night, o: 1 },
      ]

  return (
    <g>
      <rect width={W} height={H} fill={`url(#sky-${uid})`} />
      {!soft && <circle cx={W * 0.72} cy={104} r={42} fill={C.white} opacity="0.2" />}
      {!soft && <circle cx={W * 0.72} cy={104} r={20} fill={C.white} opacity="0.34" />}
      {layers.map((l, i) => {
        const pts = ridgePoints(r, l.y, l.amp)
        return (
          <g key={i}>
            <path d={toArea(pts)} fill={l.fill} opacity={l.o} />
            <polyline points={toLine(pts)} fill="none" stroke={C.white} strokeWidth="1.4" opacity="0.32" />
          </g>
        )
      })}
      <rect y={300} width={W} height={100} fill={C.white} opacity="0.1" />
      <rect y={344} width={W} height={56} fill={C.white} opacity="0.15" />
      {snow(r, 56, 250)}
    </g>
  )
}

function iceField(r, uid) {
  const shards = Array.from({ length: 16 }).map((_, i) => {
    const x = r() * W
    const w = 6 + r() * 26
    const top = 40 + r() * 150
    return (
      <polygon
        key={i}
        points={`${x},${top} ${x + w},${top + 30 + r() * 40} ${x + w * 0.42},${H}`}
        fill={i % 2 ? C.steel : C.frost}
        opacity={(0.28 + r() * 0.5).toFixed(2)}
      />
    )
  })
  const cracks = Array.from({ length: 9 }).map((_, i) => {
    const y = 120 + i * 28 + r() * 10
    return (
      <polyline
        key={i}
        points={`0,${y} ${W * 0.3},${y - 8 - r() * 12} ${W * 0.62},${y + 6 + r() * 12} ${W},${y - 4}`}
        fill="none"
        stroke={C.white}
        strokeWidth="0.9"
        opacity="0.24"
      />
    )
  })
  return (
    <g>
      <rect width={W} height={H} fill={`url(#skyIce-${uid})`} />
      {shards}
      {cracks}
      <rect width={W} height={H} fill={C.deep} opacity="0.08" />
    </g>
  )
}

function cityscape(r, uid) {
  const blocks = []
  let x = -10
  let n = 0
  while (x < W) {
    const w = 22 + r() * 44
    const h = 90 + r() * 190
    blocks.push(<rect key={`b${n}`} x={x} y={H - h} width={w} height={h} fill={r() > 0.5 ? C.near : C.deep} opacity={(0.82 + r() * 0.18).toFixed(2)} />)
    const wins = []
    for (let wy = H - h + 14; wy < H - 20; wy += 22) {
      for (let wx = x + 7; wx < x + w - 9; wx += 15) {
        if (r() > 0.62) wins.push(<rect key={`w${wx}-${wy}`} x={wx} y={wy} width="5" height="7" fill={C.white} opacity={(0.18 + r() * 0.4).toFixed(2)} />)
      }
    }
    blocks.push(<g key={`g${n}`}>{wins}</g>)
    x += w + 4
    n += 1
  }
  return (
    <g>
      <rect width={W} height={H} fill={`url(#skyIce-${uid})`} />
      <circle cx={W * 0.3} cy={112} r={34} fill={C.white} opacity="0.16" />
      {blocks}
      <rect y={H - 58} width={W} height={58} fill={C.night} opacity="0.9" />
      <rect y={H - 60} width={W} height={2} fill={C.white} opacity="0.26" />
      {snow(r, 42, 340)}
    </g>
  )
}

/* ---------- garments ---------- */
const quilt = (r, x, y, w, h, cols, rows, gap, fill, seam) => {
  const cells = []
  const cw = w / cols
  const ch = h / rows
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      cells.push(
        <rect
          key={`q${i}-${j}`}
          x={x + i * cw + gap / 2}
          y={y + j * ch + gap / 2}
          width={cw - gap}
          height={ch - gap}
          rx="7"
          fill={fill}
          opacity={(0.72 + r() * 0.24).toFixed(2)}
          stroke={seam}
          strokeWidth="0.7"
        />,
      )
    }
  }
  return cells
}

function garment(kind, r, uid) {
  const bg = (
    <g>
      <rect width={W} height={H} fill={`url(#studio-${uid})`} />
      <rect y={H * 0.72} width={W} height={H * 0.28} fill={C.steel} opacity="0.26" />
      <ellipse cx={W / 2} cy={H * 0.86} rx="96" ry="14" fill={C.night} opacity="0.14" />
    </g>
  )

  if (kind === 'hoodie') {
    return (
      <g>
        {bg}
        <path d="M92,150 Q88,96 150,92 Q212,96 208,150 L216,340 Q150,354 84,340 Z" fill={C.frost} opacity="0.95" />
        <ellipse cx={150} cy={140} rx="46" ry="34" fill={C.light} opacity="0.9" />
        <ellipse cx={150} cy={142} rx="34" ry="24" fill={C.steel} opacity="0.6" />
        <path d="M132,170 L128,214" stroke={C.white} strokeWidth="2.4" opacity="0.7" />
        <path d="M168,170 L172,214" stroke={C.white} strokeWidth="2.4" opacity="0.7" />
        {quilt(r, 92, 196, 116, 120, 3, 3, 3, C.steel, C.white)}
        <rect x="86" y="330" width="128" height="20" rx="4" fill={C.steel} opacity="0.85" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={92 + i * 16} y="332" width="4" height="16" fill={C.night} opacity="0.35" />
        ))}
      </g>
    )
  }

  if (kind === 'pants') {
    return (
      <g>
        {bg}
        <path d="M96,132 H204 L214,352 H164 L152,206 L138,352 H88 Z" fill={C.steel} opacity="0.92" />
        {quilt(r, 96, 138, 108, 62, 4, 2, 4, C.frost, C.white)}
        {quilt(r, 100, 214, 46, 120, 2, 3, 4, C.frost, C.white)}
        {quilt(r, 156, 214, 46, 120, 2, 3, 4, C.frost, C.white)}
        <rect x="88" y="342" width="58" height="18" rx="3" fill={C.night} opacity="0.7" />
        <rect x="158" y="342" width="58" height="18" rx="3" fill={C.night} opacity="0.7" />
        <path d="M96,132 H204" stroke={C.white} strokeWidth="3" opacity="0.5" />
      </g>
    )
  }

  if (kind === 'beanie') {
    return (
      <g>
        {bg}
        <path d="M84,236 Q84,108 150,104 Q216,108 216,236 Z" fill={C.steel} opacity="0.95" />
        {Array.from({ length: 11 }).map((_, i) => (
          <path
            key={i}
            d={`M${90 + i * 12},${128 + Math.abs(5 - i) * 6} L${90 + i * 12},236`}
            stroke={C.night}
            strokeWidth="1.1"
            opacity="0.22"
          />
        ))}
        <rect x="80" y="232" width="140" height="34" rx="5" fill={C.frost} opacity="0.95" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={`r${i}`} x={84 + i * 11} y="236" width="4" height="26" fill={C.steel} opacity="0.45" />
        ))}
        <rect x="176" y="238" width="22" height="12" rx="2" fill={C.night} opacity="0.75" />
      </g>
    )
  }

  if (kind === 'parka') {
    return (
      <g>
        {bg}
        <path d="M86,152 Q82,88 150,84 Q218,88 214,152 L222,368 H78 Z" fill={C.near} opacity="0.95" />
        {quilt(r, 84, 158, 134, 200, 3, 6, 4, C.steel, C.white)}
        <path d="M104,90 Q150,64 196,90 L206,124 Q150,104 94,124 Z" fill={C.frost} opacity="0.95" />
        <path d="M96,120 Q150,100 204,120" stroke={C.white} strokeWidth="8" opacity="0.3" strokeLinecap="round" />
        <path d="M150,150 L150,368" stroke={C.night} strokeWidth="2" opacity="0.4" />
        <rect x="84" y="196" width="46" height="40" rx="3" fill={C.deep} opacity="0.7" />
        <rect x="170" y="196" width="46" height="40" rx="3" fill={C.deep} opacity="0.7" />
      </g>
    )
  }

  const vertical = kind === 'channel'
  return (
    <g>
      {bg}
      <path d="M88,150 Q84,92 150,88 Q216,92 212,150 L218,356 H82 Z" fill={C.frost} opacity="0.96" />
      <path d="M110,90 Q150,68 190,90 L196,120 Q150,104 104,120 Z" fill={C.steel} opacity="0.95" />
      {vertical
        ? quilt(r, 84, 124, 132, 236, 4, 7, 4, C.steel, C.white)
        : quilt(r, 84, 124, 132, 236, 7, 4, 4, C.steel, C.white)}
      <path d="M150,124 L150,356" stroke={C.night} strokeWidth="1.6" opacity="0.34" />
      <rect x="138" y="124" width="24" height="10" rx="2" fill={C.night} opacity="0.55" />
      <rect x="96" y="240" width="42" height="34" rx="3" fill={C.deep} opacity="0.5" />
      <rect x="162" y="240" width="42" height="34" rx="3" fill={C.deep} opacity="0.5" />
      <path d="M84,352 H216" stroke={C.white} strokeWidth="3" opacity="0.45" />
    </g>
  )
}

function portrait(r, uid, soft = false) {
  return (
    <g>
      <rect width={W} height={H} fill={`url(#studioPortrait-${uid})`} />
      <rect y={H * 0.78} width={W} height={H * 0.22} fill={C.steel} opacity="0.28" />
      <circle cx={W * 0.5} cy="128" r="34" fill={C.deep} opacity="0.92" />
      <path d="M118,166 Q150,148 182,166 L196,392 H104 Z" fill={soft ? C.steel : C.frost} opacity="0.94" />
      {quilt(r, 104, 176, 92, 216, soft ? 3 : 4, soft ? 8 : 6, 4, C.steel, C.white)}
      <rect x="140" y="96" width="20" height="8" rx="3" fill={C.night} opacity="0.65" />
      <path d="M104,300 L196,300" stroke={C.white} strokeWidth="2" opacity="0.2" />
      <ellipse cx={W * 0.5} cy="396" rx="74" ry="10" fill={C.night} opacity="0.16" />
      {snow(r, 20, 120)}
    </g>
  )
}

const VARIANTS = {
  peak: (r, uid) => peaks(r, uid, false),
  ridge: (r, uid) => peaks(r, uid, true),
  ice: (r, uid) => iceField(r, uid),
  urban: (r, uid) => cityscape(r, uid),
  puffer: (r, uid) => garment('puffer', r, uid),
  channel: (r, uid) => garment('channel', r, uid),
  parka: (r, uid) => garment('parka', r, uid),
  hoodie: (r, uid) => garment('hoodie', r, uid),
  pants: (r, uid) => garment('pants', r, uid),
  accessory: (r, uid) => garment('beanie', r, uid),
  portrait: (r, uid) => portrait(r, uid, false),
  'portrait-soft': (r, uid) => portrait(r, uid, true),
}

export default function SceneImage({
  variant = 'ridge',
  seed = 1,
  ratio = '4/5',
  className = '',
  alt = '',
  tag,
  detail = false,
  children,
  style,
}) {
  const uid = `${variant}-${seed}`
  const art = useMemo(() => {
    const r = rng(seed)
    const build = VARIANTS[variant] || VARIANTS.ridge
    return build(r, uid)
  }, [variant, seed, uid])

  return (
    <div className={`scene ${className}`} style={{ aspectRatio: ratio, ...style }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={alt || 'تصویر کالکشن فریز'}
      >
        <defs>
          <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor={C.skyHi} />
            <stop offset="58%" stopColor={C.frost} />
            <stop offset="100%" stopColor={C.steel} />
          </linearGradient>
          <linearGradient id={`skyIce-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor={C.skyHi} />
            <stop offset="100%" stopColor={C.steel} />
          </linearGradient>
          <linearGradient id={`studio-${uid}`} x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={C.light} />
            <stop offset="100%" stopColor={C.frost} />
          </linearGradient>
          <linearGradient id={`studioPortrait-${uid}`} x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={C.frost} />
            <stop offset="100%" stopColor={C.steel} />
          </linearGradient>
        </defs>
        {detail ? <g transform="translate(-118,-172) scale(1.9)">{art}</g> : art}
      </svg>
      <span className="scene__grain" aria-hidden="true" />
      {tag && <span className="scene__tag">{tag}</span>}
      {children}
    </div>
  )
}
