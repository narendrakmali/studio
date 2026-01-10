'use client';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

type Sdks = {
  firebaseApp: FirebaseApp | null;
  auth: ReturnType<typeof getAuth> | null;
  firestore: any;
};

function createStubSdks(): Sdks {
  return { firebaseApp: null, auth: null, firestore: null };
}

export function initializeFirebase(): Sdks {
  // Never initialize Firebase during build or on server
  if (typeof window === 'undefined') {
    return createStubSdks();
  }

  const hasApiKey = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const hasProjectId = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!hasApiKey || !hasProjectId) {
    console.warn('Firebase env vars missing — returning stubbed SDKs for build/prerender.');
    return createStubSdks();
  }

  if (!getApps().length) {
    try {
      const firebaseApp = initializeApp(firebaseConfig);
      return getSdks(firebaseApp);
    } catch (e) {
      console.warn('Firebase initialization failed:', e);
      return createStubSdks();
    }
  }

  try {
    return getSdks(getApp());
  } catch (e) {
    console.warn('Firebase getApp failed:', e);
    return createStubSdks();
  }
}

export function getSdks(firebaseApp: FirebaseApp | null) {
  if (!firebaseApp) {
    return { firebaseApp: null, auth: null, firestore: null };
  }
  
  let firestoreInstance = null;
  try {
    const { getFirestore } = require('firebase/firestore');
    firestoreInstance = getFirestore(firebaseApp);
  } catch (e) {
    // Firestore not available
  }
  
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: firestoreInstance,
  };
}

export * from './provider';
export * from './client-provider';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';