#!/bin/bash

# Quick Start Guide for Data Connect Migration

echo "🚀 Studio Transport - Data Connect Quick Start"
echo "=============================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI found"
echo ""

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

echo "📦 Step 1: Installing dependencies..."
npm install
echo ""

echo "🔧 Step 2: Generating Data Connect SDK..."
firebase dataconnect:sdk:generate
echo ""

echo "🔍 Step 3: Checking ports..."
if check_port 9399; then
    echo "⚠️  Port 9399 (Data Connect) is already in use"
else
    echo "✅ Port 9399 (Data Connect) is available"
fi

if check_port 9002; then
    echo "⚠️  Port 9002 (Next.js) is already in use"
else
    echo "✅ Port 9002 (Next.js) is available"
fi
echo ""

echo "🚀 Step 4: Starting services..."
echo ""
echo "Choose an option:"
echo "  1) Start Data Connect emulator + Next.js dev server"
echo "  2) Start Data Connect emulator only"
echo "  3) Start Next.js dev server only"
echo "  4) Generate SDK and exit"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo "Starting both Data Connect emulator and Next.js..."
        # Start Data Connect in background
        firebase emulators:start --only dataconnect &
        FIREBASE_PID=$!
        
        # Wait for emulator to start
        echo "Waiting for Data Connect emulator to start..."
        sleep 5
        
        # Start Next.js
        npm run dev
        
        # Cleanup on exit
        trap "kill $FIREBASE_PID" EXIT
        ;;
    2)
        echo "Starting Data Connect emulator..."
        firebase emulators:start --only dataconnect
        ;;
    3)
        echo "Starting Next.js dev server..."
        npm run dev
        ;;
    4)
        echo "SDK already generated. Exiting."
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "=============================================="
echo "📚 Useful Resources:"
echo "   - Migration Guide: FIRESTORE_TO_DATACONNECT_MIGRATION.md"
echo "   - Code Examples: src/lib/dataconnect-examples.ts"
echo "   - Summary: MIGRATION_COMPLETE.md"
echo ""
echo "🌐 Emulator UIs:"
echo "   - Firebase Emulator: http://localhost:4000"
echo "   - Next.js App: http://localhost:9002"
echo "=============================================="
