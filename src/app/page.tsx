
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Car } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { UnifiedTransportChatbot } from '@/components/unified-transport-chatbot';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <header className="absolute top-0 left-0 right-0 p-4 bg-transparent">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="w-8 h-8 hidden sm:flex" />
              <h1 className="text-xl text-center sm:text-left font-headline font-bold text-primary">Transport Coordination Portal</h1>
            </Link>
            <Button asChild variant="outline" className="bg-background/80 backdrop-blur-sm w-full sm:w-auto">
                <Link href="/login">Team Login</Link>
            </Button>
        </div>
    </header>
      <div className="w-full max-w-4xl pt-24 sm:pt-0">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Transport Request Portal</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Register your travel for the Samagam and share your arrival details with the transport team.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          <Link href="/outdoor-request" className="group">
            <Card className="shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col rounded-2xl border-2 border-teal-100 hover:border-teal-300 bg-gradient-to-br from-teal-50 to-white">
               <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-500 rounded-lg text-white shadow-md">
                    <Car className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl text-teal-900">Travel and Arrival Request for Samagam</CardTitle>
                    <CardDescription className="text-teal-600">From different parts of India</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-slate-600">Register private vehicles, buses, or train itineraries for devotees traveling from branches or zones to attend the Samagam.</p>
              </CardContent>
               <div className="p-6 pt-0">
                 <div className="flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                    Request Travel <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
      
      {/* Unified Transport Chatbot */}
      <UnifiedTransportChatbot />
    </main>
  );
}
