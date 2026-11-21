// Оригинальные милые SVG-иллюстрации в стиле "simple cute doodle":
// черные кошечки, бабочки и цветочки. Нарисованы с нуля для этого сайта.

export function CatSit({ className = '', blink = false }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M30 100c-4-28 2-46 10-54-2-8-6-16-2-22 5 2 9 8 12 14 6-2 12-2 18 0 3-6 7-12 12-14 4 6 0 14-2 22 8 8 14 26 10 54-14 8-44 8-58 0Z"
        fill="#201e22"
      />
      <path d="M38 24c-6-6-16-8-20-4 2 8 10 14 18 16Z" fill="#201e22" />
      <path d="M82 24c6-6 16-8 20-4-2 8-10 14-18 16Z" fill="#201e22" />
      {!blink ? (
        <>
          <circle cx="50" cy="66" r="3.4" fill="#fff" />
          <circle cx="70" cy="66" r="3.4" fill="#fff" />
        </>
      ) : (
        <>
          <path d="M46 66q4-4 8 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path d="M66 66q4-4 8 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      <ellipse cx="42" cy="76" rx="4" ry="2.4" fill="#ec9fb0" opacity="0.7" />
      <ellipse cx="78" cy="76" rx="4" ry="2.4" fill="#ec9fb0" opacity="0.7" />
      <path d="M58 72q2 2 4 0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function CatHeadphones({ className = '' }) {
  return (
    <svg viewBox="0 0 100 110" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 18c6-10 14-10 16 0-2 3-10 6-16 6s-14-3-16-6c2-10 10-10 16 0Z" fill="#201e22" />
      <rect x="30" y="30" width="40" height="50" rx="18" fill="#201e22" />
      <path d="M30 44c-10 0-10 20 0 20M70 44c10 0 10 20 0 20" stroke="#b9c7d6" strokeWidth="5" strokeLinecap="round" />
      <path d="M28 40c-6-4-10-16-4-24" stroke="#201e22" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="56" r="3" fill="#fff" />
      <circle cx="58" cy="56" r="3" fill="#fff" />
      <path d="M46 66q4 3 8 0" stroke="#b9c7d6" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 20l6 4M20 16l3 7M10 26l7 2" stroke="#b9c7d6" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function CatSleep({ className = '' }) {
  return (
    <svg viewBox="0 0 140 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="38" width="120" height="8" rx="4" fill="#e4c9a4" />
      <path
        d="M55 30c20-4 40 0 48 16 6 12-2 26-20 28-20 2-40-2-50-14-8-10-2-26 22-30Z"
        fill="#201e22"
      />
      <path d="M50 30c-2-6 0-12 6-14 2 5 1 10-1 14Z" fill="#201e22" />
      <path d="M96 32c4-5 10-6 14-3-1 5-6 8-11 9Z" fill="#201e22" />
      <path d="M64 46q4-3 8 0M76 48q4-3 8 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="60" cy="54" rx="3.5" ry="2.4" fill="#ec9fb0" />
      <path d="M90 60q10 4 16-2" stroke="#201e22" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function Butterfly({ className = '', color = '#bcd6ea', ...rest }) {
  return (
    <svg viewBox="0 0 80 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path d="M40 10c-4-10-28-14-34-2-4 10 10 20 34 16Z" fill="none" stroke="#3a3a42" strokeWidth="2.2" />
      <path d="M40 10c4-10 28-14 34-2 4 10-10 20-34 16Z" fill="none" stroke="#3a3a42" strokeWidth="2.2" />
      <path d="M40 18c-3-6-20-9-26-1-4 7 7 15 26 12Z" fill={color} opacity="0.65" />
      <path d="M40 18c3-6 20-9 26-1 4 7-7 15-26 12Z" fill={color} opacity="0.65" />
      <path d="M40 10v26" stroke="#3a3a42" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Flower({ className = '', color = '#bcd6ea', ...rest }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="30"
          cy="16"
          rx="9"
          ry="13"
          fill={color}
          transform={`rotate(${deg} 30 30)`}
          opacity="0.9"
        />
      ))}
      <circle cx="30" cy="30" r="6" fill="#f6e2a8" />
    </svg>
  )
}

export function PawPrint({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="#201e22" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="26" rx="10" ry="8" />
      <ellipse cx="9" cy="14" rx="4" ry="5" />
      <ellipse cx="18" cy="8" rx="4" ry="5.5" />
      <ellipse cx="28" cy="10" rx="4" ry="5" />
      <ellipse cx="34" cy="18" rx="3.6" ry="4.6" />
    </svg>
  )
}
