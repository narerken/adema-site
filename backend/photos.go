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

const maxUploadSize = 60 << 20 // 60MB

func handleGetPhotos(w http.ResponseWriter, r *http.Request, s Session) {
	db.mu.Lock()
	defer db.mu.Unlock()

	shared := []Photo{}
	private := []Photo{}
	for _, p := range db.Photos {
		if p.Album == "shared" {
			shared = append(shared, p)
		} else {
			private = append(private, p)
		}
	}
	sortPhotosDesc(shared)
	sortPhotosDesc(private)

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"shared":  shared,
		"private": private,
	})
}

func sortPhotosDesc(ph []Photo) {
	sort.Slice(ph, func(i, j int) bool { return ph[i].CreatedAt.After(ph[j].CreatedAt) })
}

func handleUploadPhoto(w http.ResponseWriter, r *http.Request, s Session) {
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
	if err := r.ParseMultipartForm(maxUploadSize); err != nil {
		writeErr(w, http.StatusBadRequest, "файл слишком большой или повреждён")
		return
	}

	album := r.FormValue("album")
	caption := r.FormValue("caption")
	if album != "shared" && album != "private" {
		writeErr(w, http.StatusBadRequest, "неверный альбом")
		return
	}
	// shared album: owner curates it; private album: adema curates it.
	if album == "shared" && s.Role != "owner" {
		writeErr(w, http.StatusForbidden, "только владелец может добавлять в общий альбом")
		return
	}
	if album == "private" && s.Role != "adema" {
		writeErr(w, http.StatusForbidden, "приватный альбом только для Адемы")
		return
	}

	file, header, err := r.FormFile("photo")
	if err != nil {
		writeErr(w, http.StatusBadRequest, "файл не найден")
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext == "" {
		ext = ".jpg"
	}
	id := randomID()
	filename := id + ext
	dstPath := filepath.Join(cfg.UploadsDir, "photos", filename)
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

	photo := Photo{
		ID:         id,
		Album:      album,
		URL:        fmt.Sprintf("/uploads/photos/%s", filename),
		Caption:    caption,
		UploadedBy: s.Name,
		CreatedAt:  time.Now(),
	}

	db.mu.Lock()
	db.Photos = append(db.Photos, photo)
	err = db.save()
	db.mu.Unlock()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
		return
	}

	writeJSON(w, http.StatusOK, photo)
}

func handleDeletePhoto(w http.ResponseWriter, r *http.Request, s Session) {
	id := r.PathValue("id")

	db.mu.Lock()
	defer db.mu.Unlock()

	idx := -1
	for i, p := range db.Photos {
		if p.ID == id {
			idx = i
			break
		}
	}
	if idx == -1 {
		writeErr(w, http.StatusNotFound, "фото не найдено")
		return
	}
	p := db.Photos[idx]
	if p.Album == "shared" && s.Role != "owner" {
		writeErr(w, http.StatusForbidden, "нет прав")
		return
	}
	if p.Album == "private" && s.Role != "adema" {
		writeErr(w, http.StatusForbidden, "нет прав")
		return
	}

	_ = os.Remove(filepath.Join(cfg.UploadsDir, "photos", filepath.Base(p.URL)))
	db.Photos = append(db.Photos[:idx], db.Photos[idx+1:]...)
	if err := db.save(); err != nil {
		writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func handleToggleFavoritePhoto(w http.ResponseWriter, r *http.Request, s Session) {
	id := r.PathValue("id")

	db.mu.Lock()
	defer db.mu.Unlock()

	for i := range db.Photos {
		if db.Photos[i].ID == id {
			db.Photos[i].Favorite = !db.Photos[i].Favorite
			if err := db.save(); err != nil {
				writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
				return
			}
			writeJSON(w, http.StatusOK, map[string]bool{"favorite": db.Photos[i].Favorite})
			return
		}
	}
	writeErr(w, http.StatusNotFound, "фото не найдено")
}
