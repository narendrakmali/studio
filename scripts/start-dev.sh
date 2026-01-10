#!/bin/bash

# Start development environment script
# This starts all required services for development

echo "🚀 Starting Studio Development Environment"
echo ""

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Function to kill process on port
kill_port() {
    echo "Killing process on port $1..."
    lsof -ti :$1 | xargs kill -9 2>/dev/null
}

# Clean up any existing processes
echo "🧹 Cleaning up existing processes..."
kill_port 9002  # Next.js
kill_port 9399  # Data Connect
kill_port 8080  # Firestore
kill_port 4000  # Emulator UI

echo ""
echo "Starting services..."
echo ""

# Start Firebase emulators in background
echo "1️⃣ Starting Firebase Emulators (Data Connect, Firestore)..."
firebase emulators:start > /tmp/firebase-emulators.log 2>&1 &
FIREBASE_PID=$!
echo "   Firebase PID: $FIREBASE_PID"

# Wait for emulators to be ready
echo "   Waiting for emulators to start..."
sleep 5

# Check if Data Connect emulator is running
if check_port 9399; then
    echo "   ✅ Data Connect emulator running on port 9399"
else
    echo "   ❌ Data Connect emulator failed to start"
    echo "   Check logs: tail -f /tmp/firebase-emulators.log"
fi

# Check if Firestore emulator is running
if check_port 8080; then
    echo "   ✅ Firestore emulator running on port 8080"
else
    echo "   ⚠️  Firestore emulator not running"
fi

echo ""

# Start Next.js dev server
echo "2️⃣ Starting Next.js Development Server..."
npm run dev > /tmp/nextjs-dev.log 2>&1 &
NEXTJS_PID=$!
echo "   Next.js PID: $NEXTJS_PID"

# Wait for Next.js to be ready
echo "   Waiting for Next.js to start..."
sleep 8

if check_port 9002; then
    echo "   ✅ Next.js running on http://localhost:9002"
else
    echo "   ❌ Next.js failed to start"
    echo "   Check logs: tail -f /tmp/nextjs-dev.log"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Development Environment Ready!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Application:      http://localhost:9002"
echo "📊 Emulator UI:      http://localhost:4000"
echo "🔗 API Example:      http://localhost:9002/api-example"
echo "🧪 Test Connection:  http://localhost:9002/api/test-connection"
echo ""
echo "📝 Logs:"
echo "   Firebase: tail -f /tmp/firebase-emulators.log"
echo "   Next.js:  tail -f /tmp/nextjs-dev.log"
echo ""
echo "🛑 To stop all services, run:"
echo "   ./scripts/stop-dev.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Keep script running
wait
