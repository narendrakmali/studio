# Firebase Data Connect Setup Guide

## The Issue: "Failed to fetch" Error

You're seeing `DataConnectError: Failed to fetch: {}` because the API routes are now trying to connect to Firebase Data Connect, but the emulator isn't running or not configured properly.

## Quick Fix

### Option 1: Start Data Connect Emulator (Recommended for Development)

```bash
# Start Firebase emulators (includes Data Connect on port 9399)
firebase emulators:start
```

Or in a separate terminal:
```bash
# Start only Data Connect emulator
firebase emulators:start --only dataconnect
```

### Option 2: Connect to Production Data Connect

If you want to use production instead of emulator, you need to:

1. Deploy your Data Connect schema:
```bash
firebase deploy --only dataconnect
```

2. Remove emulator connection in server-side code (already done - it auto-detects environment)

## Verification Steps

### 1. Check if emulator is running
```bash
curl http://localhost:9399
# Should return some response if running
```

### 2. Test the API
```bash
# Test connection
curl http://localhost:9002/api/test-connection

# Create a test request
curl -X POST http://localhost:9002/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "passengerName": "Test User",
    "department": "Engineering", 
    "purpose": "Testing",
    "pickupLocation": "Building A",
    "dropLocation": "Building B",
    "scheduledTime": "2026-01-10T15:00:00Z"
  }'

# Fetch all requests
curl http://localhost:9002/api/requests
```

## Full Development Setup

### Terminal 1: Firebase Emulators
```bash
firebase emulators:start
```

This starts:
- Firestore (port 8080)
- Data Connect (port 9399)
- UI (port 4000)

### Terminal 2: Next.js Dev Server
```bash
npm run dev
```

Your app runs at: http://localhost:9002

### Terminal 3: Genkit (for AI flows)
```bash
npm run genkit:dev
```

## Environment Configuration

Make sure your `.env.local` has these variables:

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

# Optional: Emulator settings (auto-detected in development)
# FIREBASE_DATA_CONNECT_EMULATOR_HOST=localhost:9399
```

## How the Connection Works

### Client-Side (Browser)
```typescript
// Uses client-side Firebase initialization
import { initializeDataConnect } from '@/firebase/dataconnect';
const dc = initializeDataConnect(app);
```

### Server-Side (API Routes)
```typescript
// API routes initialize their own Firebase instance
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dc = getDataConnect(app, connectorConfig);
```

## Troubleshooting

### Error: "Failed to fetch: {}"

**Cause**: Data Connect emulator not running or Firebase not properly initialized

**Solutions**:
1. Start Firebase emulators: `firebase emulators:start`
2. Check Firebase config in `.env.local`
3. Verify Data Connect SDK is generated: `ls src/dataconnect-generated/`

### Error: "Data Connect not available"

**Cause**: Firebase initialization failed on server-side

**Solutions**:
1. Check all Firebase env variables are set
2. Verify firebaseConfig in `src/firebase/config.ts`
3. Check terminal for Firebase initialization errors

### Error: "connectorConfig not found"

**Cause**: Data Connect SDK not generated

**Solution**:
```bash
# Generate Data Connect SDK
firebase dataconnect:sdk:generate
```

### Empty Results from API

**Cause**: Database is empty

**Solution**: Seed the database
```bash
# From Firebase console or run seed script
# The Data Connect emulator UI is at http://localhost:4000
```

## Testing Without Emulator

If you can't run emulators, you can temporarily use mock data:

1. Create a flag in your API routes:
```typescript
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
```

2. Add to `.env.local`:
```env
USE_MOCK_DATA=true
```

3. The old in-memory cache code can be re-enabled for testing.

## Production Deployment

For production, the code automatically detects it's not in development and connects to production Firebase Data Connect (no emulator).

Ensure:
1. Data Connect schema is deployed: `firebase deploy --only dataconnect`
2. Environment variables are set in your hosting platform (Vercel, etc.)
3. Firebase project has Data Connect enabled

## Useful Commands

```bash
# Check what's running
lsof -i :9002  # Next.js
lsof -i :9399  # Data Connect emulator
lsof -i :8080  # Firestore emulator

# View emulator UI
open http://localhost:4000

# Check API status
curl http://localhost:9002/api/test-connection | jq

# View logs
firebase emulators:logs
```

## Next Steps

Once everything is running:
1. Visit http://localhost:9002/api-example to see the example page
2. Use the React hooks in your components
3. Check the [API_CONNECTION_GUIDE.md](API_CONNECTION_GUIDE.md) for usage examples
