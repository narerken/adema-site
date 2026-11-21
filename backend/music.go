package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

var validMoods = map[string]bool{
	"warm":      true,
	"happy":     true,
	"chill":     true,
	"sad":       true,
	"hype":      true,
	"nostalgic": true,
}

func handleGetMusic(w http.ResponseWriter, r *http.Request, s Session) {
	db.mu.Lock()
	defer db.mu.Unlock()

	byMood := map[string][]Track{}
	for _, t := range db.Tracks {
		byMood[t.Mood] = append(byMood[t.Mood], t)
	}
	moods := []string{"warm", "happy", "chill", "sad", "hype", "nostalgic"}
	result := []map[string]interface{}{}
	for _, m := range moods {
		tracks := byMood[m]
		sort.Slice(tracks, func(i, j int) bool { return tracks[i].CreatedAt.After(tracks[j].CreatedAt) })
		result = append(result, map[string]interface{}{
			"mood":   m,
			"tracks": orEmpty(tracks),
		})
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"playlists": result})
}

func orEmpty(t []Track) []Track {
	if t == nil {
		return []Track{}
	}
	return t
}

func handleUploadTrack(w http.ResponseWriter, r *http.Request, s Session) {
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		writeErr(w, http.StatusBadRequest, "файл слишком большой или повреждён")
		return
	}

	mood := r.FormValue("mood")
	title := r.FormValue("title")
	if !validMoods[mood] {
		writeErr(w, http.StatusBadRequest, "неизвестное настроение")
		return
	}

	file, header, err := r.FormFile("track")
	if err != nil {
		writeErr(w, http.StatusBadRequest, "файл не найден")
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext == "" {
		ext = ".mp3"
	}
	id := randomID()
	filename := id + ext
	dstPath := filepath.Join(cfg.UploadsDir, "music", filename)
	dst, err := os.Create(dstPath)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "не удалось сохранить файл")
		return
	}
	defer dst.Close()
	if _, err := io.Copy(dst, file); err != nil {
		writeErr(w, http.StatusInternalServerError, "ошибка записи файла")
		return
	}

	if title == "" {
		title = header.Filename
	}

	track := Track{
		ID:         id,
		Mood:       mood,
		Title:      title,
		URL:        fmt.Sprintf("/uploads/music/%s", filename),
		UploadedBy: s.Name,
		CreatedAt:  time.Now(),
	}

	db.mu.Lock()
	db.Tracks = append(db.Tracks, track)
	err = db.save()
	db.mu.Unlock()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
		return
	}

	writeJSON(w, http.StatusOK, track)
}

func handleDeleteTrack(w http.ResponseWriter, r *http.Request, s Session) {
	id := r.PathValue("id")

	db.mu.Lock()
	defer db.mu.Unlock()

	idx := -1
	for i, t := range db.Tracks {
		if t.ID == id {
			idx = i
			break
		}
	}
	if idx == -1 {
		writeErr(w, http.StatusNotFound, "трек не найден")
		return
	}

	t := db.Tracks[idx]
	_ = os.Remove(filepath.Join(cfg.UploadsDir, "music", filepath.Base(t.URL)))
	db.Tracks = append(db.Tracks[:idx], db.Tracks[idx+1:]...)
	if err := db.save(); err != nil {
		writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func handleToggleFavoriteTrack(w http.ResponseWriter, r *http.Request, s Session) {
	id := r.PathValue("id")

	db.mu.Lock()
	defer db.mu.Unlock()

	for i := range db.Tracks {
		if db.Tracks[i].ID == id {
			db.Tracks[i].Favorite = !db.Tracks[i].Favorite
			if err := db.save(); err != nil {
				writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
				return
			}
			writeJSON(w, http.StatusOK, map[string]bool{"favorite": db.Tracks[i].Favorite})
			return
		}
	}
	writeErr(w, http.StatusNotFound, "трек не найден")
}
