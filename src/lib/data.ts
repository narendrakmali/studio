
'use client';

import type { Vehicle, TransportRequest, Dispatch } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { collection, addDoc, query, orderBy, onSnapshot, Query, Unsubscribe, Firestore } from 'firebase/firestore';

export const vehicles: Vehicle[] = [];

// In-memory cache for requests (will be synced with Firestore)
let cachedRequests: TransportRequest[] = [];
let unsubscribe: Unsubscribe | null = null;
let firestoreDb: Firestore | null = null;

export const requests = cachedRequests;

/**
 * Initialize Firestore database instance (called from a hook)
 */
export function setFirestoreDb(db: Firestore | null) {
  firestoreDb = db;
}

/**
 * Initialize real-time listener for requests from Firestore
 * Should be called once when Firestore is available
 */
export function initializeRequestsListener() {
  if (!firestoreDb || unsubscribe) return; // Already initialized or Firestore unavailable
  
  try {
    const requestsRef = collection(firestoreDb, 'transportRequests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));
    
    unsubscribe = onSnapshot(q, (snapshot) => {
      cachedRequests = snapshot.docs.map(doc => ({
        ...doc.data() as TransportRequest,
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
      }));
      // Update the exported requests array reference
      Object.assign(requests, cachedRequests);
    });
  } catch (error) {
    console.warn('Failed to initialize requests listener:', error);
  }
}

/**
 * Stop listening to Firestore updates
 */
export function stopRequestsListener() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
}

/**
 * Add a new transport request to Firestore
 */
export async function addRequest(
  req: Omit<TransportRequest, 'id' | 'status' | 'createdAt'>
): Promise<TransportRequest> {
  if (!firestoreDb) {
    console.error('❌ CRITICAL: Firestore is not initialized! Request will be lost:', req);
    throw new Error('Firestore is not initialized. Please refresh the page and try again.');
  }

  try {
    console.log('📝 Attempting to save request to Firestore:', req);
    const requestsRef = collection(firestoreDb, 'transportRequests');
    const docRef = await addDoc(requestsRef, {
      ...req,
      status: 'pending',
      createdAt: new Date(),
    });

    const newRequest: TransportRequest = {
      ...req,
      id: docRef.id,
      status: 'pending',
      createdAt: new Date(),
    };

    console.log('✅ Request successfully saved with ID:', docRef.id);
    return newRequest;
  } catch (error) {
    console.error('❌ Error adding request to Firestore:', error);
    throw error;
  }
}

export const dispatches: Dispatch[] = [];
