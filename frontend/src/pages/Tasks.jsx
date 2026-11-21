import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import { CatBlobLoaf, CatBlobWave } from '../components/BlobCats'
import PhotoCat from '../components/PhotoCat'
import { Flower } from '../components/Doodles'

export default function Tasks() {
  const [data, setData] = useState(null)
  const [busy, setBusy] = useState(null)
  const [streak, setStreak] = useState(null)

  async function load() {
    const d = await api.getDailyChecklist()
    setData(d)
  }

  async function loadStreak() {
    const s = await api.getStats()
    setStreak(s)
  }

  useEffect(() => {
    load()
    loadStreak()
  }, [])

  async function toggle(index) {
    setBusy(index)
    const res = await api.toggleDailyTask(index)
    setData((d) => ({
      ...d,
      doneCount: d.doneCount + (res.done ? 1 : -1),
      items: d.items.map((it) => (it.index === index ? { ...it, done: res.done } : it)),
    }))
    setBusy(null)
    loadStreak()
  }

  if (!data) return <p className="text-center py-10">собираем сегодняшний список...</p>

  const allDone = data.doneCount === data.total

  return (
    <div className="py-8 max-w-md mx-auto">
      <h1 className="font-hand text-3xl mb-1 text-center">Чек-лист дня</h1>
      <p className="text-center text-[var(--ink-soft)] mb-2">
        {data.doneCount} / {data.total} выполнено
      </p>
      {streak && (streak.currentStreak > 0 || streak.longestStreak > 0) && (
        <p className="text-center text-sm text-[var(--pink-deep)] font-semibold mb-4">
          стрик: {streak.currentStreak} {streak.currentStreak === 1 ? 'день' : 'дня'} подряд
          {streak.longestStreak > streak.currentStreak && ` · лучший — ${streak.longestStreak}`}
        </p>
      )}

      <div className="w-full h-2.5 rounded-full bg-[var(--ring)] overflow-hidden mb-6">
        <motion.div
          className="h-full bg-[var(--pink-deep)]"
          animate={{ width: `${(data.doneCount / data.total) * 100}%` }}
          transition={{ type: 'spring', bounce: 0.3 }}
        />
      </div>

      <div className="space-y-2">
        {data.items.map((item) => (
          <motion.button
            key={item.index}
            onClick={() => toggle(item.index)}
            disabled={busy === item.index}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left card-soft px-4 py-3 flex items-center gap-3 ${
              item.done ? 'opacity-60' : ''
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                item.done ? 'bg-[var(--pink-deep)] border-[var(--pink-deep)]' : 'border-[var(--ring)]'
              }`}
            >
              {item.done && (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              )}
            </span>
            <span className={item.done ? 'line-through' : ''}>{item.text}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-soft p-6 text-center mt-6 relative overflow-hidden"
          >
            <Flower className="absolute top-2 left-2 w-8 h-8 opacity-50" />
            <PhotoCat src="/cats/tasks-done.jpg" fallback={CatBlobWave} className="w-16 h-16 mx-auto mb-2" />
            <p className="font-hand text-2xl text-[var(--pink-deep)]">всё сделано, лучшая</p>
            <p className="text-sm text-[var(--ink-soft)] mt-1">новый список появится завтра</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!allDone && (
        <div className="flex justify-center mt-6 opacity-70">
          <PhotoCat src="/cats/tasks-progress.jpg" fallback={CatBlobLoaf} className="w-24" rounded={false} />
        </div>
      )}
    </div>
  )
}
