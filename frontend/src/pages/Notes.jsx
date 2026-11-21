import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import { Flower } from '../components/Doodles'
import { CatBlobSit } from '../components/BlobCats'
import PhotoCat from '../components/PhotoCat'
import { IconClose } from '../components/Icons'

const categories = [
  { key: 'sad', label: 'Открой, когда...', sub: "тебе грустно" },
  { key: 'miss', label: 'Открой, когда...', sub: 'скучаешь' },
  { key: 'motivation', label: 'Открой, когда...', sub: 'нужна мотивация' },
  { key: 'sleep', label: 'Открой, когда...', sub: "не можешь уснуть" },
  { key: 'smile', label: 'Открой, когда...', sub: 'захочешь улыбнуться' },
]

function StarButton({ active, onClick }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 text-sm">
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={active ? '#ec9fb0' : 'none'} stroke="#ec9fb0" strokeWidth="1.8" strokeLinejoin="round">
        <path d="m12 3 2.7 5.8 6.3.9-4.6 4.5 1.1 6.3L12 17.6l-5.5 2.9 1.1-6.3L3 9.7l6.3-.9Z" />
      </svg>
      {active ? 'сохранено' : 'сохранить'}
    </button>
  )
}

export default function Notes() {
  const [opened, setOpened] = useState(null) // {label, text, category}
  const [loadingKey, setLoadingKey] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [savedNow, setSavedNow] = useState(false)

  async function loadFavorites() {
    const res = await api.getFavoriteNotes()
    setFavorites(res.favorites || [])
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  async function openCategory(key) {
    setLoadingKey(key)
    try {
      const res = await api.getRandomNote(key)
      setOpened(res)
      setSavedNow(favorites.some((f) => f.text === res.text))
    } catch (err) {
      alert(err.message)
    } finally {
      setLoadingKey(null)
    }
  }

  async function saveCurrent() {
    if (!opened) return
    await api.saveFavoriteNote(opened.category, opened.text)
    setSavedNow(true)
    await loadFavorites()
  }

  async function removeFavorite(id) {
    await api.deleteFavoriteNote(id)
    await loadFavorites()
  }

  return (
    <div className="py-4">
      <h1 className="font-hand text-3xl mb-2 text-center">Записки</h1>
      <p className="text-center text-[var(--ink-soft)] mb-4">
        выбери конвертик под настроение — үстін бас саусақтарыңмен)
      </p>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setShowFavorites((v) => !v)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
            showFavorites ? 'bg-[var(--pink-deep)] text-white' : 'bg-white text-[var(--ink-soft)]'
          }`}
        >
          сохранённые ({favorites.length})
        </button>
      </div>

      {showFavorites ? (
        <div className="max-w-xl mx-auto space-y-2">
          {favorites.length === 0 && (
            <p className="text-center text-[var(--ink-soft)] py-6">
              пока ничего не сохранено — открой записку и нажми «сохранить»
            </p>
          )}
          {favorites.map((f) => (
            <div key={f.id} className="card-soft p-4 flex items-start gap-3">
              <p className="font-hand text-lg flex-1">{f.text}</p>
              <button onClick={() => removeFavorite(f.id)} className="text-[var(--ink-soft)] p-1 shrink-0">
                <IconClose className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {categories.map((c, i) => (
            <motion.button
              key={c.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, rotate: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openCategory(c.key)}
              disabled={loadingKey === c.key}
              className="card-soft p-6 text-left relative overflow-hidden"
            >
              <Flower className="absolute -bottom-2 -right-2 w-12 h-12 opacity-30" />
              <div className="font-hand text-xl leading-tight">{c.label}</div>
              <div className="font-hand text-xl leading-tight text-[var(--pink-deep)]">{c.sub}</div>
              {loadingKey === c.key && <p className="text-xs mt-2">открываем...</p>}
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {opened && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpened(null)}
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -4, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="card-soft p-8 max-w-sm w-full text-center relative"
            >
              <Flower className="absolute top-3 left-3 w-8 h-8 opacity-50" />
              <Flower className="absolute bottom-3 right-3 w-8 h-8 opacity-50" />
              <PhotoCat src="/cats/notes.jpg" fallback={CatBlobSit} className="w-14 h-14 mx-auto mb-2" />
              <p className="font-hand text-sm text-[var(--ink-soft)] mb-2">{opened.label}</p>
              <p className="font-hand text-2xl leading-relaxed">{opened.text}</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <StarButton active={savedNow} onClick={saveCurrent} />
                <button onClick={() => setOpened(null)} className="btn-cute">
                  закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
