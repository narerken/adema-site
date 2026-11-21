import { useEffect, useState } from 'react'
import api from '../lib/api'
import { IconCamera, IconMusic, IconCheckList } from './Icons'
import { PawBean } from './BlobCats'

function Stat({ Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-3">
      <span className="w-9 h-9 rounded-full bg-[var(--cream-deep)] flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </span>
      <span className="font-bold text-lg leading-none">{value}</span>
      <span className="text-[11px] text-[var(--ink-soft)] text-center leading-tight">{label}</span>
    </div>
  )
}

export default function StatsBar() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {})
  }, [])

  if (!stats) return null

  return (
    <div className="card-soft py-4 px-2 flex items-center justify-center flex-wrap gap-y-3">
      <Stat Icon={PawBean} value={stats.currentStreak} label="дней подряд" />
      <Stat Icon={PawBean} value={stats.longestStreak} label="лучший стрик" />
      <Stat Icon={IconCamera} value={stats.totalPhotos} label="фоток" />
      <Stat Icon={IconMusic} value={stats.totalTracks} label="треков" />
      <Stat Icon={IconCheckList} value={stats.daysCompleted} label="дней выполнено" />
    </div>
  )
}
