package main

import (
	"log"
	"net/http"
	"os"
)

var db *DB

type Config struct {
	Port          string
	OwnerPasscode string
	AdemaPasscode string
	UploadsDir    string
	DataFile      string
	AllowedOrigin string
}

var cfg Config

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {
	cfg = Config{
		Port:          getenv("PORT", "8080"),
		OwnerPasscode: getenv("OWNER_PASSCODE", "eradication"),
		AdemaPasscode: getenv("ADEMA_PASSCODE", "hazayami"),
		UploadsDir:    getenv("UPLOADS_DIR", "./uploads"),
		DataFile:      getenv("DATA_FILE", "./data/db.json"),
		AllowedOrigin: getenv("ALLOWED_ORIGIN", "*"),
	}

	os.MkdirAll(cfg.UploadsDir+"/photos", 0o755)
	os.MkdirAll(cfg.UploadsDir+"/music", 0o755)

	db = NewDB(cfg.DataFile)

	mux := http.NewServeMux()

	// static uploads
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(cfg.UploadsDir))))

	mux.HandleFunc("POST /api/login", handleLogin)

	mux.HandleFunc("GET /api/photos", withAuth(handleGetPhotos))
	mux.HandleFunc("POST /api/photos/upload", withAuth(handleUploadPhoto))
	mux.HandleFunc("DELETE /api/photos/{id}", withAuth(handleDeletePhoto))
	mux.HandleFunc("POST /api/photos/{id}/favorite", withAuth(handleToggleFavoritePhoto))

	mux.HandleFunc("GET /api/music", withAuth(handleGetMusic))
	mux.HandleFunc("POST /api/music/upload", withAuth(handleUploadTrack))
	mux.HandleFunc("DELETE /api/music/{id}", withAuth(handleDeleteTrack))
	mux.HandleFunc("POST /api/music/{id}/favorite", withAuth(handleToggleFavoriteTrack))

	mux.HandleFunc("GET /api/notes/random", withAuth(handleRandomNote))
	mux.HandleFunc("POST /api/notes/favorite", withAuth(handleSaveFavoriteNote))
	mux.HandleFunc("GET /api/notes/favorites", withAuth(handleListFavoriteNotes))
	mux.HandleFunc("DELETE /api/notes/favorites/{id}", withAuth(handleDeleteFavoriteNote))

	mux.HandleFunc("GET /api/tasks/today", withAuth(handleTaskToday))
	mux.HandleFunc("POST /api/tasks/toggle", withAuth(handleTaskToggle))

	mux.HandleFunc("GET /api/stats", withAuth(handleStats))

	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, 200, map[string]string{"status": "ok"})
	})

	handler := withCORS(mux)

	log.Printf("adema-backend listening on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, handler); err != nil {
		log.Fatal(err)
	}
}
