package webserver

import (
	"net/http"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
)

type WebServer struct {
	Router        chi.Router
	WebServerPort string
}

func NewWebServer(webServerPort string) *WebServer {
	router := chi.NewRouter()
	// Adicionar middleware logo após criar o router
	router.Use(middleware.Logger)
	
	return &WebServer{
		Router:        router,
		WebServerPort: webServerPort,
	}
}

func (s *WebServer) AddHandler(path string, handler http.HandlerFunc) {
	s.Router.Post(path, handler)
}

func (s *WebServer) Start() {
	// Add health check endpoint
	s.Router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("healthy"))
	})
	
	http.ListenAndServe(s.WebServerPort, s.Router)
}