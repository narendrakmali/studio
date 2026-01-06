import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    hasStorageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    hasMessagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    hasMeasurementId: !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    // Don't expose actual values, just check if they're set
    apiKeyPrefix: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) || 'MISSING',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING',
    nodeEnv: process.env.NODE_ENV,
  });
}
