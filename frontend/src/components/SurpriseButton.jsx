import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CatBlobWave, PawBean } from './BlobCats'
import PhotoCat from './PhotoCat'

const messages = [
  'Ты самая классная.',
  'Маленькое напоминание: у тебя получается больше, чем ты думаешь.',
  'Если бы существовала медаль за «просто быть собой» — она твоя.',
  'Срочная новость: ты только что прочитала что-то доброе.',
  'Факт дня: улыбаться веселее, чем не улыбаться.',
  'Ты держишься отлично. Даже если сегодня казалось иначе.',
  'Нажала на кнопку — значит заслужила маленькую порцию хорошего настроения.',
  'Ты сегодня выглядишь подозрительно хорошо.',
  'Учёные доказали: ты красивая. Ну, почти учёные. Ну, я доказал.',
  'Поздравляю, ты пережила ещё один день с гравитацией.',
  'Твой внутренний голос сегодня имеет право на отпуск. Передай ему привет.',
  'Экстренный выпуск новостей: котики существуют, и ты одна из них по энергетике.',
  'Разрешаю тебе сегодня ничего не разрешать себе объяснять.',
  'Если сомневаешься — вспомни, что бутерброд падает маслом вниз чаще, чем ты падаешь духом.',
]

const colors = ['#f6c9d0', '#bcd6ea', '#f6e2a8', '#ec9fb0', '#cfe3cf']

function ConfettiPiece({ i }) {
  const left = Math.random() * 100
  const delay = Math.random() * 0.3
  const duration = 1.6 + Math.random() * 0.8
  const color = colors[i % colors.length]
  const size = 6 + Math.random() * 6
  const rotate = Math.random() * 360
  return (
    <motion.span
      className="absolute top-0 rounded-sm"
      style={{ left: `${left}%`, width: size, height: size * 1.4, background: color }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate }}
      transition={{ duration, delay, ease: 'easeIn' }}
    />
  )
}

export default function SurpriseButton() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  function trigger() {
    setMessage(messages[Math.floor(Math.random() * messages.length)])
    setOpen(true)
    setTimeout(() => setOpen(false), 3200)
  }

  return (
    <>
      <button onClick={trigger} className="btn-cute flex items-center gap-2 mx-auto">
        <PawBean className="w-4 h-4" />
        порадуй меня
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <ConfettiPiece key={i} i={i} />
              ))}
            </div>
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.45 }}
              className="card-soft p-7 max-w-xs text-center relative"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -6, 0] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              >
                <PhotoCat src="/cats/surprise.jpg" fallback={CatBlobWave} className="w-16 h-16 mx-auto mb-2" />
              </motion.div>
              <p className="font-hand text-xl leading-relaxed">{message}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
