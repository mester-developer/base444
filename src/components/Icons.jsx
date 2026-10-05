/* Minimal thin-line icon system. Icons are direction-aware: `Arrow` points
   forward (left) in RTL. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Svg = ({ children, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...base}>
    {children}
  </svg>
)

export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </Svg>
)

export const IconUser = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4S18.3 16.4 19.5 20" />
  </Svg>
)

export const IconBag = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l-1.2 12.5H6.2L5 8z" />
    <path d="M9 8V6.6A3 3 0 0 1 12 3.6a3 3 0 0 1 3 3V8" />
  </Svg>
)

export const IconHeart = ({ filled, ...p }) => (
  <Svg {...p}>
    <path
      d="M12 20s-7.4-4.4-7.4-9.2A4.4 4.4 0 0 1 12 8.4a4.4 4.4 0 0 1 7.4 2.4C19.4 15.6 12 20 12 20z"
      fill={filled ? 'currentColor' : 'none'}
    />
  </Svg>
)

export const IconArrow = (p) => (
  <Svg {...p}>
    <path d="M19 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </Svg>
)

export const IconArrowDown = (p) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="M6 13l6 6 6-6" />
  </Svg>
)

export const IconMenu = (p) => (
  <Svg {...p}>
    <path d="M3 7h18" />
    <path d="M3 12h18" />
    <path d="M3 17h12" />
  </Svg>
)

export const IconClose = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </Svg>
)

export const IconFilter = (p) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M7 12h10" />
    <path d="M10 17h4" />
  </Svg>
)

export const IconChevron = ({ dir = 'down', ...p }) => {
  const rotate = { down: 0, up: 180, start: -90, end: 90 }[dir]
  return (
    <span style={{ display: 'inline-flex', transform: `rotate(${rotate}deg)` }}>
      <Svg {...p}>
        <path d="M6 9l6 6 6-6" />
      </Svg>
    </span>
  )
}

export const IconPlus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Svg>
)

export const IconMinus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
)

export const IconTrash = (p) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 13h10l1-13" />
  </Svg>
)

export const IconZoom = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
    <path d="M8.6 11h4.8M11 8.6v4.8" />
  </Svg>
)

export const IconStar = ({ filled, ...p }) => (
  <Svg {...p}>
    <path
      d="M12 4.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 10.2l5.4-.8z"
      fill={filled ? 'currentColor' : 'none'}
    />
  </Svg>
)

export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="M5 13l4.5 4.5L19 7" />
  </Svg>
)

export const IconTruck = (p) => (
  <Svg {...p}>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </Svg>
)

export const IconShield = (p) => (
  <Svg {...p}>
    <path d="M12 3.5l7 2.5v6c0 4-3 7-7 8.5-4-1.5-7-4.5-7-8.5v-6z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
)

export const IconSnow = (p) => (
  <Svg {...p}>
    <path d="M12 3v18" />
    <path d="M4.2 7.5l15.6 9" />
    <path d="M19.8 7.5l-15.6 9" />
  </Svg>
)

export const IconPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10z" />
    <circle cx="12" cy="11" r="2.2" />
  </Svg>
)

export const IconPhone = (p) => (
  <Svg {...p}>
    <path d="M6 3.5h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3c0 1.1-.9 2-2 2A15.5 15.5 0 0 1 4 5.5c0-1.1.9-2 2-2z" />
  </Svg>
)

export const IconMail = (p) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </Svg>
)

export const IconInstagram = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
)

export const IconTelegram = (p) => (
  <Svg {...p}>
    <path d="M20.5 4.5L3.8 11.2l4.6 1.3 1.4 4.9 2.6-3.1 4.4 3.2z" />
    <path d="M8.4 12.5l7-5.5" />
  </Svg>
)

export const IconUser2 = IconUser
