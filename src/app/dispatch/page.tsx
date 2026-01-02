
"use client"

import { AuthLayout } from "@/components/auth-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { requests, vehicles as allVehicles } from "@/lib/data";
import { TransportRequest, Vehicle } from "@/lib/types";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Users, Route, Calendar, Sparkles, Car, User, Fingerprint, Camera, Loader2, Phone, Building, CalendarIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { optimizeVehicleAllocation, OptimizeVehicleAllocationInput } from "@/ai/flows/optimize-vehicle-allocation";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function DispatchPage() {
    const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(requests.find(r => r.status === 'pending') || null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [suggestedVehicleId, setSuggestedVehicleId] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const { toast } = useToast();

    // State for editable dispatch details
    const [department, setDepartment] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleType, setVehicleType] = useState<TransportRequest['vehicleType'] | ''>('');
    const [allocationDate, setAllocationDate] = useState<Date | undefined>(undefined);
    const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);


    useEffect(() => {
        if (selectedRequest && selectedVehicle) {
            setDepartment(selectedRequest.departmentName);
            setVehicleModel(`${selectedVehicle.make} ${selectedVehicle.model}`);
            setVehicleType(selectedRequest.vehicleType);
            setAllocationDate(new Date(selectedRequest.durationFrom));
            setReturnDate(new Date(selectedRequest.durationTo));
        }
    }, [selectedRequest, selectedVehicle]);


    const availableVehicles = allVehicles.filter(v => v.status === 'available');

    const handleSuggestion = async () => {
        if (!selectedRequest || !selectedRequest.destination || !selectedRequest.passengerCount) {
             toast({ variant: "destructive", title: "Cannot Suggest", description: "Request is missing destination or passenger count for AI suggestion." });
            return;
        };
        setIsSuggesting(true);
        setSuggestedVehicleId(null);
        try {
            const input: OptimizeVehicleAllocationInput = {
                requestDetails: {
                    destination: selectedRequest.destination,
                    passengerCount: selectedRequest.passengerCount,
                    departmentName: selectedRequest.departmentName,
                },
                vehicleAvailability: availableVehicles.map(v => ({
                    vehicleId: v.id,
                    location: v.location,
                    capacity: v.capacity,
                    lastTripDestination: v.lastTripDestination
                })),
                tripHistory: [], // Can be populated from dispatches
            };
            const result = await optimizeVehicleAllocation(input);
            setSuggestedVehicleId(result.vehicleId);
            toast({
                title: "AI Suggestion Ready",
                description: `Vehicle ${result.vehicleId} is recommended. Reason: ${result.reason}`,
            });
        } catch (error) {
            console.error("AI suggestion failed:", error);
            toast({ variant: "destructive", title: "AI Suggestion Failed", description: "Could not get an AI suggestion at this time." });
        } finally {
            setIsSuggesting(false);
        }
    };
    
  return (
    <AuthLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
        <Card className="lg:col-span-1 shadow-md flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                    {requests.filter(r => r.status === 'pending').map(req => (
                        <Card 
                            key={req.id} 
                            className={cn("cursor-pointer hover:border-primary transition-colors", selectedRequest?.id === req.id && "border-primary ring-2 ring-primary")}
                            onClick={() => {
                                setSelectedRequest(req);
                                setSelectedVehicle(null);
                                setSuggestedVehicleId(null);
                            }}
                        >
                            <CardHeader className="p-4">
                                <CardTitle className="text-base">{req.departmentName}</CardTitle>
                                <CardDescription>
                                  <div className="flex items-center gap-1"><User className="h-4 w-4" /> {req.userName}</div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-1 capitalize"><Car className="h-4 w-4" /> {req.vehicleType}</div>
                                <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(req.createdAt), 'dd/MM/yyyy')}</div>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="shadow-md flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Allocation</CardTitle>
                    <CardDescription>Match request to an available vehicle.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                    <ScrollArea className="h-full">
                         <div className="p-4 space-y-2">
                         {availableVehicles.map(v => (
                            <Card 
                                key={v.id} 
                                className={cn("cursor-pointer transition-all", 
                                    selectedVehicle?.id === v.id && "border-primary ring-2 ring-primary",
                                    suggestedVehicleId === v.id && "border-accent ring-2 ring-accent"
                                )}
                                onClick={() => setSelectedVehicle(v)}
                            >
                                <div className="p-3 flex gap-4 items-center">
                                    <Image src={v.images.front} alt={v.model} width={80} height={60} className="rounded-md aspect-[4/3] object-cover" data-ai-hint="white van" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{v.make} {v.model}</p>
                                        <p className="text-sm text-muted-foreground">{v.licensePlate}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline">Cap: {v.capacity}</Badge>
                                        {suggestedVehicleId === v.id && <Badge variant="secondary" className="mt-1 bg-accent/20 text-accent-foreground border-accent">Suggested</Badge>}
                                    </div>
                                </div>
                            </Card>
                         ))}
                         </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSuggestion} disabled={!selectedRequest || isSuggesting || !selectedRequest.passengerCount} className="w-full">
                        {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                        Get AI Suggestion
                    </Button>
                </CardFooter>
            </Card>

            <Card className="shadow-md flex flex-col">
                 <CardHeader>
                    <CardTitle className="font-headline text-xl">Dispatch Details</CardTitle>
                    <CardDescription>Finalize and dispatch the vehicle.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    {selectedRequest && selectedVehicle ? (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="departmentName">Department</Label>
                                    <Input id="departmentName" value={department} onChange={e => setDepartment(e.target.value)} />
                                </div>
                                 <div className="space-y-1">
                                    <Label htmlFor="vehicleModel">Vehicle Model</Label>
                                    <Input id="vehicleModel" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                                    <Select value={vehicleType} onValueChange={(value: TransportRequest['vehicleType']) => setVehicleType(value)}>
                                        <SelectTrigger id="vehicleType">
                                            <SelectValue placeholder="Select vehicle type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="two-wheeler">Two-wheeler</SelectItem>
                                            <SelectItem value="four-wheeler">Four-wheeler</SelectItem>
                                            <SelectItem value="tempo">Tempo</SelectItem>
                                            <SelectItem value="eicher">Eicher</SelectItem>
                                            <SelectItem value="bus">Bus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                        <Label>Allocation Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !allocationDate && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {allocationDate ? format(allocationDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={allocationDate} onSelect={setAllocationDate} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Expected Return Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !returnDate && "text-muted-foreground")}>
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar mode="single" selected={returnDate} onSelect={setReturnDate} disabled={(date) => date < (allocationDate || new Date(0))} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="driverName">Driver Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="driverName" placeholder="e.g. John Doe" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="driverContact">Driver Contact Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="driverContact" placeholder="e.g. 9988776655" className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="driverLicense">Driver License</Label>
                                     <div className="relative">
                                        <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="driverLicense" placeholder="e.g. DL123456789" className="pl-9" />
                                    </div>
                                </div>
                                 <div className="space-y-1">
                                    <Label htmlFor="conditionPhoto">Vehicle Condition Photo</Label>
                                     <div className="relative">
                                        <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="conditionPhoto" type="file" accept="image/*" className="pl-9" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Select a request and vehicle to see details.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button disabled={!selectedRequest || !selectedVehicle} className="w-full" variant="default">Dispatch Vehicle</Button>
                </CardFooter>
            </Card>
        </div>

      </div>
    </AuthLayout>
  );
}
