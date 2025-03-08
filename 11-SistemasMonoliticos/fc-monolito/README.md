# Monolito - Full Cycle

## Rodando os Testes

1. Entre na pasta do projeto:
```bash
cd 11-SistemasMonoliticos/fc-monolito
```

2. Instale as dependências:
```bash
npm install
```

3. Execute os testes:
```bash
npm test
```

## Rodando a Aplicação

1. Inicie o servidor:
```bash
npm run dev
```

2. Abra o arquivo `api.http` e execute os requests na seguinte ordem:

### Criar um cliente
```http
POST http://localhost:3000/clients
Content-Type: application/json

{
    "name": "João da Silva",
    "email": "joao.silva@example.com",
    "document": "123456789",
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "12345-678"
}
```

### Criar um produto
```http
POST http://localhost:3000/products
Content-Type: application/json

{
    "name": "Product 1",
    "description": "Product 1 description",
    "purchasePrice": 100,
    "stock": 10
}
```

### Criar um pedido (checkout)
```http
POST http://localhost:3000/checkout
Content-Type: application/json

{
    "clientId": "{client_id}",
    "products": [
        {
            "productId": "{product_id}"
        }
    ]
}
```

### Buscar invoice
```http
GET http://localhost:3000/invoice/{invoice_id}
```

Parabéns! Você executou com sucesso os testes e a aplicação! 🎉 