#!/bin/sh

echo "🔄 Waiting for Go API to be ready..."
until curl -f http://goapp:8080/health > /dev/null 2>&1; do
    echo "⏳ API not ready yet. Waiting..."
    sleep 2
done
echo "✅ Go API is ready!"

echo "📝 Creating test data..."

# Create first client (John Doe)
echo "👤 Creating client 1 (John Doe)..."
CLIENT1_RESPONSE=$(curl -s -X POST http://goapp:8080/clients \
    -H "Content-Type: application/json" \
    -d '{"name": "John Doe", "email": "john@j.com"}')
CLIENT1_ID=$(echo $CLIENT1_RESPONSE | sed 's/.*"ID":"\([^"]*\)".*/\1/')
echo "✅ Client 1 created with ID: $CLIENT1_ID"

# Create account for first client
echo "💰 Creating account for client 1..."
ACCOUNT1_RESPONSE=$(curl -s -X POST http://goapp:8080/accounts \
    -H "Content-Type: application/json" \
    -d "{\"client_id\": \"$CLIENT1_ID\", \"initial_balance\": 2000}")
ACCOUNT1_ID=$(echo $ACCOUNT1_RESPONSE | sed 's/.*"id":"\([^"]*\)".*/\1/')
echo "✅ Account 1 created with ID: $ACCOUNT1_ID"

# Create second client (Jane Wasley)
echo "👤 Creating client 2 (Jane Wasley)..."
CLIENT2_RESPONSE=$(curl -s -X POST http://goapp:8080/clients \
    -H "Content-Type: application/json" \
    -d '{"name": "Jane Wasley", "email": "jane@j.com"}')
CLIENT2_ID=$(echo $CLIENT2_RESPONSE | sed 's/.*"ID":"\([^"]*\)".*/\1/')
echo "✅ Client 2 created with ID: $CLIENT2_ID"

# Create account for second client
echo "💰 Creating account for client 2..."
ACCOUNT2_RESPONSE=$(curl -s -X POST http://goapp:8080/accounts \
    -H "Content-Type: application/json" \
    -d "{\"client_id\": \"$CLIENT2_ID\", \"initial_balance\": 1500}")
ACCOUNT2_ID=$(echo $ACCOUNT2_RESPONSE | sed 's/.*"id":"\([^"]*\)".*/\1/')
echo "✅ Account 2 created with ID: $ACCOUNT2_ID"

# Make transactions
echo "💸 Creating transactions..."
curl -s -X POST http://goapp:8080/transactions \
    -H "Content-Type: application/json" \
    -d "{\"account_id_from\": \"$ACCOUNT1_ID\", \"account_id_to\": \"$ACCOUNT2_ID\", \"amount\": 100}"
echo "✅ Transaction 1 completed: 100 transferred"

sleep 2 # Wait a bit between transactions

curl -s -X POST http://goapp:8080/transactions \
    -H "Content-Type: application/json" \
    -d "{\"account_id_from\": \"$ACCOUNT1_ID\", \"account_id_to\": \"$ACCOUNT2_ID\", \"amount\": 300}"
echo "✅ Transaction 2 completed: 300 transferred"

echo "✨ Test data initialization completed!" 