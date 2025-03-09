#!/bin/bash

echo "Waiting for database to be ready..."
sleep 5

echo "Running migrations..."
npx sequelize-cli db:migrate

echo "Running seeds..."
npx sequelize-cli db:seed:all

echo "Starting application..."
npm run dev 