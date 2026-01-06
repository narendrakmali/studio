
"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader2, Users, Radio } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addRequest } from "@/lib/data";
import { TransportRequest } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { RequestChatbot } from "@/components/request-chatbot";

const indoorRequestSchema = z.object({
  userName: z.string().min(2, "User name is required."),
  contactNumber: z.string().min(10, "A valid contact number is required."),
  departmentName: z.string().min(2, "Department name is required."),
  vehicleTypePassenger: z.enum(['electric-cart', 'manual-wheelchair', 'push-trolley', 'small-tempo', 'other'], {
    required_error: "You need to select a passenger vehicle type.",
  }).optional(),
  vehicleTypeGoods: z.enum(['hand-trolley', 'push-cart', 'tempo-small', 'eicher', 'goods-carrier-open', 'goods-carrier-closed', 'other'], {
    required_error: "You need to select a goods vehicle type.",
  }).optional(),
  otherVehicleType: z.string().optional(),
  passengerCount: z.coerce.number().min(1, "At least one passenger/item is required."),
  specialCategory: z.enum(['senior-citizen', 'differently-abled', 'emergency-medical', 'vip-movement', 'other', 'none'], {
    required_error: "You need to select a special category.",
  }),
  otherSpecialCategory: z.string().optional(),
  groundNumber: z.enum(['1', '2', '3'], {
    required_error: "You need to select a ground number.",
  }),
  durationFrom: z.date({
    required_error: "A start date is required.",
  }),
  durationTo: z.date({
    required_error: "An end date is required.",
  }),
  specialInstructions: z.string().optional(),
}).refine((data) => data.durationTo >= data.durationFrom, {
  message: "End date cannot be before start date.",
  path: ["durationTo"],
}).refine(
  (data) => data.vehicleTypePassenger || data.vehicleTypeGoods,
  {
    message: "Please select either a passenger or goods vehicle type.",
    path: ["vehicleTypePassenger"],
  }
);


export default function IndoorRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [firestoreReady, setFirestoreReady] = useState(false);

  // Check if Firestore is ready
  useEffect(() => {
    // Give Firebase a moment to initialize
    const timer = setTimeout(() => {
      setFirestoreReady(true);
      console.log('🔥 Firestore initialization check complete');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const form = useForm<z.infer<typeof indoorRequestSchema>>({
    resolver: zodResolver(indoorRequestSchema),
    defaultValues: {
      userName: "",
      contactNumber: "",
      departmentName: "",
      vehicleTypePassenger: undefined,
      vehicleTypeGoods: undefined,
      otherVehicleType: "",
      passengerCount: 1,
      specialCategory: 'none',
      otherSpecialCategory: "",
      groundNumber: undefined,
      durationFrom: undefined,
      durationTo: undefined,
      specialInstructions: "",
    },
  });
  
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

  async function onSubmit(data: z.infer<typeof indoorRequestSchema>) {
    setIsSubmitting(true);
    
    try {
      console.log('📝 Indoor form data to submit:', data);
      
      const newRequestData: Omit<TransportRequest, 'id' | 'status' | 'createdAt'> = {
        ...data,
        source: 'indoor',
        requestType: 'private', 
      };

      console.log('📝 Prepared request data:', newRequestData);

      // CRITICAL: await the promise to ensure data is saved
      const newRequest = await addRequest(newRequestData);
      
      console.log("✅ Request successfully saved to Firestore:", newRequest);
      
      form.reset();
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("❌ Failed to save request:", error);
      console.error('Error details:', {
        name: (error as Error).name,
        message: (error as Error).message,
        stack: (error as Error).stack,
        data: data
      });
      alert("Failed to submit request: " + (error as Error).message + ". Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
        <PublicHeader />
        <RequestChatbot requestType="indoor" />
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-center">
                <Card className="w-full max-w-2xl shadow-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-t-lg">
                        <CardTitle className="font-headline text-3xl">🚗 Samagam Indoor Vehicle Request Portal</CardTitle>
                        <CardDescription className="text-blue-100">
                            Team Login - Fill out the form below to request transport within the Samagam grounds.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>👤 User Name</FormLabel>
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
                                    <FormLabel>📞 Contact Number</FormLabel>
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
                                <FormLabel>🏢 Department Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Guest Services" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vehicleTypePassenger"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>🚘 Type of Vehicle Required (Passenger)</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-col space-y-2"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="electric-cart" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Electric Cart</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="manual-wheelchair" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Manual Wheelchair</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="push-trolley" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Push Trolley</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="small-tempo" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Small Tempo (Indoor Use)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="other" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Other</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vehicleTypeGoods"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>🚚 Type of Vehicle Required (Goods Transport)</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-col space-y-2"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="hand-trolley" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Hand Trolley</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="push-cart" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Push Cart</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="tempo-small" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Tempo (Small)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="eicher" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Eicher (Medium Truck)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="goods-carrier-open" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Goods Carrier (Open Body)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="goods-carrier-closed" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Goods Carrier (Closed Body)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="other" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Other</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        {(form.watch('vehicleTypePassenger') === 'other' || form.watch('vehicleTypeGoods') === 'other') && (
                            <FormField
                                control={form.control}
                                name="otherVehicleType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Specify Other Vehicle Type</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Please specify..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="passengerCount"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>👥 Number of Passengers / Items</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="groundNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>🏟 Ground Number</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select ground" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="1">Ground 1</SelectItem>
                                        <SelectItem value="2">Ground 2</SelectItem>
                                        <SelectItem value="3">Ground 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="specialCategory"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>🧓 Special Category</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-col space-y-2"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="none" />
                                        </FormControl>
                                        <FormLabel className="font-normal">None</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="senior-citizen" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Sr सिटीझन (Senior Citizen)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="differently-abled" />
                                        </FormControl>
                                        <FormLabel className="font-normal">दिव्यांग (Differently Abled)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="emergency-medical" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Emergency Medical</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="vip-movement" />
                                        </FormControl>
                                        <FormLabel className="font-normal">VIP Movement</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="other" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Other</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch('specialCategory') === 'other' && (
                            <FormField
                                control={form.control}
                                name="otherSpecialCategory"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Specify Other Special Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Please specify..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
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
                            name="specialInstructions"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>📝 Special Instructions (if any)</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Enter any special instructions or requirements..."
                                        className="min-h-[80px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        ✅ Submit Request
                        </Button>
                    </CardFooter>
                </form>
            </Form>
            </Card>
        </div>
        <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Request Submitted Successfully!</AlertDialogTitle>
                <AlertDialogDescription>
                    Please get in touch with our team members with the approval copy from your Department Head:
                    <br/><br/>
                    <strong>Sh. Prasad More ji:</strong> 9960703710
                    <br/>
                    <strong>Sh. Akash More ji:</strong> 9503707518
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowSuccessAlert(false)}>OK</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>
    </>
  );
}
