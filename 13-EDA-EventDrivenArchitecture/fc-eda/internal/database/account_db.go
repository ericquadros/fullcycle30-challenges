package database

import (
	"database/sql"
	"fmt"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/entity"
)

type AccountDB struct {
	DB *sql.DB
}

func NewAccountDB(db *sql.DB) *AccountDB {
	return &AccountDB{
		DB: db,
	}
}

func (a *AccountDB) FindByID(id string) (*entity.Account, error) {
	fmt.Printf("🔍 Searching for account...\n")
	fmt.Printf("Account ID: [%s]\n", id)
	
	var account entity.Account
	var client entity.Client
	account.Client = &client

	stmt, err := a.DB.Prepare("SELECT a.id, a.client_id, a.balance, a.created_at, c.name, c.email, c.created_at FROM accounts a INNER JOIN clients c ON a.client_id = c.id WHERE a.id = ?")
	if err != nil {
		fmt.Printf("❌ Error preparing statement: %v\n", err)
		return nil, err
	}
	defer stmt.Close()
	row := stmt.QueryRow(id)
	err = row.Scan(
		&account.ID,
		&account.Client.ID,
		&account.Balance,
		&account.CreatedAt,
		&client.Name,
		&client.Email,
		&client.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Printf("❌ Account not found\n")
			fmt.Printf("ID: [%s]\n", id)
		} else {
			fmt.Printf("❌ Error scanning account data: %v\n", err)
		}
		return nil, err
	}
	client.ID = account.Client.ID // Garantir que o ID do cliente está correto
	
	fmt.Printf("✅ Account found!\n")
	fmt.Printf("Account ID: [%s]\n", account.ID)
	fmt.Printf("Client ID: [%s]\n", account.Client.ID)
	fmt.Printf("Client Name: %s\n", client.Name)
	fmt.Printf("Balance: %.2f\n", account.Balance)
	fmt.Printf("------------------------\n")
	
	return &account, nil
}

func (a *AccountDB) Save(account *entity.Account) error {
	fmt.Printf("💾 Saving new account...\n")
	fmt.Printf("Account ID: [%s]\n", account.ID)
	fmt.Printf("Client ID: [%s]\n", account.Client.ID)
	fmt.Printf("Initial Balance: %.2f\n", account.Balance)
	
	stmt, err := a.DB.Prepare("INSERT INTO accounts (id, client_id, balance, created_at) VALUES (?, ?, ?, ?)")
	if err != nil {
		fmt.Printf("❌ Error preparing statement: %v\n", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(account.ID, account.Client.ID, account.Balance, account.CreatedAt)
	if err != nil {
		fmt.Printf("❌ Error executing statement: %v\n", err)
		return err
	}
	fmt.Printf("✅ Account saved successfully!\n")
	fmt.Printf("------------------------\n")
	return nil
}

func (a *AccountDB) UpdateBalance(account *entity.Account) error {
	fmt.Printf("💰 Updating account balance...\n")
	fmt.Printf("Account ID: [%s]\n", account.ID)
	fmt.Printf("New Balance: %.2f\n", account.Balance)
	
	stmt, err := a.DB.Prepare("UPDATE accounts SET balance = ? WHERE id = ?")
	if err != nil {
		fmt.Printf("❌ Error preparing statement: %v\n", err)
		return err
	}
	defer stmt.Close()
	_, err = stmt.Exec(account.Balance, account.ID)
	if err != nil {
		fmt.Printf("❌ Error executing statement: %v\n", err)
		return err
	}
	fmt.Printf("✅ Balance updated successfully!\n")
	fmt.Printf("------------------------\n")
	return nil
}
