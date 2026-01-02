
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

const privateVehicleSchema = z.object({
  requestType: z.literal('private'),
  userName: z.string().min(2, "Sanyojak/In-charge name is required."),
  contactNumber: z.string().min(10, "A valid contact number is required."),
  departmentName: z.string().min(2, "Branch/Zone name is required."),
  vehicleType: z.enum(["car", "suv", "winger", "innova"], { required_error: "Vehicle type is required." }),
  registrationNumber: z.string().min(1, "Registration number is required."),
  passengerCount: z.coerce.number().min(1, 'Occupancy is required.'),
  driverName: z.string().min(2, "Driver name is required."),
  driverContact: z.string().min(10, "A valid driver contact is required."),
  durationFrom: z.date({ required_error: "Arrival date is required." }),
  durationTo: z.date({ required_error: "Departure date is required." }),
}).refine((data) => data.durationTo >= data.durationFrom, {
  message: "Departure date cannot be before arrival date.",
  path: ["durationTo"],
});

const busSchema = z.object({
  requestType: z.literal('bus'),
  userName: z.string().min(2, "Sanyojak/In-charge name is required."),
  contactNumber: z.string().min(10, "A valid contact number is required."),
  departmentName: z.string().min(2, "Branch/Zone name is required."),
  busType: z.enum(["private", "msrtc"], { required_error: "Please select bus type." }),
  busQuantity: z.coerce.number().min(1, 'Please enter the number of buses.'),
  busRoute: z.string().min(3, "Route is required."),
  durationFrom: z.date({ required_error: "Arrival date is required." }),
  durationTo: z.date({ required_error: "Departure date is required." }),
}).refine((data) => data.durationTo >= data.durationFrom, {
  message: "Departure date cannot be before arrival date.",
  path: ["durationTo"],
});

const trainSchema = z.object({
  requestType: z.literal('train'),
  userName: z.string().min(2, "Sanyojak/In-charge name is required."),
  contactNumber: z.string().min(10, "A valid contact number is required."),
  departmentName: z.string().min(2, "Branch/Zone name is required."),
  trainNumber: z.string().min(1, "Train number is required."),
  trainArrivalDate: z.date({ required_error: "Arrival date is required." }),
  trainDevoteeCount: z.coerce.number().min(1, "Number of devotees is required."),
  pickupRequired: z.boolean().default(false),
});

const requestFormSchema = z.discriminatedUnion("requestType", [
    privateVehicleSchema,
    busSchema,
    trainSchema,
]);

export default function Home() {
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
    <header className="absolute top-0 left-0 right-0 p-4 bg-transparent">
        <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <h1 className="text-xl font-headline font-bold text-primary">Samagam FleetConnect</h1>
            </Link>
            <Button asChild variant="outline" className="bg-background/80 backdrop-blur-sm">
                <Link href="/login">Team Login</Link>
            </Button>
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
            <Button className="w-full" onClick={() => { setIsSuccess(false); form.reset(); }}>
              Submit Another Request
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <PublicHeader />
      <Card className="w-full max-w-2xl shadow-2xl animate-in fade-in-50 zoom-in-95">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Transport Request</CardTitle>
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
                  <TabsTrigger value="private"><Car className="mr-2 h-4 w-4"/>Private Vehicle</TabsTrigger>
                  <TabsTrigger value="bus"><Bus className="mr-2 h-4 w-4"/>Bus</TabsTrigger>
                  <TabsTrigger value="train"><Train className="mr-2 h-4 w-4"/>Train</TabsTrigger>
                </TabsList>
                
                <div className="space-y-6 pt-4">
                  <CommonFields />
                </div>

                <TabsContent value="private" className="space-y-6">
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
                
                <TabsContent value="bus" className="space-y-6">
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

                <TabsContent value="train" className="space-y-6">
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
                        <FormItem>
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
                              Check this if you need shuttle service from Bhodwal Majri station.
                            </CardDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                </TabsContent>

              </Tabs>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
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
  );
}
