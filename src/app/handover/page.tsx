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
import { Hand, Loader2, MessageSquare, Fingerprint, PartyPopper } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dispatches } from "@/lib/data";


const handoverFormSchema = z.object({
  dispatchId: z.string().min(1, "Please select a dispatch ID."),
  receiverName: z.string().min(2, "Receiver's name is required."),
  receiverSignature: z.string().min(2, "A signature (full name) is required."),
  remarks: z.string().optional(),
});


type HandoverFormValues = z.infer<typeof handoverFormSchema>;

export default function HandoverPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<HandoverFormValues>({
    resolver: zodResolver(handoverFormSchema),
    defaultValues: {
      receiverName: "",
      receiverSignature: "",
      remarks: "",
    },
  });

  async function onSubmit(data: HandoverFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
  }
  

  if (isSuccess) {
    return (
        <AuthLayout>
            <main className="flex flex-col items-center justify-center">
                <Card className="w-full max-w-md text-center shadow-2xl animate-in fade-in-50 zoom-in-95">
                <CardHeader>
                    <div className="mx-auto bg-green-100 text-green-700 rounded-full p-4 w-fit">
                    <PartyPopper className="w-10 h-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl mt-4">Vehicle Received!</CardTitle>
                    <CardDescription>
                        The vehicle handover has been successfully recorded.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" onClick={() => { setIsSuccess(false); form.reset(); }}>
                        Log Another Handover
                    </Button>
                </CardFooter>
                </Card>
            </main>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
        <div className="flex justify-center">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader>
                <CardTitle className="font-headline text-3xl flex items-center gap-2"><Hand className="w-8 h-8"/>Vehicle Handover</CardTitle>
                <CardDescription>
                    This form is to be filled out by the party receiving the vehicle.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    <FormField
                        control={form.control}
                        name="dispatchId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Dispatch ID</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a dispatch to confirm receipt" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {dispatches.map(d => (
                                        <SelectItem key={d.id} value={d.id}>Dispatch {d.id} (Vehicle: {d.vehicleId})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <FormField
                        control={form.control}
                        name="receiverName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Receiver's Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Jane Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <FormField
                        control={form.control}
                        name="receiverSignature"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Receiver's Signature (Type Full Name)</FormLabel>
                            <div className="relative">
                                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Type your full name to sign" {...field} className="pl-9"/>
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    
                    <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Condition Remarks</FormLabel>
                             <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Textarea
                                placeholder="Any comments on the vehicle's condition upon receipt..."
                                className="resize-none pl-9"
                                {...field}
                                />
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                        ) : (
                        "Confirm Vehicle Receipt"
                        )}
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
    </AuthLayout>
  );
}
