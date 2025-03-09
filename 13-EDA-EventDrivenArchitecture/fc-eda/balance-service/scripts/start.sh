#!/bin/sh

# Export database credentials
export PGPASSWORD=password

echo "🔍 Checking Postgres connection..."
until nc -z postgres 5432; do
  echo "⏳ Waiting for Postgres to be ready..."
  sleep 1
done
echo "✅ Postgres is ready!"

echo "📊 Checking if database exists..."
if ! psql -h postgres -U user -d balance_db -c '\q' 2>/dev/null; then
  echo "🔧 Creating database..."
  psql -h postgres -U user -c 'CREATE DATABASE balance_db;'
fi
echo "✅ Database check completed!"

echo "🔄 Running migrations..."
sequelize-cli db:migrate --debug
if [ $? -ne 0 ]; then
  echo "❌ Migration failed!"
  exit 1
fi
echo "✅ Migrations completed successfully!"

echo "🌱 Running seeds..."
sequelize-cli db:seed:all --debug
if [ $? -ne 0 ]; then
  echo "❌ Seeding failed!"
  exit 1
fi
echo "✅ Seeds completed successfully!"

echo "🚀 Starting application..."
node dist/app.js 