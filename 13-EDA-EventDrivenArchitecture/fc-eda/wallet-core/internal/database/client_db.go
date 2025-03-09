package database

import (
	"database/sql"
	"fmt"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/entity"
)

type ClientDB struct {
    DB *sql.DB
}

func NewClientDB(db *sql.DB) *ClientDB {
    return &ClientDB{
        DB: db,
    }
}

func (c *ClientDB) Get(id string) (*entity.Client, error) {
    fmt.Printf("Searching for client with ID: %s\n", id)
    client := &entity.Client{}
    stmt, err := c.DB.Prepare("SELECT id, name, email, created_at FROM clients WHERE id = ?")
    if err != nil {
        fmt.Printf("Error preparing statement: %v\n", err)
        return nil, err
    }
    defer stmt.Close()
    row := stmt.QueryRow(id)
    if err := row.Scan(&client.ID, &client.Name, &client.Email, &client.CreatedAt); err != nil {
        if err == sql.ErrNoRows {
            fmt.Printf("No client found with ID: %s\n", id)
        } else {
            fmt.Printf("Error scanning client data: %v\n", err)
        }
        return nil, err
    }
    fmt.Printf("Found client: %+v\n", client)
    return client, nil
}

func (c *ClientDB) Save(client *entity.Client) error {
    fmt.Printf("Saving client: %+v\n", client)
    stmt, err := c.DB.Prepare("INSERT INTO clients (id, name, email, created_at) VALUES (?, ?, ?, ?)")
    if err != nil {
        fmt.Printf("Error preparing statement: %v\n", err)
        return err
    }
    defer stmt.Close()
    _, err = stmt.Exec(client.ID, client.Name, client.Email, client.CreatedAt)
    if err != nil {
        fmt.Printf("Error executing statement: %v\n", err)
        return err
    }
    fmt.Printf("Client saved successfully\n")
    return nil
}