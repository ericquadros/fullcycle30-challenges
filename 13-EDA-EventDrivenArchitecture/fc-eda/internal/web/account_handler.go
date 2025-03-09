package web

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/usecase/create_account"
)

type WebAccountHandler struct {
	CreateAccountUseCase create_account.CreateAccountUseCase
}

type CreditAccountInput struct {
	Amount float64 `json:"amount"`
}

func NewWebAccountHandler(createAccountUseCase create_account.CreateAccountUseCase) *WebAccountHandler {
	return &WebAccountHandler{
		CreateAccountUseCase: createAccountUseCase,
	}
}

func (h *WebAccountHandler) CreateAccount(w http.ResponseWriter, r *http.Request) {
	var dto create_account.CreateAccountInputDTO
	err := json.NewDecoder(r.Body).Decode(&dto)
	if err != nil {
		fmt.Printf("Error decoding request body: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	fmt.Printf("Creating account with client_id: %s\n", dto.ClientID)
	output, err := h.CreateAccountUseCase.Execute(dto)
	if err != nil {
		fmt.Printf("Error executing create account use case: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	err = json.NewEncoder(w).Encode(output)
	if err != nil {
		fmt.Printf("Error encoding response: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

// HandleAccount handles all account-related requests (credit, balance)
func (h *WebAccountHandler) HandleAccount(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid path"})
		return
	}

	accountID := parts[2]
	operation := parts[3]

	switch operation {
	case "credit":
		h.handleCredit(w, r, accountID)
	case "balance":
		h.handleBalance(w, r, accountID)
	default:
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "operation not found"})
	}
}

func (h *WebAccountHandler) handleCredit(w http.ResponseWriter, r *http.Request, accountID string) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var input CreditAccountInput
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
		return
	}

	w.WriteHeader(http.StatusNotImplemented)
	json.NewEncoder(w).Encode(map[string]string{"error": "credit operation not implemented yet"})
}

func (h *WebAccountHandler) handleBalance(w http.ResponseWriter, r *http.Request, accountID string) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	w.WriteHeader(http.StatusNotImplemented)
	json.NewEncoder(w).Encode(map[string]string{"error": "balance check not implemented yet"})
}