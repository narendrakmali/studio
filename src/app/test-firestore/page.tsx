"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addRequest, setFirestoreDb, initializeRequestsListener } from "@/lib/data";
import { useFirebase } from "@/firebase/provider";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function TestFirestorePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  
  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const addResult = (testName: string, passed: boolean) => {
    setTestResults(prev => ({ ...prev, [testName]: passed }));
  };

  // Test 1: Check Firebase Context
  const testFirebaseContext = async () => {
    addLog("🧪 TEST 1: Checking Firebase Context...");
    try {
      const { firebaseApp, firestore, auth } = useFirebase();
      if (firebaseApp && firestore && auth) {
        addLog("✅ Firebase services available");
        addLog(`  - Firebase App: ${firebaseApp.name}`);
        addLog(`  - Project ID: ${firebaseApp.options.projectId}`);
        addLog(`  - Firestore instance: ${firestore ? 'Available' : 'Missing'}`);
        addResult("Firebase Context", true);
        return { firestore };
      } else {
        addLog("❌ Firebase services NOT available");
        addResult("Firebase Context", false);
        return { firestore: null };
      }
    } catch (error) {
      addLog(`❌ Error accessing Firebase: ${(error as Error).message}`);
      addResult("Firebase Context", false);
      return { firestore: null };
    }
  };

  // Test 2: Check Environment Variables
  const testEnvironmentVariables = () => {
    addLog("🧪 TEST 2: Checking Environment Variables...");
    const vars = {
      'API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      'AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      'PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      'STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      'MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      'APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    let allPresent = true;
    Object.entries(vars).forEach(([key, value]) => {
      if (value) {
        addLog(`✅ ${key}: ${value.substring(0, 20)}...`);
      } else {
        addLog(`❌ ${key}: MISSING`);
        allPresent = false;
      }
    });
    
    addResult("Environment Variables", allPresent);
    return allPresent;
  };

  // Test 3: Direct Firestore Write
  const testDirectFirestoreWrite = async (firestore: any) => {
    addLog("🧪 TEST 3: Testing Direct Firestore Write...");
    if (!firestore) {
      addLog("❌ Firestore not available for direct write test");
      addResult("Direct Firestore Write", false);
      return;
    }

    try {
      const testData = {
        testField: "Direct write test",
        timestamp: new Date(),
        testId: Math.random().toString(36).substring(7),
      };
      
      addLog(`📝 Writing test document: ${JSON.stringify(testData)}`);
      const docRef = await addDoc(collection(firestore, 'transportRequests'), testData);
      addLog(`✅ Direct write successful! Document ID: ${docRef.id}`);
      addResult("Direct Firestore Write", true);
      return docRef.id;
    } catch (error) {
      addLog(`❌ Direct write failed: ${(error as Error).message}`);
      addLog(`   Error code: ${(error as any).code}`);
      addLog(`   Full error: ${JSON.stringify(error)}`);
      addResult("Direct Firestore Write", false);
      return null;
    }
  };

  // Test 4: Write via addRequest function
  const testAddRequestFunction = async () => {
    addLog("🧪 TEST 4: Testing addRequest() function...");
    
    try {
      const testRequest = {
        userName: "Test User",
        contactNumber: "9999999999",
        departmentName: "Test Department",
        vehicleTypePassenger: "electric-cart" as const,
        passengerCount: 1,
        specialCategory: "none" as const,
        groundNumber: "1" as const,
        durationFrom: new Date(),
        durationTo: new Date(),
        source: "indoor" as const,
        requestType: "private" as const,
      };
      
      addLog(`📝 Calling addRequest with: ${JSON.stringify({ ...testRequest, durationFrom: 'Date', durationTo: 'Date' })}`);
      const result = await addRequest(testRequest);
      addLog(`✅ addRequest successful! Document ID: ${result.id}`);
      addResult("addRequest Function", true);
      return result.id;
    } catch (error) {
      addLog(`❌ addRequest failed: ${(error as Error).message}`);
      addLog(`   Error stack: ${(error as Error).stack}`);
      addResult("addRequest Function", false);
      return null;
    }
  };

  // Test 5: Read from Firestore
  const testFirestoreRead = async (firestore: any) => {
    addLog("🧪 TEST 5: Testing Firestore Read...");
    if (!firestore) {
      addLog("❌ Firestore not available for read test");
      addResult("Firestore Read", false);
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(firestore, 'transportRequests'));
      addLog(`✅ Read successful! Found ${querySnapshot.size} documents`);
      
      if (querySnapshot.size > 0) {
        addLog("📄 Sample documents:");
        querySnapshot.docs.slice(0, 3).forEach(doc => {
          addLog(`  - ID: ${doc.id}`);
          addLog(`    Data: ${JSON.stringify(doc.data()).substring(0, 100)}...`);
        });
      }
      
      addResult("Firestore Read", true);
    } catch (error) {
      addLog(`❌ Read failed: ${(error as Error).message}`);
      addResult("Firestore Read", false);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setLogs([]);
    setTestResults({});
    
    addLog("🚀 Starting Firestore Diagnostic Tests...");
    addLog("=" .repeat(60));
    
    // Test 1: Environment Variables
    testEnvironmentVariables();
    
    // Wait a bit for logs to render
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 2: Firebase Context
    let firestore = null;
    try {
      const result = await testFirebaseContext();
      firestore = result.firestore;
    } catch (error) {
      addLog(`❌ Could not access Firebase context: ${(error as Error).message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 3: Direct Firestore Write
    if (firestore) {
      await testDirectFirestoreWrite(firestore);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Test 4: addRequest Function
    await testAddRequestFunction();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test 5: Firestore Read
    if (firestore) {
      await testFirestoreRead(firestore);
    }
    
    addLog("=" .repeat(60));
    addLog("🏁 All tests completed!");
  };

  // Initialize Firestore DB on mount
  useEffect(() => {
    try {
      const { firestore } = useFirebase();
      if (firestore) {
        setFirestoreDb(firestore);
        addLog("✅ Firestore DB initialized in data.ts");
      }
    } catch (error) {
      addLog(`⚠️ Could not initialize Firestore: ${(error as Error).message}`);
    }
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>🔬 Firestore Diagnostic Tool</CardTitle>
          <CardDescription>
            This page tests every step of the data capture process to identify where requests are failing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runAllTests} size="lg" className="w-full">
            Run All Diagnostic Tests
          </Button>

          {Object.keys(testResults).length > 0 && (
            <div className="border rounded p-4 bg-gray-50">
              <h3 className="font-bold mb-2">Test Results:</h3>
              {Object.entries(testResults).map(([testName, passed]) => (
                <div key={testName} className="flex items-center gap-2">
                  <span className="text-2xl">{passed ? "✅" : "❌"}</span>
                  <span>{testName}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border rounded p-4 bg-black text-green-400 font-mono text-xs max-h-96 overflow-y-auto">
            <div className="font-bold mb-2">Console Output:</div>
            {logs.length === 0 ? (
              <div className="text-gray-500">Click "Run All Diagnostic Tests" to start...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap break-all">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
