# Usa uma versão LTS e compatível do Node
FROM node:20

WORKDIR /usr/src/app

# Atualiza os pacotes e instala o wget
RUN apt-get clean && apt-get update && apt-get install -y wget \
    && rm -rf /var/lib/apt/lists/*

# Instala Dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Expõe a porta usada pelo Node.js
EXPOSE 3000

# Copia os arquivos package.json e package-lock.json primeiro
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Define o comando de execução do container
CMD ["node", "index.js"]
