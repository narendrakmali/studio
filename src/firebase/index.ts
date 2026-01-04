'use client';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

type Sdks = {
  firebaseApp: FirebaseApp | null;
  auth: ReturnType<typeof getAuth> | null;
  firestore: ReturnType<typeof getFirestore> | null;
};

function createStubSdks(): Sdks {
  return { firebaseApp: null, auth: null, firestore: null };
}

export function initializeFirebase(): Sdks {
  const hasApiKey = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const hasProjectId = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!hasApiKey || !hasProjectId) {
    console.warn('Firebase env vars missing — returning stubbed SDKs for build/prerender.');
    return createStubSdks();
  }

  if (!getApps().length) {
    try {
      const firebaseApp = initializeApp();
      return getSdks(firebaseApp);
    } catch (e) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      const firebaseApp = initializeApp(firebaseConfig as any);
      return getSdks(firebaseApp);
    }
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp | null) {
  if (!firebaseApp) {
    return { firebaseApp: null, auth: null, firestore: null };
  }
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';