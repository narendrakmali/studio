import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from './config';

/**
 * Server-side Data Connect initialization
 * This ensures the emulator is connected in development mode
 */
export function getServerDataConnect() {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const dc = getDataConnect(app, connectorConfig);

    // Connect to emulator in development
    if (process.env.NODE_ENV === 'development') {
      const host = process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST || '127.0.0.1';
      // In server-side (Next.js API routes), we use 127.0.0.1 
      // because it's running in the same container as the emulator usually
      connectDataConnectEmulator(dc, host, 9399);
    }

    return dc;
  } catch (error) {
    console.error('Failed to initialize server-side Data Connect:', error);
    return null;
  }
}
