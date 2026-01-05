
"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password or OTP is required."),
});

const allowedUsers = [
    "admin@samagam.com",
    "narendrakmali@gmail.com",
    "samagamtransport@gmail.com",
    "prasadshivajimore@gmail.com",
    "akashmore1848@gmail.com",
    "rajendranandikurle32@gmail.com"
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Clear any mock login when hitting the login page (acts as logout)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('mockUserEmail');
    }
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (allowedUsers.includes(values.email) && values.password === "password") {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('mockUserEmail', values.email);
      }
      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-3">
             <Logo className="w-12 h-12" />
             <h1 className="text-3xl font-headline font-bold text-primary">Samagam FleetConnect</h1>
          </Link>
        </div>
        <Card className="shadow-2xl animate-in fade-in-50 zoom-in-95">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Team Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Staff ID</FormLabel>
                      <FormControl>
                        <Input placeholder="you@samagam.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password or OTP</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign In
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground mt-4">
          Go back to the {" "}
          <Link
            href="/"
            className="underline underline-offset-4 hover:text-primary"
          >
            main selection page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
