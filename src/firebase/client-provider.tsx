'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Never initialize on server - only in browser
    if (typeof window === 'undefined') {
      return { firebaseApp: null, auth: null, firestore: null };
    }

    // Initialize Firebase on the client side, once per component mount.
    // Wrap in try-catch for additional safety on mobile devices
    try {
      const services = initializeFirebase();
      
      // Check if Firebase initialization failed due to missing config
      if (!services.firebaseApp) {
        const hasApiKey = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const hasProjectId = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        
        if (!hasApiKey || !hasProjectId) {
          console.error(
            '🔥 Firebase Configuration Error:\n' +
            'Required environment variables are missing.\n' +
            'Please ensure the following are set in your production environment:\n' +
            '- NEXT_PUBLIC_FIREBASE_API_KEY\n' +
            '- NEXT_PUBLIC_FIREBASE_PROJECT_ID\n' +
            '- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n' +
            '- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\n' +
            '- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n' +
            '- NEXT_PUBLIC_FIREBASE_APP_ID'
          );
        }
      }
      
      return services;
    } catch (error) {
      console.error('FirebaseClientProvider: Failed to initialize Firebase:', error);
      return { firebaseApp: null, auth: null, firestore: null };
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}