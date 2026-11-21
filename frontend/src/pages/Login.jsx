import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/AuthContext'
import { CatBlobSit } from '../components/BlobCats'
import PhotoCat from '../components/PhotoCat'
import { Flower, Butterfly } from '../components/Doodles'
import { IconLock } from '../components/Icons'

export default function Login() {
  const { login } = useAuth()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(passcode)
    } catch {
      setError('Хм, дұрыстап жаз на английском.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-dots">
      <Flower className="absolute top-10 left-8 w-10 h-10 opacity-70" />
      <Butterfly className="absolute top-16 right-10 w-10 h-10 opacity-70" />
      <Flower className="absolute bottom-14 right-10 w-8 h-8 opacity-70" color="#f6c9d0" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="card-soft p-8 w-full max-w-sm text-center"
      >
        <PhotoCat src="/cats/login.jpg" fallback={CatBlobSit} className="w-20 h-20 mx-auto mb-2" />
        <h1 className="font-hand text-3xl mb-1">мир Адемы</h1>
        <p className="text-[var(--ink-soft)] text-sm mb-6">маленький уголок, только для тебя</p>

        <div className="relative mb-3">
          <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="секретный код..."
            className="w-full rounded-2xl border border-[var(--ring)] pl-10 pr-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-[var(--pink)]"
            autoFocus
          />
        </div>
        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
        <button type="submit" disabled={loading} className="btn-cute w-full">
          {loading ? 'открываем...' : 'войти'}
        </button>
      </motion.form>
    </div>
  )
}
