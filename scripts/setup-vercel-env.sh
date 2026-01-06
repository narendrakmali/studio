#!/bin/bash

# Script to add Firebase environment variables to Vercel
# Run this script to configure your production environment

echo "🔥 Setting up Firebase environment variables for Vercel..."
echo ""
echo "This will add the following variables to your Vercel project:"
echo ""

# Check if vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "Install it with: npm i -g vercel"
    exit 1
fi

echo "Adding environment variables..."
echo ""

# Add each environment variable
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production <<< "AIzaSyCpD5SX4LSR3Mi1a0DkP0YyxqeGChS-Tw4"
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production <<< "samagamtransport-375d5.firebaseapp.com"
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production <<< "samagamtransport-375d5"
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production <<< "samagamtransport-375d5.firebasestorage.app"
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production <<< "498778405972"
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production <<< "1:498778405972:web:643a654d21255fe73141c1"
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production <<< "G-0REQ287TFZ"

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "Now redeploy your application:"
echo "  vercel --prod"
echo ""
echo "After deployment, visit https://www.samagamtransport.in/debug to verify the configuration."
