import { useEffect, useRef, useState } from 'react'
import { IconSpeaker, IconSpeakerMute } from './Icons'

// Фоновая музыка сайта — отдельная от раздела "Музыка".
// Файл лежит в frontend/public/background-music.mp3 — просто замени его
// на свой трек (сохранив то же имя файла) и пересобери сайт.
const TRACK_URL = '/background-music.mp3'
const STORAGE_KEY = 'adema_bg_music_on'
const VOLUME = 0.15

export default function BackgroundMusic() {
  const audioRef = useRef(null)
  const [on, setOn] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (on) {
      if (audioRef.current) audioRef.current.volume = VOLUME
      audioRef.current?.play().catch(() => setOn(false))
    } else {
      audioRef.current?.pause()
    }
    localStorage.setItem(STORAGE_KEY, String(on))
  }, [on])

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACK_URL}
        loop
        onError={() => setMissing(true)}
      />
      <button
        onClick={() => !missing && setOn((v) => !v)}
        title={missing ? 'добавь frontend/public/background-music.mp3' : on ? 'выключить фоновую музыку' : 'включить фоновую музыку'}
        className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[var(--ink-soft)] disabled:opacity-40"
      >
        {on ? <IconSpeaker className="w-4 h-4" /> : <IconSpeakerMute className="w-4 h-4" />}
      </button>
    </>
  )
}
