# 🔌 API Connection - Quick Fix

## Problem
Getting `DataConnectError: Failed to fetch: {}` error.

## Solution

### Start Firebase Data Connect Emulator

```bash
# Option 1: Use the automated script
./scripts/start-dev.sh

# Option 2: Start manually
firebase emulators:start
```

Then in another terminal:
```bash
npm run dev
```

## Verify It's Working

```bash
# Should see Firebase config and Data Connect status
curl http://localhost:9002/api/test-connection | jq

# Create a test request
curl -X POST http://localhost:9002/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "passengerName": "Test",
    "department": "Engineering",
    "purpose": "Testing API",
    "pickupLocation": "A",
    "dropLocation": "B",
    "scheduledTime": "2026-01-10T15:00:00Z"
  }'

# Fetch all requests
curl http://localhost:9002/api/requests | jq
```

## What's Running

After starting:
- **Next.js**: http://localhost:9002
- **Firebase Emulator UI**: http://localhost:4000
- **Data Connect Emulator**: localhost:9399
- **Example Page**: http://localhost:9002/api-example

## Full Documentation

- **Setup Guide**: [DATACONNECT_SETUP.md](DATACONNECT_SETUP.md)
- **API Usage**: [API_CONNECTION_GUIDE.md](API_CONNECTION_GUIDE.md)
- **Quick Reference**: [API_QUICK_REFERENCE.md](API_QUICK_REFERENCE.md)
