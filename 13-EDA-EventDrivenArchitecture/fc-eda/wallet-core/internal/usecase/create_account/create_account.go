package create_account

import (
	"github.com.br/devfullcycle/fc-ms-wallet/internal/entity"
	"github.com.br/devfullcycle/fc-ms-wallet/internal/gateway"
)

type CreateAccountInputDTO struct {
	ClientID      string  `json:"client_id"`
	InitialBalance float64 `json:"initial_balance"`
}

type CreateAccountOutputDTO struct {
	ID      string  `json:"id"`
	Balance float64 `json:"balance"`
}

type CreateAccountUseCase struct {
	AccountGateway  gateway.AccountGateway
	ClientGateway   gateway.ClientGateway
}

func NewCreateAccountUseCase(a gateway.AccountGateway, c gateway.ClientGateway) *CreateAccountUseCase {
	return &CreateAccountUseCase{
		AccountGateway:  a,
		ClientGateway:   c,
	}
}

func (uc *CreateAccountUseCase) Execute(input CreateAccountInputDTO) (*CreateAccountOutputDTO, error) {
	client, err := uc.ClientGateway.Get(input.ClientID)
	if err != nil {
		return nil, err
	}
	account := entity.NewAccount(client)
	if input.InitialBalance > 0 {
		account.Credit(input.InitialBalance)
	}
	err = uc.AccountGateway.Save(account)
	if err != nil {
		return nil, err
	}
	output := &CreateAccountOutputDTO{
		ID:      account.ID,
		Balance: account.Balance,
	}
	return output, nil
}
