// Оригинальный набор "бин-котиков" — мягкие, круглые, минималистичные.
// Нарисованы с нуля для этого сайта (вдохновение — жанр "кругленьких котиков",
// без копирования конкретных референсов/стикерпаков).

export function CatBlobSit({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22 86c-6-24 2-46 28-46s34 22 28 46c-16 10-40 10-56 0Z" fill="#221f23" />
      <path d="M34 42c-4-10-2-20 4-20 3 7 2 14 0 20Z" fill="#221f23" />
      <path d="M66 42c4-10 2-20-4-20-3 7-2 14 0 20Z" fill="#221f23" />
      <circle cx="42" cy="60" r="3.2" fill="#fff" />
      <circle cx="58" cy="60" r="3.2" fill="#fff" />
      <ellipse cx="35" cy="68" rx="3.6" ry="2.2" fill="#ec9fb0" opacity="0.8" />
      <ellipse cx="65" cy="68" rx="3.6" ry="2.2" fill="#ec9fb0" opacity="0.8" />
      <path d="M46 65q4 3 8 0" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function CatBlobLoaf({ className = '' }) {
  // "кот-батон" — лежит калачиком
  return (
    <svg viewBox="0 0 140 80" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="70" cy="50" rx="62" ry="28" fill="#221f23" />
      <path d="M30 28c-3-8 0-15 6-15 2 6 1 11-1 15Z" fill="#221f23" />
      <path d="M48 22c-1-8 3-14 8-13 1 6-1 11-3 15Z" fill="#221f23" />
      <path d="M22 44q5-3 10 0M40 44q5-3 10 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="18" cy="52" rx="3" ry="2" fill="#ec9fb0" opacity="0.8" />
    </svg>
  )
}

export function CatBlobWave({ className = '' }) {
  return (
    <svg viewBox="0 0 100 110" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M24 92c-6-22 0-44 26-44s32 22 26 44c-15 9-37 9-52 0Z" fill="#221f23" />
      <path d="M36 50c-4-9-2-18 4-18 3 6 2 12 0 18Z" fill="#221f23" />
      <path d="M64 50c4-9 2-18-4-18-3 6-2 12 0 18Z" fill="#221f23" />
      <circle cx="43" cy="66" r="3" fill="#fff" />
      <circle cx="57" cy="66" r="3" fill="#fff" />
      <path d="M47 73q3 2 6 0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* поднятая лапка */}
      <ellipse cx="78" cy="38" rx="9" ry="13" fill="#221f23" transform="rotate(18 78 38)" />
      <ellipse cx="78" cy="30" rx="6" ry="4" fill="#fff" opacity="0.15" />
    </svg>
  )
}

export function CatBlobSurprised({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22 86c-6-24 2-46 28-46s34 22 28 46c-16 10-40 10-56 0Z" fill="#221f23" />
      <path d="M34 42c-4-10-2-20 4-20 3 7 2 14 0 20Z" fill="#221f23" />
      <path d="M66 42c4-10 2-20-4-20-3 7-2 14 0 20Z" fill="#221f23" />
      <circle cx="42" cy="60" r="4.4" fill="#fff" />
      <circle cx="58" cy="60" r="4.4" fill="#fff" />
      <circle cx="42" cy="60" r="2" fill="#221f23" />
      <circle cx="58" cy="60" r="2" fill="#221f23" />
      <ellipse cx="50" cy="71" rx="2.6" ry="3.4" fill="#fff" />
    </svg>
  )
}

export function CatBlobPeek({ className = '' }) {
  // выглядывает из-за нижнего края — лапки на "подоконнике"
  return (
    <svg viewBox="0 0 120 70" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="52" width="120" height="6" rx="3" fill="#e9ddc9" />
      <path d="M30 56c-4-26 8-42 30-42s34 16 30 42c-18 8-42 8-60 0Z" fill="#221f23" />
      <path d="M42 20c-3-7-1-14 4-14 2 5 1 10-1 14Z" fill="#221f23" />
      <path d="M68 20c3-7 1-14-4-14-2 5-1 10 1 14Z" fill="#221f23" />
      <circle cx="50" cy="36" r="3" fill="#fff" />
      <circle cx="62" cy="36" r="3" fill="#fff" />
      <ellipse cx="38" cy="58" rx="7" ry="5" fill="#221f23" />
      <ellipse cx="82" cy="58" rx="7" ry="5" fill="#221f23" />
    </svg>
  )
}

export function PawBean({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="#221f23" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="27" rx="11" ry="9" />
      <circle cx="8" cy="15" r="4.6" />
      <circle cx="18" cy="8" r="5" />
      <circle cx="29" cy="10" r="4.6" />
      <circle cx="35" cy="20" r="4" />
    </svg>
  )
}
