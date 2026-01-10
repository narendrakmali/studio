'use client';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import type { FirebaseApp } from 'firebase/app';

let dataConnectInstance: ReturnType<typeof getDataConnect> | null = null;

export function initializeDataConnect(app: FirebaseApp | null) {
  // Never initialize on server
  if (typeof window === 'undefined' || !app) {
    return null;
  }

  if (!dataConnectInstance) {
    try {
      dataConnectInstance = getDataConnect(app, connectorConfig);
      
      // Connect to emulator in development
      if (process.env.NODE_ENV === 'development') {
        const host = window.location.hostname || '127.0.0.1';
        console.log(`🔌 Connecting to Data Connect emulator on ${host}:9399`);
        connectDataConnectEmulator(dataConnectInstance, host, 9399);
      }
      
      console.log('✓ Data Connect initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Data Connect:', error);
      return null;
    }
  }

  return dataConnectInstance;
}

export function getDataConnectInstance() {
  return dataConnectInstance;
}
