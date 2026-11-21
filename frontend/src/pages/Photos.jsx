import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import { Flower } from '../components/Doodles'
import { IconClose, IconLock } from '../components/Icons'

function StarButton({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center"
    >
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={active ? '#ec9fb0' : 'none'} stroke="#ec9fb0" strokeWidth="1.8" strokeLinejoin="round">
        <path d="m12 3 2.7 5.8 6.3.9-4.6 4.5 1.1 6.3L12 17.6l-5.5 2.9 1.1-6.3L3 9.7l6.3-.9Z" />
      </svg>
    </button>
  )
}

function Lightbox({ photo, onClose }) {
  if (!photo) return null
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={`${api.API_URL}${photo.url}`} alt="" className="w-full rounded-2xl" />
        {photo.caption && (
          <p className="text-white text-center mt-3 font-hand text-lg">{photo.caption}</p>
        )}
      </motion.div>
    </div>
  )
}

function Gallery({ photos, canDelete, onDelete, onPick, onToggleFavorite }) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--ink-soft)]">
        <Flower className="w-10 h-10 mx-auto mb-2 opacity-60" />
        пока пусто...
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <AnimatePresence>
        {photos.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group rounded-2xl overflow-hidden aspect-square card-soft"
          >
            <img
              src={`${api.API_URL}${p.url}`}
              alt={p.caption}
              onClick={() => onPick(p)}
              className="w-full h-full object-cover cursor-pointer"
            />
            <StarButton active={p.favorite} onClick={() => onToggleFavorite(p.id)} />
            {canDelete && (
              <button
                onClick={() => onDelete(p.id)}
                className="absolute top-1 right-1 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconClose className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default function Photos() {
  const { user } = useAuth()
  const [tab, setTab] = useState('shared')
  const [shared, setShared] = useState([])
  const [priv, setPriv] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [picked, setPicked] = useState(null)
  const [caption, setCaption] = useState('')
  const fileRef = useRef(null)

  async function load() {
    setLoading(true)
    const data = await api.getAlbums()
    setShared(data.shared || [])
    setPriv(data.private || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const canUploadShared = user.role === 'owner'
  const canUploadPrivate = user.role === 'adema'

  async function handleUpload(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      setUploadProgress({ done: i, total: files.length })
      try {
        await api.uploadPhoto(tab, files[i], files.length === 1 ? caption : '')
      } catch (err) {
        alert(err.message)
      }
    }
    setCaption('')
    await load()
    setUploading(false)
    setUploadProgress(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(id) {
    if (!confirm('Удалить фото?')) return
    await api.deletePhoto(id)
    await load()
  }

  async function handleToggleFavorite(id) {
    const res = await api.toggleFavoritePhoto(id)
    const update = (list) => list.map((p) => (p.id === id ? { ...p, favorite: res.favorite } : p))
    setShared(update)
    setPriv(update)
  }

  const favorites = useMemo(
    () => [...shared, ...priv].filter((p) => p.favorite),
    [shared, priv]
  )

  const canUploadHere = tab === 'shared' ? canUploadShared : canUploadPrivate
  const currentPhotos = tab === 'shared' ? shared : tab === 'private' ? priv : favorites

  return (
    <div className="py-4">
      <h1 className="font-hand text-3xl mb-4 text-center">Фотки</h1>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => setTab('shared')}
          className={`px-5 py-2 rounded-full font-semibold ${tab === 'shared' ? 'bg-[var(--pink)]' : 'bg-white'}`}
        >
          общий альбом
        </button>
        <button
          onClick={() => setTab('private')}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full font-semibold ${tab === 'private' ? 'bg-[var(--pink)]' : 'bg-white'}`}
        >
          личный альбом
          <IconLock className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setTab('favorites')}
          className={`px-5 py-2 rounded-full font-semibold ${tab === 'favorites' ? 'bg-[var(--pink)]' : 'bg-white'}`}
        >
          избранное ({favorites.length})
        </button>
      </div>

      {tab !== 'favorites' && canUploadHere && (
        <div className="card-soft p-4 mb-6 flex flex-col sm:flex-row gap-2 items-center justify-center">
          <input
            type="text"
            placeholder="подпись к фото (необязательно)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="rounded-full border border-[var(--ring)] px-4 py-2 flex-1 max-w-xs"
          />
          <label className="btn-cute cursor-pointer">
            {uploading
              ? `грузим... ${uploadProgress ? `${uploadProgress.done}/${uploadProgress.total}` : ''}`
              : '+ добавить фото'}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}
      {tab === 'private' && !canUploadHere && (
        <p className="text-center text-sm text-[var(--ink-soft)] mb-4">
          этот альбом загружает только Адема
        </p>
      )}

      {loading ? (
        <p className="text-center text-[var(--ink-soft)]">загружаем...</p>
      ) : (
        <Gallery
          photos={currentPhotos}
          canDelete={tab !== 'favorites' && canUploadHere}
          onDelete={handleDelete}
          onPick={setPicked}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      <Lightbox photo={picked} onClose={() => setPicked(null)} />
    </div>
  )
}
