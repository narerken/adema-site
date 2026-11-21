import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/AuthContext'
import TimeCat, { greeting } from '../components/TimeCat'
import { Flower, Butterfly } from '../components/Doodles'
import { IconCamera, IconMusic, IconEnvelope, IconCheckList } from '../components/Icons'
import StatsBar from '../components/StatsBar'
import SurpriseButton from '../components/SurpriseButton'

const cards = [
  { to: '/photos', Icon: IconCamera, title: 'Фотки', desc: 'альбомы' },
  { to: '/music', Icon: IconMusic, title: 'Музыка', desc: 'плейлисты' },
  { to: '/notes', Icon: IconEnvelope, title: 'Записки', desc: 'записочки' },
  { to: '/tasks', Icon: IconCheckList, title: 'Чек-лист дня', desc: 'просто чтобы было весело' },
]

export default function Home() {
  const { user } = useAuth()
  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-soft p-8 text-center relative overflow-hidden mb-6"
      >
        <Flower className="absolute top-3 left-4 w-8 h-8 opacity-60" />
        <Butterfly className="absolute top-4 right-6 w-9 h-9 opacity-60" />
        <TimeCat className="w-24 h-24 mx-auto" />
        <h1 className="font-hand text-4xl mt-2">
          {greeting()}, {user?.name}!
        </h1>
        <p className="text-[var(--ink-soft)] mt-2">
          это твой маленький мир — фотки, музыка, записки и немного любви
        </p>
        <div className="mt-5">
          <SurpriseButton />
        </div>
      </motion.div>

      <div className="mb-6">
        <StatsBar />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ to, Icon, title, desc }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={to}
              className="card-soft p-6 flex flex-col items-center text-center gap-2 h-full hover:-translate-y-1 transition-transform block"
            >
              <span className="w-12 h-12 rounded-full bg-[var(--cream-deep)] flex items-center justify-center">
                <Icon className="w-6 h-6 text-[var(--ink)]" />
              </span>
              <span className="font-bold text-lg">{title}</span>
              <span className="text-sm text-[var(--ink-soft)]">{desc}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
