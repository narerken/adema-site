const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function authHeaders() {
  const token = localStorage.getItem('adema_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Ошибка запроса: ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export const api = {
  API_URL,
  login: (passcode) =>
    request('/api/login', { method: 'POST', body: JSON.stringify({ passcode }) }),

  // Photos
  getAlbums: () => request('/api/photos'),
  uploadPhoto: (album, file, caption) => {
    const fd = new FormData()
    fd.append('album', album)
    fd.append('caption', caption || '')
    fd.append('photo', file)
    return request('/api/photos/upload', { method: 'POST', body: fd })
  },
  deletePhoto: (id) => request(`/api/photos/${id}`, { method: 'DELETE' }),
  toggleFavoritePhoto: (id) => request(`/api/photos/${id}/favorite`, { method: 'POST' }),

  // Music
  getPlaylists: () => request('/api/music'),
  uploadTrack: (mood, file, title) => {
    const fd = new FormData()
    fd.append('mood', mood)
    fd.append('title', title || file.name)
    fd.append('track', file)
    return request('/api/music/upload', { method: 'POST', body: fd })
  },
  deleteTrack: (id) => request(`/api/music/${id}`, { method: 'DELETE' }),
  toggleFavoriteTrack: (id) => request(`/api/music/${id}/favorite`, { method: 'POST' }),

  // Notes
  getRandomNote: (category) => request(`/api/notes/random?category=${encodeURIComponent(category)}`),
  saveFavoriteNote: (category, text) =>
    request('/api/notes/favorite', { method: 'POST', body: JSON.stringify({ category, text }) }),
  getFavoriteNotes: () => request('/api/notes/favorites'),
  deleteFavoriteNote: (id) => request(`/api/notes/favorites/${id}`, { method: 'DELETE' }),

  // Daily checklist
  getDailyChecklist: () => request('/api/tasks/today'),
  toggleDailyTask: (index) =>
    request('/api/tasks/toggle', { method: 'POST', body: JSON.stringify({ index }) }),

  // Stats
  getStats: () => request('/api/stats'),
}

export default api
