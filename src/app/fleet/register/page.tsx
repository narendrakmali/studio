
"use client"

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, FileImage, Gauge, ArrowLeft, User, Phone, Home } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function RegisterVehiclePage() {
  return (
    <AuthLayout>
      <div className="flex justify-center">
        <Card className="w-full max-w-3xl shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="font-headline text-3xl">Register New Vehicle</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/fleet">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Fleet
                        </Link>
                    </Button>
                </div>
                <CardDescription>
                Fill in the details below to add a new vehicle to the fleet.
                </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="license">License Plate</Label>
                        <Input id="license" placeholder="XX-00-XX-0000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="make">Make & Model</Label>
                        <Input id="make" placeholder="e.g. Toyota Innova" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" type="number" placeholder="e.g. 7" />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label className="font-medium">Owner Details</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ownerName">Owner Name</Label>
                         <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="ownerName" placeholder="e.g. Samagam Services" className="pl-9" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ownerContact">Contact Number</Label>
                         <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="ownerContact" placeholder="e.g. 9988776655" className="pl-9" />
                        </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="ownerAddress">Address</Label>
                       <div className="relative">
                          <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea id="ownerAddress" placeholder="Enter owner's full address" className="pl-9" />
                      </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4">
                    <Label className="font-medium">Vehicle Images</Label>
                    <div className="grid gap-4 rounded-md border p-4">
                        <div className="flex items-center gap-4">
                            <Car className="h-6 w-6 text-muted-foreground"/>
                            <Label htmlFor="img-front" className="flex-1 text-sm font-normal">Front View</Label>
                            <Input id="img-front" type="file" className="w-auto"/>
                        </div>
                        <div className="flex items-center gap-4">
                            <FileImage className="h-6 w-6 text-muted-foreground"/>
                            <Label htmlFor="img-side" className="flex-1 text-sm font-normal">Side View</Label>
                            <Input id="img-side" type="file" className="w-auto"/>
                        </div>
                        <div className="flex items-center gap-4">
                            <Gauge className="h-6 w-6 text-muted-foreground"/>
                            <Label htmlFor="img-odo" className="flex-1 text-sm font-normal">Odometer</Label>
                            <Input id="img-odo" type="file" className="w-auto"/>
                        </div>
                    </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Save Vehicle</Button>
            </CardFooter>
        </Card>
      </div>
    </AuthLayout>
  );
}
