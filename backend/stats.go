package main

import "net/http"

func handleStats(w http.ResponseWriter, r *http.Request, s Session) {
	db.mu.Lock()
	defer db.mu.Unlock()

	favPhotos, favTracks := 0, 0
	for _, p := range db.Photos {
		if p.Favorite {
			favPhotos++
		}
	}
	for _, t := range db.Tracks {
		if t.Favorite {
			favTracks++
		}
	}

	current, longest := computeStreak(db.TasksHistory)

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"totalPhotos":    len(db.Photos),
		"totalTracks":    len(db.Tracks),
		"favoritePhotos": favPhotos,
		"favoriteTracks": favTracks,
		"favoriteNotes":  len(db.FavoriteNotes),
		"currentStreak":  current,
		"longestStreak":  longest,
		"daysCompleted":  len(db.TasksHistory),
	})
}
