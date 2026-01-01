import { AuthLayout } from "@/components/auth-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { requests } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Users, Route, Calendar, Hash } from "lucide-react";
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


export default function RequestsPage() {
    return (
        <AuthLayout>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                <Route className="h-4 w-4 text-muted-foreground" />
                                <span>To: <strong>{req.destination}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span><strong>{req.passengerCount}</strong> Passengers</span>
                            </div>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(req.createdAt).toLocaleString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Dialog>
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
                            </Dialog>
                            <Button size="sm">Allocate Vehicle</Button>
                        </CardFooter>
                    </Card>
                ))}
             </div>
        </AuthLayout>
    )
}
