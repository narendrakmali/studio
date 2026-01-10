# Firestore Initialization Fix

## Problem
Form submissions were failing with error: **"firestore is not initialized"**

## Root Cause
The `setFirestoreDb()` function was being called inside `useMemo()` in the FirebaseProvider, which doesn't guarantee proper execution timing. Additionally, both indoor and outdoor request pages were trying to initialize Firestore again in their own useEffect hooks, creating race conditions.

## Solution
1. **Moved setFirestoreDb to useEffect** in `src/firebase/provider.tsx`:
   - Now properly runs after component mount
   - Triggers whenever the firestore instance changes
   - Includes logging for debugging

2. **Removed redundant initialization** from pages:
   - Deleted complex retry logic from `src/app/indoor-request/page.tsx`
   - Deleted complex retry logic from `src/app/outdoor-request/page.tsx`
   - Pages now rely solely on the provider's initialization

## Files Changed
- `src/firebase/provider.tsx` - Moved setFirestoreDb to useEffect
- `src/app/indoor-request/page.tsx` - Removed redundant initialization
- `src/app/outdoor-request/page.tsx` - Removed redundant initialization

## Testing
Visit your forms and check the browser console:
1. You should see: `🔥 FirebaseProvider: setFirestoreDb called with firestore instance`
2. Submit a form - should no longer show "firestore is not initialized" error
3. Check Firebase Console to verify data is being saved

## Commit
```
82cd811 - Fix Firestore initialization - move setFirestoreDb to provider useEffect
```

## Next Steps
1. Wait 2-3 minutes for Vercel deployment
2. Test form submission on production: https://www.samagamtransport.in/indoor-request
3. Verify data appears in Firebase Console and dashboard
