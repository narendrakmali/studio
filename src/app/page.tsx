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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Camera, Loader2, PartyPopper } from "lucide-react";
import Link from 'next/link';
import { Logo } from "@/components/logo";

const requestFormSchema = z.object({
  departmentName: z.string().min(2, "Department name is too short"),
  passengerCount: z.coerce.number().min(1, "At least one passenger is required"),
  destination: z.string().min(3, "Destination is required"),
  hodApprovalImage: z.any().refine(file => file?.length == 1, "Approval image is required."),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      departmentName: "",
      passengerCount: 1,
      destination: "",
      hodApprovalImage: undefined,
    },
  });

  const fileRef = form.register("hodApprovalImage");

  async function onSubmit(data: RequestFormValues) {
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
              Your transport request has been received. Our team will get back to you shortly.
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
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-95">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Request a Vehicle</CardTitle>
          <CardDescription>
            Fill out the form below to request transport for your department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Airport" {...field} />
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
                      <FormLabel>Passengers</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
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
                    <FormLabel>HOD Approval</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="file" accept="image/*" className="pl-10 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" {...fileRef} />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Camera className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>Upload a photo of the HOD's signed approval.</FormDescription>
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
                  "Submit Request"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}