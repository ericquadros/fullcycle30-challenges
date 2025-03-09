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

echo "🌱 Checking and running seeds if needed..."
sequelize-cli db:seed:all --debug
# Note: We don't exit on seed failure because it might just mean data already exists
if [ $? -eq 0 ]; then
  echo "✅ Seed process completed!"
else
  echo "⚠️ Seed process completed with warnings (data might already exist)"
fi

echo "🚀 Starting application..."
node dist/app.js 