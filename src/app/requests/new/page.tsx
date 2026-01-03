
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Loader2, Users, Radio, Route, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { AuthLayout } from "@/components/auth-layout";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { requests } from "@/lib/data";

const indoorRequestSchema = z.object({
  userName: z.string().min(2, "User name is required."),
  contactNumber: z.string().min(10, "A valid contact number is required."),
  departmentName: z.string().min(2, "Department name is required."),
  vehicleType: z.enum(['two-wheeler', 'four-wheeler', 'tempo', 'eicher', 'bus'], {
    required_error: "You need to select a vehicle type.",
  }),
  passengerCount: z.coerce.number().min(1, "At least one passenger is required."),
  destination: z.string().min(1, "Destination is required."),
  durationFrom: z.date({
    required_error: "A start date is required.",
  }),
  durationTo: z.date({
    required_error: "An end date is required.",
  }),
   hodApprovalImage: z.any().optional(),
}).refine((data) => data.durationTo >= data.durationFrom, {
  message: "End date cannot be before start date.",
  path: ["durationTo"],
});


export default function IndoorRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof indoorRequestSchema>>({
    resolver: zodResolver(indoorRequestSchema),
    defaultValues: {
      passengerCount: 1,
    },
  });

  async function onSubmit(data: z.infer<typeof indoorRequestSchema>) {
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newRequest = {
      ...data,
      id: `R${String(requests.length + 1).padStart(3, '0')}`,
      status: 'pending' as const,
      createdAt: new Date(),
      requestType: 'private' as const, 
    };

    requests.unshift(newRequest);
    
    toast({
        title: "Request Submitted!",
        description: `Your transport request (ID: ${newRequest.id}) has been logged.`,
    });
    form.reset();
    setIsSubmitting(false);
  }

  return (
    <AuthLayout>
        <div className="flex justify-center">
            <Card className="w-full max-w-2xl shadow-xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Department Vehicle Request</CardTitle>
                        <CardDescription>
                            Fill out the form below to request transport for your department.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>User Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="contactNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 9876543210" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="departmentName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Department Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Guest Services" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vehicleType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Type of Vehicle Required</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="two-wheeler" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Two-wheeler</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="four-wheeler" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Four-wheeler</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="tempo" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Tempo</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="eicher" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Eicher</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="bus" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Bus</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Destination</FormLabel>
                                    <FormControl>
                                         <div className="relative">
                                            <Route className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="e.g., Pune Airport" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="passengerCount"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Number of Passengers</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="number" placeholder="1" className="pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="durationFrom"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Duration From</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="durationTo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Duration To</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("durationFrom") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="hodApprovalImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>HOD Approval (Image)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="file" className="pl-9" onChange={(e) => field.onChange(e.target.files)} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Request
                        </Button>
                    </CardFooter>
                </form>
            </Form>
            </Card>
        </div>
    </AuthLayout>
  );
}

    