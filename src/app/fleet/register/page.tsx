
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, FileImage, Gauge, ArrowLeft, User, Phone, Home, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const registerVehicleSchema = z.object({
    licensePlate: z.string().min(1, "License plate is required."),
    makeAndModel: z.string().min(1, "Make and model are required."),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
    ownerName: z.string().min(1, "Owner name is required."),
    ownerContact: z.string().min(1, "Owner contact is required."),
    ownerAddress: z.string().min(1, "Owner address is required."),
    contractStartDate: z.date().optional(),
    contractEndDate: z.date().optional(),
}).refine(data => {
    if (data.contractStartDate && data.contractEndDate) {
        return data.contractEndDate >= data.contractStartDate;
    }
    return true;
}, {
    message: "Contract end date cannot be before start date.",
    path: ["contractEndDate"],
});

export default function RegisterVehiclePage() {

  const form = useForm<z.infer<typeof registerVehicleSchema>>({
    resolver: zodResolver(registerVehicleSchema),
    defaultValues: {
        capacity: 1,
    }
  });

  function onSubmit(values: z.infer<typeof registerVehicleSchema>) {
    console.log(values)
  }

  return (
    <AuthLayout>
      <div className="flex justify-center">
        <Card className="w-full max-w-3xl shadow-xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            <FormField
                                control={form.control}
                                name="licensePlate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>License Plate</FormLabel>
                                        <FormControl>
                                            <Input placeholder="XX-00-XX-0000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="makeAndModel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Make & Model</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Toyota Innova" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Capacity</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g. 7" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Separator />
                        
                        <div className="space-y-4">
                        <Label className="font-medium">Owner Details</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="ownerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Owner Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="e.g. Samagam Services" className="pl-9" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ownerContact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="e.g. 9988776655" className="pl-9" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="ownerAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Textarea placeholder="Enter owner's full address" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>

                        <Separator />
                        
                        <div className="space-y-4">
                            <Label className="font-medium">Contract Period (Optional)</Label>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name="contractStartDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Contract Start Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="contractEndDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Contract End Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                            date < (form.getValues("contractStartDate") || new Date(0))
                                            }
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
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
                </form>
            </Form>
        </Card>
      </div>
    </AuthLayout>
  );
}
