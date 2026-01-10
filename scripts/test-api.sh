#!/bin/bash

# Test script for API connection

echo "🧪 Testing API Connection..."
echo ""

# Test 1: Connection test
echo "1️⃣ Testing connection endpoint..."
curl -s http://localhost:9002/api/test-connection | jq '.' || echo "Server not ready yet"
echo ""

# Test 2: Create a request
echo "2️⃣ Creating a transport request..."
curl -s -X POST http://localhost:9002/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "passengerName": "John Doe",
    "department": "Engineering",
    "purpose": "Meeting",
    "pickupLocation": "Building A",
    "dropLocation": "Building B",
    "scheduledTime": "2026-01-10T10:00:00Z",
    "priority": "normal",
    "requestType": "indoor"
  }' | jq '.'
echo ""

# Test 3: Get all requests
echo "3️⃣ Fetching all requests..."
curl -s http://localhost:9002/api/requests | jq '.'
echo ""

# Test 4: Register a vehicle
echo "4️⃣ Registering a vehicle..."
curl -s -X POST http://localhost:9002/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleNumber": "MH-12-AB-1234",
    "type": "car",
    "model": "Toyota Innova",
    "capacity": 7,
    "driverName": "Rajesh Kumar",
    "driverPhone": "+91-9876543210"
  }' | jq '.'
echo ""

# Test 5: Get all vehicles
echo "5️⃣ Fetching all vehicles..."
curl -s http://localhost:9002/api/vehicles | jq '.'
echo ""

echo "✅ API tests complete!"
