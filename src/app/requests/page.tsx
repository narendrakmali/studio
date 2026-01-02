
"use client";

import { AuthLayout } from "@/components/auth-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { requests } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Users, Route, Calendar, Hash, User, Phone, Car } from "lucide-react";
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


export default function RequestsPage() {
    return (
        <AuthLayout>
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
                                <span>Requested by: <strong>{req.userName}</strong></span>
                            </div>
                             <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>Contact: <strong>{req.contactNumber}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">Vehicle: <strong>{req.vehicleType}</strong></span>
                            </div>
                             <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>Passengers: <strong>{req.passengerCount}</strong></span>
                            </div>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(req.durationFrom), 'dd/MM/yy')} - {format(new Date(req.durationTo), 'dd/MM/yy')}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {req.hodApprovalImage && <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">View Approval</Button>
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
                            <Button size="sm" asChild>
                                <Link href="/dispatch">Allocate Vehicle</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
             </div>
        </AuthLayout>
    )
}
