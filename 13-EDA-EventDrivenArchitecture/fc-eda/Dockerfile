FROM golang:1.19 as builder

WORKDIR /app

COPY . .

RUN apt-get update && \
    apt-get install -y build-essential librdkafka-dev

RUN go mod tidy
RUN CGO_ENABLED=1 GOOS=linux go build -o server ./cmd/walletcore/main.go

FROM debian:bookworm-slim

WORKDIR /app

# Configurar noninteractive e timezone
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Atualizar e instalar dependências em etapas separadas
RUN apt-get update && \
    apt-get install -y \
    librdkafka1 \
    curl \
    netcat-traditional \
    default-mysql-client \
    ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/server .
COPY sql/migrations /app/sql/migrations
COPY scripts/start.sh /app/start.sh

RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]