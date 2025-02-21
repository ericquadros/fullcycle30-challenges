# Etapa de build
FROM golang:1.22 as builder

WORKDIR /app

# Copia o código fonte
COPY main.go .

# Compila o binário de forma estática
RUN CGO_ENABLED=0 GOOS=linux go build -o app main.go

# Etapa final: usando a imagem mínima possível
FROM scratch

# Copia o binário compilado
COPY --from=builder /app/app /app

# Define o binário como ponto de entrada
ENTRYPOINT ["/app"]
