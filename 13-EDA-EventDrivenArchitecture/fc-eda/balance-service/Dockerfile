# Build stage
FROM node:18-slim AS builder

WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /usr/src/app

# Install production dependencies and tools
RUN apt-get update && apt-get install -y \
    netcat-traditional \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies including sequelize-cli
COPY package*.json ./
RUN npm install && \
    npm install -g typescript sequelize-cli

# Copy configuration files
COPY --from=builder /usr/src/app/.sequelizerc ./
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/dist ./dist

# Make start script executable
COPY --from=builder /usr/src/app/scripts ./scripts
RUN chmod +x ./scripts/start.sh

CMD ["./scripts/start.sh"]