package main

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"sort"
	"time"
)

func handleRandomNote(w http.ResponseWriter, r *http.Request, s Session) {
	category := r.URL.Query().Get("category")
	notes, ok := notesData[category]
	if !ok || len(notes) == 0 {
		writeErr(w, http.StatusBadRequest, "неизвестная категория")
		return
	}

	db.mu.Lock()
	defer db.mu.Unlock()

	shown := db.Notes.Shown[category]
	if len(shown) >= len(notes) {
		shown = nil // все показаны — начинаем заново
	}

	shownSet := map[int]bool{}
	for _, i := range shown {
		shownSet[i] = true
	}

	available := []int{}
	for i := range notes {
		if !shownSet[i] {
			available = append(available, i)
		}
	}

	pick := available[rand.Intn(len(available))]
	shown = append(shown, pick)
	db.Notes.Shown[category] = shown
	_ = db.save()

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"category": category,
		"label":    categoryLabels[category],
		"text":     notes[pick],
		"progress": map[string]int{"shown": len(shown), "total": len(notes)},
	})
}

type favoriteNoteReq struct {
	Category string `json:"category"`
	Text     string `json:"text"`
}

func handleSaveFavoriteNote(w http.ResponseWriter, r *http.Request, s Session) {
	var req favoriteNoteReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Text == "" {
		writeErr(w, http.StatusBadRequest, "неверный запрос")
		return
	}

	db.mu.Lock()
	defer db.mu.Unlock()

	for _, f := range db.FavoriteNotes {
		if f.Text == req.Text {
			writeJSON(w, http.StatusOK, f)
			return
		}
	}

	fav := FavoriteNote{
		ID:       randomID(),
		Category: req.Category,
		Text:     req.Text,
		SavedAt:  time.Now(),
	}
	db.FavoriteNotes = append(db.FavoriteNotes, fav)
	if err := db.save(); err != nil {
		writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
		return
	}
	writeJSON(w, http.StatusOK, fav)
}

func handleListFavoriteNotes(w http.ResponseWriter, r *http.Request, s Session) {
	db.mu.Lock()
	defer db.mu.Unlock()

	list := append([]FavoriteNote{}, db.FavoriteNotes...)
	sort.Slice(list, func(i, j int) bool { return list[i].SavedAt.After(list[j].SavedAt) })
	writeJSON(w, http.StatusOK, map[string]interface{}{"favorites": list})
}

func handleDeleteFavoriteNote(w http.ResponseWriter, r *http.Request, s Session) {
	id := r.PathValue("id")

	db.mu.Lock()
	defer db.mu.Unlock()

	idx := -1
	for i, f := range db.FavoriteNotes {
		if f.ID == id {
			idx = i
			break
		}
	}
	if idx == -1 {
		writeErr(w, http.StatusNotFound, "не найдено")
		return
	}
	db.FavoriteNotes = append(db.FavoriteNotes[:idx], db.FavoriteNotes[idx+1:]...)
	if err := db.save(); err != nil {
		writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}
