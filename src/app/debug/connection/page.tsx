'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface DiagnosticsResponse {
  timestamp: string;
  status: 'testing' | 'connected' | 'disconnected' | 'error';
  backend: {
    connected: boolean;
    dataConnect: {
      configured: boolean;
      emulatorUrl: string | null;
      error: string | null;
    };
    firebase: {
      configured: boolean;
      error: string | null;
    };
  };
  frontend: {
    environment: {
      nodeEnv: string;
      firebaseApiKey: boolean;
      firebaseProjectId: boolean;
    };
  };
  error?: string;
}

interface TestResponse {
  timestamp: string;
  tests: {
    dataConnectSDK: { passed: boolean; error: string | null };
    firebaseConfig: { passed: boolean; error: string | null };
    schemaAccess: { passed: boolean; error: string | null };
  };
  summary: {
    passed: number;
    failed: number;
    totalTests: number;
  };
  error?: string;
}

export default function TestConnectionPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResponse | null>(null);
  const [testResults, setTestResults] = useState<TestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      setDiagnostics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    setTestLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-connection', { method: 'POST' });
      const data = await response.json();
      setTestResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run tests');
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔌 API Connection Test
          </h1>
          <p className="text-gray-600">
            Verify frontend-to-backend connectivity
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Diagnostics Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Backend Diagnostics</CardTitle>
              <CardDescription>System configuration status</CardDescription>
            </div>
            <Button onClick={runDiagnostics} disabled={loading} size="sm">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Refresh'
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {diagnostics ? (
              <>
                {/* Overall Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Overall Status</span>
                  <div className="flex items-center gap-2">
                    {diagnostics.status === 'connected' ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-green-600 font-semibold">
                          Connected
                        </span>
                      </>
                    ) : diagnostics.status === 'disconnected' ? (
                      <>
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-red-600 font-semibold">
                          Disconnected
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="text-yellow-600 font-semibold">
                          {diagnostics.status}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Firebase Configuration */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Firebase Configuration</h3>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <div className="flex items-center gap-2">
                      {diagnostics.backend.firebase.configured ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span>
                        {diagnostics.backend.firebase.configured
                          ? 'Firebase configured'
                          : 'Firebase not configured'}
                      </span>
                    </div>
                    {diagnostics.backend.firebase.error && (
                      <p className="text-xs text-red-600 mt-2">
                        {diagnostics.backend.firebase.error}
                      </p>
                    )}
                  </div>
                </div>

                {/* Data Connect Configuration */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Data Connect Configuration</h3>
                  <div className="bg-purple-50 p-3 rounded border border-purple-200">
                    <div className="flex items-center gap-2">
                      {diagnostics.backend.dataConnect.configured ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span>
                        {diagnostics.backend.dataConnect.configured
                          ? 'Data Connect SDK available'
                          : 'Data Connect SDK unavailable'}
                      </span>
                    </div>
                    {diagnostics.backend.dataConnect.emulatorUrl && (
                      <p className="text-xs text-purple-600 mt-2">
                        Emulator: {diagnostics.backend.dataConnect.emulatorUrl}
                      </p>
                    )}
                    {diagnostics.backend.dataConnect.error && (
                      <p className="text-xs text-red-600 mt-2">
                        {diagnostics.backend.dataConnect.error}
                      </p>
                    )}
                  </div>
                </div>

                {/* Frontend Environment */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Frontend Environment</h3>
                  <div className="bg-green-50 p-3 rounded border border-green-200 space-y-1 text-xs">
                    <p>
                      Node Env:{' '}
                      <span className="font-mono">
                        {diagnostics.frontend.environment.nodeEnv}
                      </span>
                    </p>
                    <p>
                      API Key:{' '}
                      {diagnostics.frontend.environment.firebaseApiKey ? (
                        <CheckCircle2 className="inline h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="inline h-3 w-3 text-red-600" />
                      )}
                    </p>
                    <p>
                      Project ID:{' '}
                      {diagnostics.frontend.environment.firebaseProjectId ? (
                        <CheckCircle2 className="inline h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="inline h-3 w-3 text-red-600" />
                      )}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Last updated: {new Date(diagnostics.timestamp).toLocaleTimeString()}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Loading diagnostics...</p>
            )}
          </CardContent>
        </Card>

        {/* Connection Tests Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Connection Tests</CardTitle>
              <CardDescription>Verify system components</CardDescription>
            </div>
            <Button onClick={runTests} disabled={testLoading} size="sm">
              {testLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                'Run Tests'
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {testResults ? (
              <>
                {/* Test Summary */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600">Passed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {testResults.summary.passed}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600">Failed</p>
                      <p className="text-2xl font-bold text-red-600">
                        {testResults.summary.failed}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {testResults.summary.totalTests}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Individual Tests */}
                <div className="space-y-3">
                  {Object.entries(testResults.tests).map(([testName, result]) => (
                    <div key={testName} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {result.passed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-semibold capitalize">
                            {testName.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <span className={result.passed ? 'text-green-600 text-sm font-semibold' : 'text-red-600 text-sm font-semibold'}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      {result.error && (
                        <p className="text-xs text-red-600 mt-2">{result.error}</p>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Tested: {new Date(testResults.timestamp).toLocaleTimeString()}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Click "Run Tests" to test connectivity</p>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">📋 Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>1. Start Data Connect Emulator:</strong>
            </p>
            <p className="font-mono bg-white p-2 rounded text-xs overflow-x-auto">
              firebase emulators:start --only dataconnect
            </p>
            <p>
              <strong>2. Start Next.js Dev Server:</strong>
            </p>
            <p className="font-mono bg-white p-2 rounded text-xs overflow-x-auto">
              npm run dev
            </p>
            <p>
              <strong>3. Verify Environment Variables:</strong>
            </p>
            <p className="text-xs text-gray-700">
              Check .env.local for NEXT_PUBLIC_FIREBASE_* variables
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
