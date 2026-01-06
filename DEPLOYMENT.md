# Production Deployment Guide

## Issue: Site not working on https://www.samagamtransport.in/

The error "Something went wrong" on production is caused by missing Firebase environment variables.

## Solution: Configure Environment Variables

### For Vercel Deployment

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (studio)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyCpD5SX4LSR3Mi1a0DkP0YyxqeGChS-Tw4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = samagamtransport-375d5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = samagamtransport-375d5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = samagamtransport-375d5.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 498778405972
NEXT_PUBLIC_FIREBASE_APP_ID = 1:498778405972:web:643a654d21255fe73141c1
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-0REQ287TFZ
```

5. Select environment: **Production** (or all environments)
6. Save and **redeploy** your application

### For Firebase Hosting

If using Firebase Hosting, add to `apphosting.yaml`:

```yaml
env:
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    value: AIzaSyCpD5SX4LSR3Mi1a0DkP0YyxqeGChS-Tw4
  - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    value: samagamtransport-375d5.firebaseapp.com
  - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    value: samagamtransport-375d5
  - variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    value: samagamtransport-375d5.firebasestorage.app
  - variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    value: 498778405972
  - variable: NEXT_PUBLIC_FIREBASE_APP_ID
    value: 1:498778405972:web:643a654d21255fe73141c1
  - variable: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    value: G-0REQ287TFZ
```

### Using Vercel CLI

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
# Enter the value when prompted
# Repeat for all variables
```

Or import from file:
```bash
vercel env pull .env.production
```

## After Adding Variables

1. **Redeploy** your application
2. Clear browser cache or test in incognito mode
3. Check the dashboard: https://www.samagamtransport.in/dashboard

## Verification

To verify the environment variables are loaded:
1. Open browser console on production site
2. Check for Firebase initialization errors
3. The app should load without the "Something went wrong" error

## Local Development vs Production

- **Local (works)**: Uses `.env.local` or `.env.development`
- **Production (broken)**: Needs variables set in hosting platform
- **Codespaces (works)**: Uses environment from GitHub Codespaces settings

## Need Help?

If you're still seeing errors after setting environment variables:
1. Check browser console for specific error messages
2. Verify all variables are correctly set (no typos)
3. Ensure you redeployed after adding variables
4. Check Firebase console for any API restrictions
