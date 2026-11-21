import { useState } from 'react'

// Универсальная "фото-картинка кота" с запасным нарисованным котом,
// если фото ещё не положено. Используется везде по сайту — просто
// передай src (путь в public/cats/...) и fallback (компонент-иллюстрацию
// из Doodles.jsx / BlobCats.jsx).
export default function PhotoCat({ src, fallback: Fallback, className = '', rounded = true }) {
  const [error, setError] = useState(false)

  if (error || !src || !Fallback) {
    return Fallback ? <Fallback className={className} /> : null
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setError(true)}
      className={`${className} object-cover ${rounded ? 'rounded-full' : ''}`}
    />
  )
}
