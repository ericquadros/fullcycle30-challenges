package web

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/usecase/create_transaction"
)

type WebTransactionHandler struct {
	CreateTransactionUseCase create_transaction.CreateTransactionUseCase
}

func NewWebTransactionHandler(createTransactionUseCase create_transaction.CreateTransactionUseCase) *WebTransactionHandler {
	return &WebTransactionHandler{
		CreateTransactionUseCase: createTransactionUseCase,
	}
}

func (h *WebTransactionHandler) CreateTransaction(w http.ResponseWriter, r *http.Request) {
	var dto create_transaction.CreateTransactionInputDTO
	err := json.NewDecoder(r.Body).Decode(&dto)
	if err != nil {
		fmt.Printf("Error decoding transaction request body: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	fmt.Printf("=== Starting Transaction ===\n")
	fmt.Printf("From Account ID: [%s]\n", dto.AccountIDFrom)
	fmt.Printf("To Account ID: [%s]\n", dto.AccountIDTo)
	fmt.Printf("Amount: %.2f\n", dto.Amount)
	fmt.Printf("========================\n")
	
	ctx := r.Context()
	output, err := h.CreateTransactionUseCase.Execute(ctx, dto)
	if err != nil {
		fmt.Printf("❌ Transaction failed: %v\n", err)
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	fmt.Printf("✅ Transaction completed successfully!\n")
	fmt.Printf("Transaction ID: %s\n", output.ID)
	fmt.Printf("========================\n")

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(output)
	if err != nil {
		fmt.Printf("Error encoding transaction response: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}
