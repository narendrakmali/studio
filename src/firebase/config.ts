// Log configuration status (helpful for debugging on mobile)
// Only run this check on the client side to avoid build-time errors
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const hasConfig = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
  if (!hasConfig) {
    console.error(
      '🔥 Firebase Configuration Error!\n\n' +
      'Environment variables are missing. This will cause the app to fail.\n\n' +
      'Missing variables:\n' +
      (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '  ✗ NEXT_PUBLIC_FIREBASE_API_KEY\n' : '') +
      (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '  ✗ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n' : '') +
      (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '  ✗ NEXT_PUBLIC_FIREBASE_PROJECT_ID\n' : '') +
      (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '  ✗ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\n' : '') +
      (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '  ✗ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n' : '') +
      (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '  ✗ NEXT_PUBLIC_FIREBASE_APP_ID\n' : '') +
      '\n' +
      'Visit https://www.samagamtransport.in/debug to see the current status.\n' +
      'See DEPLOYMENT.md for instructions on how to fix this.'
    );
  } else {
    console.log('✓ Firebase configuration loaded successfully');
  }
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};