
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Car, Building } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { TrainArrivalChatbot } from '@/components/train-arrival-chatbot';
import { RequestChatbot } from '@/components/request-chatbot';

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
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-spiritual-purple">Transport Request Portal</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Please select the appropriate form to register your vehicle or request transport for the Samagam.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/indoor-request" className="group">
            <Card className="shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Building className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl">Indoor Vehicle Request</CardTitle>
                    <CardDescription>For internal department use.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">Submit a request for local transport needed by a department within the Samagam site (e.g., Guest Services, Construction).</p>
              </CardContent>
              <div className="p-6 pt-0">
                 <div className="flex items-center font-semibold text-primary">
                    Go to Form <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/outdoor-request" className="group">
            <Card className="shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col rounded-2xl">
               <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg text-accent">
                    <Car className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl">Outdoor Vehicle Request</CardTitle>
                    <CardDescription>For Branch/Zone vehicles.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">Register private vehicles, buses, or train itineraries for devotees arriving from outside branches or zones for the Samagam.</p>
              </CardContent>
               <div className="p-6 pt-0">
                 <div className="flex items-center font-semibold text-accent">
                    Go to Form <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
      Vehicle Request Chatbot with Marathi auto-popup */}
      <RequestChatbot requestType="indoor" autoPopup={true} />
      
      {/* 
      {/* Train Arrival Chatbot */}
      <TrainArrivalChatbot />
    </main>
  );
}
