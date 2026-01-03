
"use client";

import { useState, useEffect } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { requests as allRequests } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Users, Route, Calendar, Hash, User, Phone, Car, PlusCircle, Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link";
import { format } from "date-fns";
import type { TransportRequest } from "@/lib/types";

export default function RequestsPage() {
    const [currentRequests, setCurrentRequests] = useState(allRequests);

    useEffect(() => {
        const interval = setInterval(() => {
            if (allRequests.length !== currentRequests.length) {
                setCurrentRequests([...allRequests]);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [currentRequests.length]);

    const indoorRequests = currentRequests.filter(r => r.source === 'indoor');
    const outdoorRequests = currentRequests.filter(r => r.source === 'outdoor');
    
    const RequestSection = ({ title, requests, icon: Icon }: { title: string, requests: TransportRequest[], icon: React.ElementType }) => (
        <section className="space-y-4">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                <Icon className="h-6 w-6 text-primary" />
                {title}
            </h2>
            {requests.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {requests.map((req) => (
                        <Card key={req.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="font-headline text-lg">{req.departmentName}</CardTitle>
                                        <CardDescription>Request ID: {req.id}</CardDescription>
                                    </div>
                                    <Badge variant={req.status === 'pending' ? 'default' : 'secondary'} className={req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700' : ''}>
                                        {req.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>By: <strong>{req.userName}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>Contact: <strong>{req.contactNumber}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                    <span className="capitalize">Mode: <strong>{req.requestType === 'private' ? req.vehicleType : req.requestType}</strong></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>Passengers: <strong>{req.passengerCount || req.trainDevoteeCount}</strong></span>
                                </div>
                                {(req.durationFrom || req.trainArrivalDate) && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{format(new Date(req.durationFrom || req.trainArrivalDate!), 'dd/MM/yy')} - {(req.durationTo || req.returnTrainDepartureDate) && format(new Date(req.durationTo || req.returnTrainDepartureDate!), 'dd/MM/yy')}</span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                {req.hodApprovalImage && <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">Approval</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>HOD Approval for Request {req.id}</DialogTitle>
                                            <DialogDescription>
                                                Approval image submitted by {req.departmentName}.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="mt-4">
                                            <Image src={req.hodApprovalImage} alt={`Approval for ${req.id}`} width={400} height={500} className="rounded-md object-contain w-full" data-ai-hint="document paper" />
                                        </div>
                                    </DialogContent>
                                </Dialog>}
                                {req.status === 'pending' && req.source === 'indoor' && (
                                    <Button size="sm" asChild className="ml-auto">
                                        <Link href="/dispatch">Allocate Vehicle</Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="flex items-center justify-center p-12 bg-muted/50 border-dashed">
                    <p className="text-muted-foreground">No {title.toLowerCase()} found.</p>
                </Card>
            )}
        </section>
    );

    return (
        <AuthLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-headline">All Requests</h1>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/outdoor-request">
                            <Globe className="mr-2 h-4 w-4" />
                            New Outdoor Request
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/indoor-request">
                            <Building className="mr-2 h-4 w-4" />
                            New Indoor Request
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="space-y-8">
                <RequestSection title="Indoor Branch Requirements" requests={indoorRequests} icon={Building} />
                <RequestSection title="Outdoor Vehicle Registrations" requests={outdoorRequests} icon={Globe} />
            </div>
        </AuthLayout>
    )
}
