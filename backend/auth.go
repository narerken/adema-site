package main

import (
	"encoding/json"
	"net/http"
	"time"
)

type loginReq struct {
	Passcode string `json:"passcode"`
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeErr(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var req loginReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "неверный запрос")
		return
	}

	var role, name string
	switch req.Passcode {
	case cfg.OwnerPasscode:
		role, name = "owner", "Ернар"
	case cfg.AdemaPasscode:
		role, name = "adema", "Адема"
	default:
		writeErr(w, http.StatusUnauthorized, "неверный код доступа")
		return
	}

	token := randomID()
	sess := Session{Token: token, Role: role, Name: name, CreatedAt: time.Now()}

	db.mu.Lock()
	db.Sessions[token] = sess
	err := db.save()
	db.mu.Unlock()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"token": token,
		"role":  role,
		"name":  name,
	})
}
