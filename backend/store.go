package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"time"
)

// --- Models ---

type Photo struct {
	ID         string    `json:"id"`
	Album      string    `json:"album"` // "shared" | "private"
	URL        string    `json:"url"`
	Caption    string    `json:"caption"`
	UploadedBy string    `json:"uploadedBy"`
	Favorite   bool      `json:"favorite"`
	CreatedAt  time.Time `json:"createdAt"`
}

type Track struct {
	ID         string    `json:"id"`
	Mood       string    `json:"mood"`
	Title      string    `json:"title"`
	URL        string    `json:"url"`
	UploadedBy string    `json:"uploadedBy"`
	Favorite   bool      `json:"favorite"`
	CreatedAt  time.Time `json:"createdAt"`
}

type Session struct {
	Token     string    `json:"token"`
	Role      string    `json:"role"` // "owner" | "adema"
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
}

type DailyChecklist struct {
	Date string          `json:"date"`
	Done map[string]bool `json:"done"` // key = индекс пункта в списке дня, строкой
}

type NoteHistory struct {
	// category -> list of indices already показанных, сбрасывается когда исчерпан
	Shown map[string][]int `json:"shown"`
}

type FavoriteNote struct {
	ID       string    `json:"id"`
	Category string    `json:"category"`
	Text     string    `json:"text"`
	SavedAt  time.Time `json:"savedAt"`
}

// --- DB container ---

type DB struct {
	mu sync.Mutex

	Photos        []Photo            `json:"photos"`
	Tracks        []Track            `json:"tracks"`
	Sessions      map[string]Session `json:"sessions"`
	Tasks         DailyChecklist     `json:"tasks"`
	TasksHistory  []string           `json:"tasksHistory"` // даты (YYYY-MM-DD), когда чек-лист был выполнен полностью
	Notes         NoteHistory        `json:"notes"`
	FavoriteNotes []FavoriteNote     `json:"favoriteNotes"`

	path string
}

func NewDB(path string) *DB {
	db := &DB{
		Sessions: map[string]Session{},
		Notes:    NoteHistory{Shown: map[string][]int{}},
		path:     path,
	}
	db.load()
	return db
}

func (db *DB) load() {
	b, err := os.ReadFile(db.path)
	if err != nil {
		return
	}
	_ = json.Unmarshal(b, db)
	if db.Sessions == nil {
		db.Sessions = map[string]Session{}
	}
	if db.Notes.Shown == nil {
		db.Notes.Shown = map[string][]int{}
	}
	if db.Tasks.Done == nil {
		db.Tasks.Done = map[string]bool{}
	}
}

// save must be called while holding db.mu
func (db *DB) save() error {
	if err := os.MkdirAll(filepath.Dir(db.path), 0o755); err != nil {
		return err
	}
	b, err := json.MarshalIndent(db, "", "  ")
	if err != nil {
		return err
	}
	tmp := db.path + ".tmp"
	if err := os.WriteFile(tmp, b, 0o644); err != nil {
		return err
	}
	return os.Rename(tmp, db.path)
}
