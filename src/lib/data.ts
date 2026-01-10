
'use client';

import type { Vehicle, TransportRequest, Dispatch } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const vehicles: Vehicle[] = [];

// In-memory cache for requests (will be synced with Data Connect)
let cachedRequests: TransportRequest[] = [];

export const requests = cachedRequests;

/**
 * NOTE: Data Connect replaces Firestore entirely.
 * Use the generated SDK from @dataconnect/generated for all database operations.
 * 
 * Example usage:
 * import { listTransportRequests, createTransportRequest } from '@dataconnect/generated';
 * 
 * // Create a request
 * await createTransportRequest({
 *   passengerName: "John Doe",
 *   department: "Engineering",
 *   // ... other fields
 * });
 * 
 * // List requests
 * const { data } = await listTransportRequests();
 * 
 * For real-time updates, use Data Connect live queries or polling.
 */

/**
 * Add a new transport request using Data Connect
 * This is a wrapper function - actual implementation should use the generated SDK
 */
export async function addRequest(
  req: Omit<TransportRequest, 'id' | 'status' | 'createdAt'>
): Promise<TransportRequest> {
  // This function should be implemented using the Data Connect SDK after generation
  // Example:
  // import { createTransportRequest } from '@dataconnect/generated';
  // const result = await createTransportRequest({
  //   passengerName: req.passengerName,
  //   department: req.department,
  //   ... other fields
  // });
  
  console.warn('⚠️ addRequest: Please use Data Connect SDK directly instead of this wrapper');
  throw new Error('Please regenerate Data Connect SDK and use createTransportRequest mutation directly');
}

export const dispatches: Dispatch[] = [];

// Placeholder functions for backward compatibility
export function initializeRequestsListener() {
  console.warn('⚠️ initializeRequestsListener: Use Data Connect SDK directly');
}

export function stopRequestsListener() {
  console.warn('⚠️ stopRequestsListener: Use Data Connect SDK directly');
}

