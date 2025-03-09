#!/bin/bash

echo "Waiting for MySQL to be ready..."
until nc -z mysql 3306; do
    echo "MySQL is unavailable - sleeping"
    sleep 2
done
echo "MySQL is up and running!"

echo "Running migrations..."
mysql -h mysql -u root -proot wallet < /app/sql/migrations/000001_create_tables.sql

echo "Starting the application..."
exec ./server 