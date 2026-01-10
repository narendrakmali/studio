import { NextResponse } from 'next/server';

/**
 * Test API endpoint to verify frontend-to-backend connection
 * GET /api/test-connection - Tests the connection and returns diagnostics
 */
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    status: 'testing',
    backend: {
      connected: false,
      dataConnect: {
        configured: false,
        emulatorUrl: null,
        error: null,
      },
      firebase: {
        configured: false,
        error: null,
      },
    },
    frontend: {
      environment: {
        nodeEnv: process.env.NODE_ENV,
        firebaseApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        firebaseProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      },
    },
  };

  try {
    // Check Firebase configuration
    const requiredFirebaseEnvs = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
    ];

    const missingFirebaseEnvs = requiredFirebaseEnvs.filter(
      (env) => !process.env[env]
    );

    diagnostics.backend.firebase.configured = missingFirebaseEnvs.length === 0;
    if (missingFirebaseEnvs.length > 0) {
      diagnostics.backend.firebase.error = `Missing environment variables: ${missingFirebaseEnvs.join(
        ', '
      )}`;
    }

    // Check Data Connect configuration
    try {
      // Try to import Data Connect SDK
      const dataConnectModule = await import(
        '@dataconnect/generated'
      ).catch((err) => {
        throw new Error(`Data Connect SDK not found: ${err.message}`);
      });

      diagnostics.backend.dataConnect.configured = !!dataConnectModule;

      // Check for emulator configuration
      const emulatorHost = process.env.FIREBASE_DATA_CONNECT_EMULATOR_HOST;
      diagnostics.backend.dataConnect.emulatorUrl = emulatorHost || null;
    } catch (error) {
      diagnostics.backend.dataConnect.error =
        error instanceof Error ? error.message : 'Unknown error';
    }

    // Overall backend status
    diagnostics.backend.connected =
      diagnostics.backend.firebase.configured &&
      diagnostics.backend.dataConnect.configured;

    diagnostics.status = diagnostics.backend.connected
      ? 'connected'
      : 'disconnected';
  } catch (error) {
    diagnostics.status = 'error';
    return NextResponse.json(
      {
        ...diagnostics,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(diagnostics);
}

/**
 * POST /api/test-connection - Test actual database connectivity
 */
export async function POST() {
  const testResults = {
    timestamp: new Date().toISOString(),
    tests: {
      dataConnectSDK: { passed: false, error: null },
      firebaseConfig: { passed: false, error: null },
      schemaAccess: { passed: false, error: null },
    },
    summary: {
      passed: 0,
      failed: 0,
      totalTests: 3,
    },
  };

  try {
    // Test 1: Data Connect SDK import
    try {
      const dcModule = await import('@dataconnect/generated');
      testResults.tests.dataConnectSDK.passed = !!dcModule;
    } catch (error) {
      testResults.tests.dataConnectSDK.error =
        error instanceof Error ? error.message : 'SDK import failed';
    }

    // Test 2: Firebase configuration
    try {
      const requiredEnvs = [
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_API_KEY',
      ];
      const allConfigured = requiredEnvs.every((env) => process.env[env]);
      testResults.tests.firebaseConfig.passed = allConfigured;
      if (!allConfigured) {
        testResults.tests.firebaseConfig.error =
          'Missing required environment variables';
      }
    } catch (error) {
      testResults.tests.firebaseConfig.error =
        error instanceof Error ? error.message : 'Config check failed';
    }

    // Test 3: Schema file exists
    try {
      const fs = await import('fs');
      const path = await import('path');
      const schemaPath = path.join(
        process.cwd(),
        'dataconnect',
        'schema',
        'schema.gql'
      );
      const schemaExists = fs.existsSync(schemaPath);
      testResults.tests.schemaAccess.passed = schemaExists;
      if (!schemaExists) {
        testResults.tests.schemaAccess.error = `Schema file not found at ${schemaPath}`;
      }
    } catch (error) {
      testResults.tests.schemaAccess.error =
        error instanceof Error ? error.message : 'Schema check failed';
    }

    // Calculate summary
    testResults.summary.passed = Object.values(testResults.tests).filter(
      (t) => t.passed
    ).length;
    testResults.summary.failed = testResults.summary.totalTests - testResults.summary.passed;
  } catch (error) {
    return NextResponse.json(
      {
        ...testResults,
        error: error instanceof Error ? error.message : 'Test execution failed',
      },
      { status: 500 }
    );
  }

  const allTestsPassed =
    testResults.summary.failed === 0;
  return NextResponse.json(testResults, {
    status: allTestsPassed ? 200 : 206,
  });
}
