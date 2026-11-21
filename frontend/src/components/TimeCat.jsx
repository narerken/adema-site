import { useState } from 'react'
import { CatBlobWave, CatBlobLoaf } from './BlobCats'
import { CatSleep } from './Doodles'

// Картинка кота меняется в зависимости от времени суток.
// Пока фото нет — показывается нарисованный кот (запасной вариант).
// Чтобы подключить своё фото, положи файл с нужным именем в
// frontend/public/cats/:
//   night.jpg    — доброй ночи (0:00–6:00)
//   morning.jpg  — доброе утро (6:00–12:00)
//   day.jpg      — добрый день (12:00–18:00)
//   evening.jpg  — добрый вечер (18:00–24:00)
const PERIODS = [
  { key: 'night', test: (h) => h < 6, text: 'Доброй ночи', photo: '/cats/night.jpg', Fallback: CatSleep },
  { key: 'morning', test: (h) => h < 12, text: 'Утречко', photo: '/cats/morning.jpg', Fallback: CatBlobWave },
  { key: 'day', test: (h) => h < 18, text: 'Добрый день', photo: '/cats/day.jpg', Fallback: CatBlobWave },
  { key: 'evening', test: () => true, text: 'Добрый вечер', photo: '/cats/evening.jpg', Fallback: CatBlobLoaf },
]

export function getPeriod() {
  // Для проверки: открой сайт с ?cat=night (или morning / day / evening)
  // в адресной строке — покажется именно этот период, без смены времени.
  const forced = new URLSearchParams(window.location.search).get('cat')
  if (forced) {
    const found = PERIODS.find((p) => p.key === forced)
    if (found) return found
  }
  const h = new Date().getHours()
  return PERIODS.find((p) => p.test(h))
}

export function greeting() {
  return getPeriod().text
}

function TimeCatImage({ period, className }) {
  const [error, setError] = useState(false)

  if (error) {
    const Fallback = period.Fallback
    return <Fallback className={className} />
  }

  return (
    <img
      src={period.photo}
      alt=""
      onError={() => setError(true)}
      className={`${className} object-cover rounded-full`}
    />
  )
}

export default function TimeCat({ className = '' }) {
  const period = getPeriod()
  // key заставляет картинку/запасной вариант обновляться при смене времени суток
  return <TimeCatImage key={period.key} period={period} className={className} />
}
