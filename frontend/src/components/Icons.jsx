// Простые оригинальные линейные иконки — вместо эмодзи.
// Единый стиль: stroke="currentColor", без заливки.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconHome({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  )
}

export function IconCamera({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.4" />
    </svg>
  )
}

export function IconMusic({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </svg>
  )
}

export function IconEnvelope({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  )
}

export function IconSearch({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  )
}

export function IconCheckList({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="m4 6 1.6 1.6L8 5" />
      <path d="M11 6h9" />
      <path d="m4 13 1.6 1.6L8 12" />
      <path d="M11 13h9" />
      <path d="m4 20 1.6 1.6L8 19" />
      <path d="M11 20h9" />
    </svg>
  )
}

export function IconPlay({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M8 5v14l12-7Z" />
    </svg>
  )
}

export function IconPause({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="7" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

export function IconPlus({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconClose({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function IconBulb({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5a2.6 2.6 0 0 1 1.1-2.2A6 6 0 0 0 12 3Z" />
    </svg>
  )
}

export function IconSpeaker({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 10v4h4l5 4V6L8 10H4Z" />
      <path d="M17 9a4 4 0 0 1 0 6" />
    </svg>
  )
}

export function IconSpeakerMute({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 10v4h4l5 4V6L8 10H4Z" />
      <path d="m16 10 4 4M20 10l-4 4" />
    </svg>
  )
}

export function IconLock({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
