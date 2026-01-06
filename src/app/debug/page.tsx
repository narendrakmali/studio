'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export default function DebugPage() {
  const envVars = {
    'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID': process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const allPresent = Object.values(envVars).every(val => !!val);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allPresent ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            Firebase Environment Variables Debug
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">Current Status:</p>
              <Badge variant={allPresent ? "default" : "destructive"} className={allPresent ? "bg-green-500" : ""}>
                {allPresent ? "All environment variables loaded ✓" : "Missing environment variables ✗"}
              </Badge>
            </div>

            <div className="space-y-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <span className="font-mono text-sm">{key}</span>
                  <div className="flex items-center gap-2">
                    {value ? (
                      <>
                        <span className="font-mono text-xs text-muted-foreground max-w-xs truncate">
                          {value.substring(0, 20)}...
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-destructive">Not set</span>
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!allPresent && (
              <div className="rounded-lg bg-destructive/10 p-4 mt-4">
                <p className="text-sm font-medium text-destructive mb-2">
                  ⚠️ Action Required:
                </p>
                <p className="text-sm text-muted-foreground">
                  Environment variables are missing. Please configure them in your Vercel project settings:
                </p>
                <ol className="list-decimal list-inside mt-2 text-sm text-muted-foreground space-y-1">
                  <li>Go to your Vercel dashboard</li>
                  <li>Select this project</li>
                  <li>Navigate to Settings → Environment Variables</li>
                  <li>Add all missing variables</li>
                  <li>Redeploy the application</li>
                </ol>
              </div>
            )}

            <div className="rounded-lg border p-4 mt-4">
              <p className="text-sm font-medium mb-2">Environment Info:</p>
              <div className="space-y-1 text-sm text-muted-foreground font-mono">
                <p>NODE_ENV: {process.env.NODE_ENV}</p>
                <p>Build Time: {new Date().toISOString()}</p>
                <p>URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
