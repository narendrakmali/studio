
"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
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
import { CalendarIcon, Loader2, PartyPopper, Users, Car, Train, Bus, Hash, Phone, User, MapPin, Upload, Plane } from "lucide-react";
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
import { addRequest, setFirestoreDb } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { RequestChatbot } from "@/components/request-chatbot";
import { useFirebase } from "@/firebase/provider";

const privateVehicleSchema = z.object({
    requestType: z.literal("private"),
    userName: z.string().min(2, "Sanyojak/In-charge name is required."),
    contactNumber: z.string().min(10, "A valid contact number is required."),
    departmentName: z.string().min(2, "Branch/Zone name is required."),
    vehicleType: z.enum(["two-wheeler", "car", "suv", "winger", "innova"]),
    registrationNumber: z.string().min(1, "Registration number is required."),
    passengerCount: z.coerce.number().min(1, "Occupancy is required."),
    driverName: z.string().min(1, "Driver name is required."),
    driverContact: z.string().min(1, "Driver contact is required."),
    durationFrom: z.date({ required_error: "Arrival date is required." }),
    durationTo: z.date({ required_error: "Departure date is required." }),
});

const busSchema = z.object({
    requestType: z.literal("bus"),
    userName: z.string().min(2, "Sanyojak/In-charge name is required."),
    contactNumber: z.string().min(10, "A valid contact number is required."),
    departmentName: z.string().min(2, "Branch/Zone name is required."),
    busType: z.enum(["private", "msrtc"], { required_error: "Bus type is required." }),
    busQuantity: z.coerce.number().min(1, "Please enter the number of buses."),
    busRoute: z.string().min(1, "Route is required."),
    busCoordinatorName: z.string().min(1, "Coordinator name is required."),
    busCoordinatorContact: z.string().min(1, "Coordinator contact is required."),
    busBookingReceipt: z.any().optional(),
    durationFrom: z.date({ required_error: "Arrival date is required." }),
    durationTo: z.date({ required_error: "Departure date is required." }),
});

const trainSchema = z.object({
    requestType: z.literal("train"),
    userName: z.string().min(2, "Sanyojak/In-charge name is required."),
    contactNumber: z.string().min(10, "A valid contact number is required."),
    departmentName: z.string().min(2, "Branch/Zone name is required."),
    trainTeamLeaderName: z.string().min(1, "Team Leader name is required."),
    trainTeamLeaderContact: z.string().min(1, "Team Leader contact is required."),
    trainNumber: z.string().min(1, "Train number is required."),
    trainArrivalDate: z.date({ required_error: "Arrival date is required." }),
    trainDevoteeCount: z.coerce.number().min(1, "Number of devotees is required."),
    pickupRequired: z.boolean().default(false),
    returnTrainNumber: z.string().optional(),
    returnTrainDepartureDate: z.date().optional(),
});

const airportSchema = z.object({
    requestType: z.literal("airport"),
    userName: z.string().min(2, "Saint/In-charge name is required."),
    contactNumber: z.string().min(10, "A valid contact number is required."),
    departmentName: z.string().min(2, "Branch/Zone name is required."),
    airportName: z.enum(["pune", "kolhapur"], { required_error: "Airport selection is required." }),
    flightNumber: z.string().min(1, "Flight number is required."),
    arrivalDate: z.date({ required_error: "Arrival date is required." }),
    arrivalTime: z.string().min(1, "Arrival time is required."),
    passengerCount: z.coerce.number().min(1, "Number of passengers is required."),
    pickupRequired: z.boolean().default(true),
    returnFlightNumber: z.string().optional(),
    departureDate: z.date().optional(),
    departureTime: z.string().optional(),
});

const requestFormSchema = z.discriminatedUnion("requestType", [
    privateVehicleSchema,
    busSchema,
    trainSchema,
    airportSchema,
]).superRefine((data, ctx) => {
    if (data.requestType === 'bus' && data.busType === 'msrtc' && !data.busBookingReceipt) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Booking receipt is required for MSRTC buses.",
            path: ["busBookingReceipt"],
        });
    }
    if (data.requestType !== 'train' && data.durationTo < data.durationFrom) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Departure date cannot be before arrival date.",
            path: ["durationTo"],
        });
    }
    if (data.requestType === 'train' && data.returnTrainDepartureDate && data.trainArrivalDate && data.returnTrainDepartureDate < data.trainArrivalDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Return departure date cannot be before arrival date.",
            path: ["returnTrainDepartureDate"],
        });
    }
});



export default function OutdoorRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("private");
  const { toast } = useToast();
  const [firestoreReady, setFirestoreReady] = useState(false);

  // Initialize Firestore DB
  useEffect(() => {
    let mounted = true;
    
    const initFirestore = async () => {
      try {
        const { firestore } = useFirebase();
        if (firestore && mounted) {
          setFirestoreDb(firestore);
          setFirestoreReady(true);
          console.log('🔥 Firestore initialized successfully');
        }
      } catch (error) {
        console.error('⚠️ Could not initialize Firestore:', error);
        // Wait a bit and retry
        setTimeout(() => {
          if (mounted) {
            try {
              const { firestore } = useFirebase();
              if (firestore) {
                setFirestoreDb(firestore);
                setFirestoreReady(true);
                console.log('🔥 Firestore initialized on retry');
              }
            } catch (retryError) {
              console.error('❌ Firestore initialization failed:', retryError);
            }
          }
        }, 2000);
      }
    };

    initFirestore();
    
    return () => {
      mounted = false;
    };
  }, []);

  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requestType: "private",
      userName: "",
      contactNumber: "",
      departmentName: "",
      passengerCount: 1,
      registrationNumber: "",
      driverName: "",
      driverContact: "",
      vehicleType: undefined,
      busType: undefined,
      busQuantity: 1,
      busRoute: "",
      busCoordinatorName: "",
      busCoordinatorContact: "",
      trainTeamLeaderName: "",
      trainTeamLeaderContact: "",
      trainNumber: "",
      trainDevoteeCount: 1,
      pickupRequired: false,
      returnTrainNumber: "",
      busBookingReceipt: undefined,
      durationFrom: undefined,
      durationTo: undefined,
      trainArrivalDate: undefined,
      returnTrainDepartureDate: undefined,
      // Airport fields
      airportName: undefined,
      flightNumber: "",
      arrivalDate: undefined,
      arrivalTime: "",
      returnFlightNumber: "",
      departureDate: undefined,
      departureTime: "",
    },
  });

  async function onSubmit(data: z.infer<typeof requestFormSchema>) {
    setIsSubmitting(true);
    
    try {
      console.log('📝 Form data to submit:', data);
      console.log('📝 Form data type:', data.requestType);
      
      // CRITICAL: await the promise to ensure data is saved
      const newRequest = await addRequest({ ...data, source: 'outdoor' });
      
      console.log("✅ Request successfully saved to Firestore:", newRequest);
      
      setIsSuccess(true);
    } catch (error) {
      console.error("❌ Failed to save request:", error);
      console.error('Error details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack,
        data: data
      });
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: (error as Error).message || "Failed to submit request. Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
  
  const BusTabContent = () => {
    const { control, watch, getValues } = useFormContext();
    const busType = watch('busType');

    return (
        <TabsContent value="bus" className="space-y-6 border-l-4 border-msrtc-orange pl-4 -ml-4">
            <FormField
            control={control}
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
                control={control}
                name="busCoordinatorName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Bus Coordinator Name</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Coordinator's full name" className="pl-9" {...field} />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="busCoordinatorContact"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Coordinator Mobile</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Coordinator's mobile" className="pl-9" {...field} />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
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
                control={control}
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
            
            {busType === 'msrtc' && (
                <FormField
                    control={control}
                    name="busBookingReceipt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload Booking Receipt</FormLabel>
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
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
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
                    <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)]" align="start" side="bottom" sideOffset={4}>
                        <Calendar mode="single" className="rounded-md" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={control}
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
                    <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)]" align="start" side="bottom" sideOffset={4}>
                        <Calendar mode="single" className="rounded-md" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (getValues("durationFrom") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
        </TabsContent>
    );
  }


  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <PublicHeader />
        <main className="flex flex-grow flex-col items-center justify-center p-4 sm:p-8">
            <Card className="w-full max-w-lg text-center shadow-2xl animate-in fade-in-50 zoom-in-95">
            <CardHeader>
                <div className="mx-auto text-primary rounded-full p-4 w-fit">
                <h2 className="text-2xl font-bold">Dhan Nirankar Ji</h2>
                </div>
                <CardTitle className="font-headline text-2xl mt-2">Request Submitted!</CardTitle>
                <CardDescription className="space-y-2 pt-2">
                    <p>Transport department will contact you for further details.</p>
                    <p className="font-medium">धन निरंकार जी अधिक माहितीसाठी वाहतूक विभाग तुमच्याशी संपर्क साधेल.</p>
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full btn-submit" onClick={() => { setIsSuccess(false); form.reset({ requestType: activeTab as any, source: 'outdoor' }); }}>
                Submit Another Request
                </Button>
            </CardFooter>
            </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <RequestChatbot requestType="outdoor" />
      <main className="flex flex-col items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-3xl shadow-2xl animate-in fade-in-50 zoom-in-95 border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white">
        <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="font-headline text-3xl">Travel and Arrival Request for Samagam</CardTitle>
          <CardDescription className="text-teal-100">
            Register your branch/zone's vehicle and travel details from different parts of India.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={(value) => {
                form.setValue("requestType", value as "private" | "bus" | "train" | "airport");
                setActiveTab(value);
              }} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-100">
                  <TabsTrigger value="private" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"><Car className="mr-2 h-4 w-4"/>Private</TabsTrigger>
                  <TabsTrigger value="bus" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"><Users className="mr-2 h-4 w-4"/>Bus</TabsTrigger>
                  <TabsTrigger value="train" className="data-[state=active]:bg-green-500 data-[state=active]:text-white"><Train className="mr-2 h-4 w-4"/>Train</TabsTrigger>
                  <TabsTrigger value="airport" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"><Plane className="mr-2 h-4 w-4"/>Airport</TabsTrigger>
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
                            <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)]" align="start" side="bottom" sideOffset={4}>
                              <Calendar mode="single" className="rounded-md" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
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
                            <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)]" align="start" side="bottom" sideOffset={4}>
                              <Calendar mode="single" className="rounded-md" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("durationFrom") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <BusTabContent />

                <TabsContent value="train" className="space-y-6 border-l-4 border-trust-blue pl-4 -ml-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="trainTeamLeaderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team Leader Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., Jane Doe" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="trainTeamLeaderContact"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team Leader Contact</FormLabel>
                              <FormControl>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., 9876543210" className="pl-9" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                   </div>

                  <Separator />

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
                                <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)]" align="start" side="bottom" sideOffset={4}>
                                  <Calendar mode="single" className="rounded-md" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
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
                                <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)]" align="start" side="bottom" sideOffset={4}>
                                  <Calendar mode="single" className="rounded-md" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("trainArrivalDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
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
                              Check this if you need shuttle service from Sangli or Miraj station.
                            </CardDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                </TabsContent>

                <TabsContent value="airport" className="space-y-6 border-l-4 border-purple-500 pl-4 -ml-4">
                  <CommonFields />
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-700">Flight Arrival Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="airportName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Airport</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select airport" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pune">Pune Airport</SelectItem>
                              <SelectItem value="kolhapur">Kolhapur Airport</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="flightNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Arrival Flight Number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., AI 635" {...field} />
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
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="arrivalDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Arrival Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick arrival date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)]" align="start" side="bottom" sideOffset={4}>
                                <Calendar mode="single" className="rounded-md" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="arrivalTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Arrival Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-700">Return Flight Details (Optional)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="returnFlightNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Return Flight Number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., AI 636" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="departureTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departure Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="departureDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Departure Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                  {field.value ? format(field.value, "PPP") : <span>Pick departure date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 max-w-[calc(100vw-2rem)]" align="start" side="bottom" sideOffset={4}>
                              <Calendar mode="single" className="rounded-md" selected={field.value} onSelect={field.onChange} disabled={(date) => date < (form.getValues("arrivalDate") || new Date(new Date().setHours(0,0,0,0)))} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="pickupRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-purple-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Airport Pickup Required
                          </FormLabel>
                          <CardDescription>
                            Check this if you need shuttle service from the airport to Samagam ground.
                          </CardDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </TabsContent>

              </Tabs>
              <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-lg shadow-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Travel Request"
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
