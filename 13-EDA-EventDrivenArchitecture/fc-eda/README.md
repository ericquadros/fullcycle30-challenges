# Event-Driven Architecture Challenge

## Como Rodar o Projeto

### Pré-requisitos
- Docker
- Docker Compose

### Iniciando os Serviços

1. Na pasta `13-EDA-EventDrivenArchitecture/fc-eda`, execute o comando:
```bash
docker compose up -d
```

O parâmetro `-d` (detached mode) permite que os containers rodem em background, liberando o terminal para outros comandos.

Este comando irá iniciar todos os serviços necessários:
- Wallet Core Service (Go)
- Balance Service (Node.js/TypeScript)
- Kafka
- Zookeeper
- MySQL (Wallet Core Database)
- PostgreSQL (Balance Service Database)
- Kafka UI

### Monitoramento Kafka

Você pode acessar a interface do Kafka UI em:
```
http://localhost:8090
```

Esta ferramenta permite visualizar:
- Tópicos Kafka
- Produtores e Consumidores
- Mensagens em tempo real
- Métricas e configurações

### Endpoints Disponíveis

#### Balance Service (porta 3003)
```http
# Listar todas as contas e seus saldos
GET http://localhost:3003/balances

# Consultar saldo de uma conta específica
GET http://localhost:3003/balances/{account_id}
```

#### Wallet Core (porta 8080)
```http
# Criar uma carteira
POST http://localhost:8080/wallets

# Realizar uma transação
POST http://localhost:8080/transactions
```

## Descrição do Desafio

Olá Dev!

Agora que você entendeu os principais conceitos sobre microsserviços e da arquitetura baseada em eventos. Desenvolva um microsserviço em sua linguagem de preferência que seja capaz de receber via Kafka os eventos gerados pelo microsserviço "Wallet Core" e persistir no banco de dados os balances atualizados para cada conta.

Crie um endpoint: "/balances/{account_id}" que exibe o balance atualizado.

### Requisitos para entrega:
- Tudo deve rodar via Docker / Docker-compose
- Com um único docker-compose up -d todos os microsserviços, incluindo o da wallet core precisam estar disponíveis para que possamos fazer a correção.
- Não esqueça de rodar migrations e popular dados fictícios em ambos bancos de dados (wallet core e o microsserviço de balances) de forma automática quando os serviços subirem.
- Gere o arquivo ".http" para realizarmos as chamadas em seu microsserviço da mesma forma que fizemos no microsserviço "wallet core"
- Disponibilize o microsserviço na porta: 3003.

### Observações:
- Nosso objetivo com esse desafio não é corrigir seu código ou verificar a qualidade da sua aplicação, mas sim garantir que você teve o entendendimento da importância da produção e consumo de eventos.

- Nosso suporte nesse desafio vai até o escopo conceitual sobre o entendimento dos eventos e não entrará no mérito da análise de seu código, e é exatamente por isso que estamos permitindo que você utilize a linguagem de programação que você ache mais conveniente. 