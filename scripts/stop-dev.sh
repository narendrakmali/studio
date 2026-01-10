#!/bin/bash

# Stop all development services

echo "🛑 Stopping Studio Development Environment"
echo ""

# Function to kill process on port
kill_port() {
    if lsof -i :$1 > /dev/null 2>&1; then
        echo "Stopping process on port $1..."
        lsof -ti :$1 | xargs kill -9 2>/dev/null
        echo "   ✅ Port $1 freed"
    else
        echo "   ℹ️  Nothing running on port $1"
    fi
}

kill_port 9002  # Next.js
kill_port 9399  # Data Connect
kill_port 8080  # Firestore
kill_port 4000  # Emulator UI
kill_port 5001  # Functions (if running)

echo ""
echo "✅ All services stopped"
