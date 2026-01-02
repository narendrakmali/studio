
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import { CalendarIcon, Loader2, PartyPopper, Users, Car, Train, Bus, Hash, Phone, User, MapPin } from "lucide-react";
import Link from 'next/link';
import { Logo } from "@/components/logo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";


const baseSchema = z.object({
  userName: z.string().min(2, "Sanyojak/In-charge name is required."),
  contactNumber: z.string().min(10, "A valid contact number is required."),
  departmentName: z.string().min(2, "Branch/Zone name is required."),
});

const privateVehicleSchema = baseSchema.extend({
  requestType: z.literal("private"),
  vehicleType: z.enum(["two-wheeler", "car", "suv", "winger", "innova"]),
  registrationNumber: z.string(),
  passengerCount: z.coerce.number().optional(),
  driverName: z.string().optional(),
  driverContact: z.string().optional(),
  durationFrom: z.date(),
  durationTo: z.date(),
});

const busSchema = baseSchema.extend({
  requestType: z.literal("bus"),
  busType: z.enum(["private", "msrtc"]),
  busQuantity: z.coerce.number().optional(),
  busRoute: z.string().optional(),
  durationFrom: z.date(),
  durationTo: z.date(),
});

const trainSchema = baseSchema.extend({
  requestType: z.literal("train"),
  trainNumber: z.string().optional(),
  trainArrivalDate: z.date().optional(),
  trainDevoteeCount: z.coerce.number().optional(),
  pickupRequired: z.boolean().optional().default(false),
  returnTrainNumber: z.string().optional(),
  returnTrainDepartureDate: z.date().optional(),
});


const requestFormSchema = z.discriminatedUnion("requestType", [
  privateVehicleSchema,
  busSchema,
  trainSchema,
]).superRefine((data, ctx) => {
    if (data.requestType === "private") {
        if (!data.vehicleType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vehicle type is required.", path: ["vehicleType"] });
        if (!data.registrationNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Registration number is required.", path: ["registrationNumber"] });
        if (data.passengerCount === undefined || data.passengerCount < 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Occupancy is required.", path: ["passengerCount"] });
        if (!data.driverName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Driver name is required.", path: ["driverName"] });
        if (!data.driverContact) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Driver contact is required.", path: ["driverContact"] });
        if (!data.durationFrom) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Arrival date is required.", path: ["durationFrom"] });
        if (!data.durationTo) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Departure date is required.", path: ["durationTo"] });
      } else if (data.requestType === "bus") {
        if (!data.busType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bus type is required.", path: ["busType"] });
        if (data.busQuantity === undefined || data.busQuantity < 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter the number of buses.", path: ["busQuantity"] });
        if (!data.busRoute) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Route is required.", path: ["busRoute"] });
        if (!data.durationFrom) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Arrival date is required.", path: ["durationFrom"] });
        if (!data.durationTo) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Departure date is required.", path: ["durationTo"] });
      } else if (data.requestType === "train") {
        if (!data.trainNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Train number is required.", path: ["trainNumber"] });
        if (!data.trainArrivalDate) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Arrival date is required.", path: ["trainArrivalDate"] });
        if (data.trainDevoteeCount === undefined || data.trainDevoteeCount < 1) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Number of devotees is required.", path: ["trainDevoteeCount"] });
        if (data.returnTrainNumber && !data.returnTrainDepartureDate) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Return departure date is required if return train number is provided.", path: ["returnTrainDepartureDate"] });
        }
        if (data.returnTrainDepartureDate && data.trainArrivalDate && data.returnTrainDepartureDate < data.trainArrivalDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Return departure date cannot be before arrival date.",
            path: ["returnTrainDepartureDate"],
          });
        }
      }
    
      if (data.requestType !== 'train' && data.durationFrom && data.durationTo && data.durationTo < data.durationFrom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Departure date cannot be before arrival date.",
          path: ["durationTo"],
        });
      }
});


export default function OutdoorRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("private");

  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requestType: "private",
      userName: "",
      contactNumber: "",
      departmentName: "",
      passengerCount: 1,
      busQuantity: 1,
      trainDevoteeCount: 1,
      pickupRequired: false,
    },
  });

  async function onSubmit(data: z.infer<typeof requestFormSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
  }
  
  const PublicHeader = () => (
    <header className="sticky top-0 left-0 right-0 p-4 z-20 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <h1 className="text-xl font-headline font-bold text-primary">Transport Coordination Portal</h1>
            </Link>
            <div className="flex items-center gap-2">
                <p className="hidden sm:block text-sm text-muted-foreground font-medium">Branch: Pune-1</p>
                <Button asChild variant="outline" className="bg-background/80 backdrop-blur-sm">
                    <Link href="/login">Team Login</Link>
                </Button>
            </div>
        </div>
    </header>
  );

  const CommonFields = () => (
    <>
      <FormField
        control={form.control}
        name="departmentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch / Zone Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Pune" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sanyojak / In-charge Name</FormLabel>
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
    </>
  );

  if (isSuccess) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
        <PublicHeader />
        <Card className="w-full max-w-md text-center shadow-2xl animate-in fade-in-50 zoom-in-95">
          <CardHeader>
            <div className="mx-auto bg-green-100 text-green-700 rounded-full p-4 w-fit">
              <PartyPopper className="w-10 h-10" />
            </div>
            <CardTitle className="font-headline text-3xl mt-4">Request Submitted!</CardTitle>
            <CardDescription>
              Your request has been received. You will receive a Request ID shortly.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full btn-submit" onClick={() => { setIsSuccess(false); form.reset(); }}>
              Submit Another Request
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="flex flex-col items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-3xl shadow-2xl animate-in fade-in-50 zoom-in-95">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Outdoor Vehicle Request</CardTitle>
          <CardDescription>
            Register your branch/zone's vehicle and travel details for Samagam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={(value) => {
                form.setValue("requestType", value as "private" | "bus" | "train");
                setActiveTab(value);
              }} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="private" className="data-[state=active]:border-b-2 data-[state=active]:border-eco-green data-[state=active]:text-eco-green"><Car className="mr-2 h-4 w-4"/>Private Vehicle</TabsTrigger>
                  <TabsTrigger value="bus" className="data-[state=active]:border-b-2 data-[state=active]:border-msrtc-orange data-[state=active]:text-msrtc-orange"><Bus className="mr-2 h-4 w-4"/>Bus</TabsTrigger>
                  <TabsTrigger value="train" className="data-[state=active]:border-b-2 data-[state=active]:border-trust-blue data-[state=active]:text-trust-blue"><Train className="mr-2 h-4 w-4"/>Train</TabsTrigger>
                </TabsList>
                
                <div className="space-y-6 pt-4">
                  <CommonFields />
                </div>

                <TabsContent value="private" className="space-y-6 border-l-4 border-eco-green pl-4 -ml-4">
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="two-wheeler">Two Wheeler</SelectItem>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="suv">SUV</SelectItem>
                            <SelectItem value="winger">Winger</SelectItem>
                            <SelectItem value="innova">Innova</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., MH 12 AB 1234" {...field} />
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
                          <FormLabel>Occupancy</FormLabel>
                          <FormControl>
                             <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="e.g. 4" className="pl-9" {...field} />
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
                      name="driverName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Name</FormLabel>
                          <FormControl>
                             <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Driver's full name" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="driverContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Mobile</FormLabel>
                          <FormControl>
                             <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Driver's mobile number" className="pl-9" {...field} />
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
                          <FormLabel>Arrival Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                                  {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
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
                          <FormLabel>Departure Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                  {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
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
                </TabsContent>
                
                <TabsContent value="bus" className="space-y-6 border-l-4 border-msrtc-orange pl-4 -ml-4">
                   <FormField
                    control={form.control}
                    name="busType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bus Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bus type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="private">Private Bus</SelectItem>
                            <SelectItem value="msrtc">Govt / MSRTC</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="busQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                             <div className="relative">
                                <Bus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" placeholder="Number of buses" className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="busRoute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Route</FormLabel>
                           <FormControl>
                             <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Origin to Samalkha" className="pl-9" {...field} />
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
                          <FormLabel>Arrival Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                  {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
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
                          <FormLabel>Departure Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                  {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
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
                </TabsContent>

                <TabsContent value="train" className="space-y-6 border-l-4 border-trust-blue pl-4 -ml-4">
                  <div className="space-y-2">
                    <FormLabel>Arrival Journey Details</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="trainNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Train Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., 12903" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="trainArrivalDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Arrival Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                      {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
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
                    </div>
                    <FormField
                        control={form.control}
                        name="trainDevoteeCount"
                        render={({ field }) => (
                          <FormItem className="pt-4">
                            <FormLabel>Number of Devotees</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="number" placeholder="Total count for this train" className="pl-9" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <FormLabel>Return Journey Details (Optional)</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField
                          control={form.control}
                          name="returnTrainNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Return Train Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., 12904" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="returnTrainDepartureDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Departure Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                      {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("trainArrivalDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                  </div>
                  
                  <Separator />

                    <FormField
                      control={form.control}
                      name="pickupRequired"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Pick-up Required
                            </FormLabel>
                             <CardDescription>
                              Check this if you need shuttle service from Bhodwal Majri station to Sangli or miraj station
                            </CardDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                </TabsContent>

              </Tabs>
              <Button type="submit" className="w-full btn-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </Form>
          </FormProvider>
        </CardContent>
      </Card>
      </main>
    </div>
  );
}

    