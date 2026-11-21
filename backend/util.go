package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
)

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func randomID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", cfg.AllowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

type ctxKey string

const sessionKey ctxKey = "session"

func withAuth(next func(w http.ResponseWriter, r *http.Request, s Session)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authz := r.Header.Get("Authorization")
		token := ""
		if len(authz) > 7 && authz[:7] == "Bearer " {
			token = authz[7:]
		}
		if token == "" {
			writeErr(w, http.StatusUnauthorized, "нужна авторизация")
			return
		}
		db.mu.Lock()
		s, ok := db.Sessions[token]
		db.mu.Unlock()
		if !ok {
			writeErr(w, http.StatusUnauthorized, "сессия истекла, войди заново")
			return
		}
		next(w, r, s)
	}
}
