import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import BackgroundDecor from './BackgroundDecor'
import { CatBlobSit, PawBean } from './BlobCats'
import PhotoCat from './PhotoCat'
import { IconHome, IconCamera, IconMusic, IconEnvelope, IconCheckList } from './Icons'
import BackgroundMusic from './BackgroundMusic'
import { useAuth } from '../lib/AuthContext'

const navItems = [
  { to: '/', label: 'Дом', Icon: IconHome },
  { to: '/photos', label: 'Фото', Icon: IconCamera },
  { to: '/music', label: 'Музыка', Icon: IconMusic },
  { to: '/notes', label: 'Записки', Icon: IconEnvelope },
  { to: '/tasks', label: 'Чек-лист', Icon: IconCheckList },
]

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundDecor />

      <header className="flex items-center justify-between px-5 py-4 md:px-10">
        <div className="flex items-center gap-2">
          <PhotoCat src="/cats/logo.jpg" fallback={CatBlobSit} className="w-9 h-9" />
          <span className="font-hand text-xl text-[var(--ink)]">мир Адемы</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-[var(--ink-soft)]">
          <BackgroundMusic />
          <span className="hidden sm:inline">привет, {user?.name}</span>
          <button onClick={logout} className="underline decoration-dotted hover:text-[var(--ink)]">
            выйти
          </button>
        </div>
      </header>

      {/* Desktop nav */}
      <nav className="hidden md:flex gap-2 justify-center px-10 pb-4 flex-wrap">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all ${
                isActive
                  ? 'bg-[var(--pink)] text-[#5a2a3a] shadow-md'
                  : 'bg-white/70 text-[var(--ink-soft)] hover:bg-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <motion.main
        className="flex-1 px-4 pb-28 md:pb-10 md:px-10 max-w-5xl mx-auto w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Outlet />
      </motion.main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t border-[var(--ring)] px-2 py-2 flex justify-between z-20">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 text-[11px] py-1 rounded-xl ${
                isActive ? 'text-[#ec9fb0] font-bold' : 'text-[var(--ink-soft)]'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <footer className="hidden md:flex items-center justify-center gap-2 py-4 text-xs text-[var(--ink-soft)]">
        <PawBean className="w-4 h-4 opacity-60" />
        сделано специально для Адемы
        <PawBean className="w-4 h-4 opacity-60 scale-x-[-1]" />
      </footer>
    </div>
  )
}
