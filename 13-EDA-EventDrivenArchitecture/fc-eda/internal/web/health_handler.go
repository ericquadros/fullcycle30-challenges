package web

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type WebHealthHandler struct {
	db          *sql.DB
	kafkaConfig *ckafka.ConfigMap
}

type HealthResponse struct {
	Status    string `json:"status"`
	Database  string `json:"database"`
	Kafka     string `json:"kafka"`
	Timestamp string `json:"timestamp"`
}

func NewWebHealthHandler(db *sql.DB, kafkaConfig *ckafka.ConfigMap) *WebHealthHandler {
	return &WebHealthHandler{
		db:          db,
		kafkaConfig: kafkaConfig,
	}
}

func (h *WebHealthHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	health := HealthResponse{
		Status:    "up",
		Database:  "down",
		Kafka:     "down",
		Timestamp: time.Now().Format(time.RFC3339),
	}

	// Check Database
	if err := h.db.Ping(); err == nil {
		health.Database = "up"
	}

	// Check Kafka
	producer, err := ckafka.NewProducer(h.kafkaConfig)
	if err == nil {
		health.Kafka = "up"
		producer.Close()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(health)
} 