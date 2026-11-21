package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"
)

func dayKey(t time.Time) string {
	return t.Format("2006-01-02")
}

func ensureToday() []string {
	today := dayKey(time.Now())
	if db.Tasks.Date != today {
		db.Tasks.Date = today
		db.Tasks.Done = map[string]bool{}
	}
	return taskListForDay(time.Now().YearDay() + time.Now().Year()*366)
}

// recordHistoryIfNeeded добавляет/убирает сегодняшнюю дату из истории
// в зависимости от того, выполнен ли чек-лист полностью.
func recordHistoryIfNeeded(items []string) {
	today := db.Tasks.Date
	allDone := len(items) > 0
	for i := range items {
		if !db.Tasks.Done[strconv.Itoa(i)] {
			allDone = false
			break
		}
	}

	has := false
	idx := -1
	for i, d := range db.TasksHistory {
		if d == today {
			has = true
			idx = i
			break
		}
	}

	if allDone && !has {
		db.TasksHistory = append(db.TasksHistory, today)
	} else if !allDone && has {
		db.TasksHistory = append(db.TasksHistory[:idx], db.TasksHistory[idx+1:]...)
	}
}

type checklistItem struct {
	Index int    `json:"index"`
	Text  string `json:"text"`
	Done  bool   `json:"done"`
}

func handleTaskToday(w http.ResponseWriter, r *http.Request, s Session) {
	db.mu.Lock()
	defer db.mu.Unlock()

	items := ensureToday()
	_ = db.save()

	out := make([]checklistItem, 0, len(items))
	doneCount := 0
	for i, text := range items {
		done := db.Tasks.Done[strconv.Itoa(i)]
		if done {
			doneCount++
		}
		out = append(out, checklistItem{Index: i, Text: text, Done: done})
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"date":      db.Tasks.Date,
		"items":     out,
		"doneCount": doneCount,
		"total":     len(out),
	})
}

type toggleReq struct {
	Index int `json:"index"`
}

func handleTaskToggle(w http.ResponseWriter, r *http.Request, s Session) {
	var req toggleReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "неверный запрос")
		return
	}

	db.mu.Lock()
	defer db.mu.Unlock()

	items := ensureToday()
	if req.Index < 0 || req.Index >= len(items) {
		writeErr(w, http.StatusBadRequest, "неверный индекс")
		return
	}

	key := strconv.Itoa(req.Index)
	db.Tasks.Done[key] = !db.Tasks.Done[key]
	recordHistoryIfNeeded(items)

	if err := db.save(); err != nil {
		writeErr(w, http.StatusInternalServerError, "ошибка сохранения")
		return
	}

	writeJSON(w, http.StatusOK, map[string]bool{"done": db.Tasks.Done[key]})
}

// computeStreak возвращает (текущий стрик, самый длинный стрик) по списку
// дат (YYYY-MM-DD), когда чек-лист был выполнен полностью.
func computeStreak(history []string) (current int, longest int) {
	if len(history) == 0 {
		return 0, 0
	}
	days := map[string]bool{}
	for _, d := range history {
		days[d] = true
	}

	parsed := make([]time.Time, 0, len(days))
	for d := range days {
		t, err := time.Parse("2006-01-02", d)
		if err == nil {
			parsed = append(parsed, t)
		}
	}
	if len(parsed) == 0 {
		return 0, 0
	}

	sortedSet := map[int64]bool{}
	for _, t := range parsed {
		sortedSet[t.Unix()/86400] = true
	}

	// longest: ищем самую длинную последовательность подряд идущих дней
	longest = 0
	for day := range sortedSet {
		if sortedSet[day-1] {
			continue // не начало серии
		}
		length := 0
		d := day
		for sortedSet[d] {
			length++
			d++
		}
		if length > longest {
			longest = length
		}
	}

	// current: серия, доходящая до сегодня или вчера (чтобы не обнулять
	// стрик до конца текущего дня, если ещё не отметила пункты)
	todayDay := time.Now().Truncate(24*time.Hour).Unix() / 86400
	anchor := todayDay
	if !sortedSet[todayDay] {
		anchor = todayDay - 1
	}
	current = 0
	d := anchor
	for sortedSet[d] {
		current++
		d--
	}

	return current, longest
}
