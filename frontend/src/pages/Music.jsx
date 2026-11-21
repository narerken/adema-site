import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../lib/api'
import { CatHeadphones } from '../components/Doodles'
import PhotoCat from '../components/PhotoCat'
import { IconPlay, IconPause, IconClose } from '../components/Icons'

const moodMeta = {
  warm: { label: 'Уют' },
  happy: { label: 'Радость' },
  chill: { label: 'Чилл' },
  sad: { label: 'Грусть' },
  hype: { label: 'Тойские' },
  nostalgic: { label: 'Felina' },
}

function StarButton({ active, onClick }) {
  return (
    <button onClick={onClick} className="p-1 shrink-0">
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill={active ? '#ec9fb0' : 'none'} stroke="#ec9fb0" strokeWidth="1.8" strokeLinejoin="round">
        <path d="m12 3 2.7 5.8 6.3.9-4.6 4.5 1.1 6.3L12 17.6l-5.5 2.9 1.1-6.3L3 9.7l6.3-.9Z" />
      </svg>
    </button>
  )
}

export default function Music() {
  const [playlists, setPlaylists] = useState([])
  const [mood, setMood] = useState('warm')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [current, setCurrent] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [uploading, setUploading] = useState(false)
  const audioRef = useRef(null)
  const fileRef = useRef(null)

  async function load() {
    const data = await api.getPlaylists()
    setPlaylists(data.playlists || [])
  }

  useEffect(() => {
    load()
  }, [])

  const moodTracks = playlists.find((p) => p.mood === mood)?.tracks || []
  const activeTracks = useMemo(
    () => (favoritesOnly ? moodTracks.filter((t) => t.favorite) : moodTracks),
    [moodTracks, favoritesOnly]
  )

  function playTrack(track) {
    if (current?.id === track.id) {
      if (isPlaying) audioRef.current?.pause()
      else audioRef.current?.play()
      return
    }
    setCurrent(track)
    setTimeout(() => audioRef.current?.play(), 50)
  }

  function playNext() {
    if (activeTracks.length === 0) return
    const idx = activeTracks.findIndex((t) => t.id === current?.id)
    let nextIdx
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * activeTracks.length)
    } else {
      nextIdx = idx >= 0 ? (idx + 1) % activeTracks.length : 0
    }
    const next = activeTracks[nextIdx]
    if (!next) return
    setCurrent(next)
    setTimeout(() => audioRef.current?.play(), 50)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await api.uploadTrack(mood, file, file.name.replace(/\.[^/.]+$/, ''))
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить трек?')) return
    await api.deleteTrack(id)
    if (current?.id === id) setCurrent(null)
    await load()
  }

  async function handleToggleFavorite(id) {
    const res = await api.toggleFavoriteTrack(id)
    setPlaylists((pls) =>
      pls.map((p) => ({
        ...p,
        tracks: p.tracks.map((t) => (t.id === id ? { ...t, favorite: res.favorite } : t)),
      }))
    )
  }

  return (
    <div className="py-4 pb-10">
      <h1 className="font-hand text-3xl mb-4 text-center">Музыка</h1>

      <div className="flex flex-wrap justify-center gap-2 mb-3">
        {Object.entries(moodMeta).map(([key, m]) => (
          <button
            key={key}
            onClick={() => setMood(key)}
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              mood === key ? 'bg-[var(--pink)]' : 'bg-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setFavoritesOnly((v) => !v)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
            favoritesOnly ? 'bg-[var(--pink-deep)] text-white' : 'bg-white text-[var(--ink-soft)]'
          }`}
        >
          только избранное
        </button>
        <button
          onClick={() => setShuffle((v) => !v)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
            shuffle ? 'bg-[var(--pink-deep)] text-white' : 'bg-white text-[var(--ink-soft)]'
          }`}
        >
          перемешка
        </button>
      </div>

      <div className="card-soft p-4 mb-6 flex justify-center">
        <label className="btn-cute cursor-pointer text-sm">
          {uploading ? 'грузим...' : `+ добавить трек в «${moodMeta[mood].label}»`}
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-2 mb-28">
        {activeTracks.length === 0 && (
          <p className="text-center text-[var(--ink-soft)] py-6">
            {favoritesOnly ? 'нет избранных треков с этим настроением' : 'здесь пока нет песен для этого настроения'}
          </p>
        )}
        {activeTracks.map((t) => (
          <div
            key={t.id}
            className={`card-soft px-4 py-3 flex items-center justify-between ${
              current?.id === t.id ? 'ring-2 ring-[var(--pink-deep)]' : ''
            }`}
          >
            <button onClick={() => playTrack(t)} className="flex items-center gap-3 text-left flex-1 min-w-0">
              <span className="w-7 h-7 rounded-full bg-[var(--cream-deep)] flex items-center justify-center shrink-0">
                {current?.id === t.id && isPlaying ? (
                  <IconPause className="w-3.5 h-3.5" />
                ) : (
                  <IconPlay className="w-3.5 h-3.5" />
                )}
              </span>
              <span className="font-semibold truncate">{t.title}</span>
            </button>
            <StarButton active={t.favorite} onClick={() => handleToggleFavorite(t.id)} />
            <button onClick={() => handleDelete(t.id)} className="text-[var(--ink-soft)] ml-1 p-1">
              <IconClose className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {current && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-16 md:bottom-4 inset-x-2 md:inset-x-auto md:right-6 md:w-80 card-soft p-4 flex items-center gap-3 z-30"
        >
          <motion.div
            animate={isPlaying ? { rotate: [0, -8, 8, 0], y: [0, -4, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.1 }}
          >
            <PhotoCat src="/cats/music.jpg" fallback={CatHeadphones} className="w-14 h-14" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{current.title}</p>
            <audio
              ref={audioRef}
              src={`${api.API_URL}${current.url}`}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={playNext}
              controls
              className="w-full h-8"
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
