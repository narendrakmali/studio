"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, FileImage, Gauge, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import Image from "next/image";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const dynamic = 'force-dynamic';

const receptionFormSchema = z.object({
    registrationNumber: z.string().min(1, "Registration number is required."),
    vehicleType: z.string().min(1, "Vehicle type is required."),
    odometerReading: z.coerce.number().min(1, "Odometer reading is required."),
    frontImage: z.any().refine(file => file.length == 1, "Front image is required."),
    sideImage: z.any().refine(file => file.length == 1, "Side image is required."),
    odometerImage: z.any().refine(file => file.length == 1, "Odometer image is required."),
});

function ReceptionPageContent() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    let firestore = null;
    try {
      const fb = useFirebase();
      firestore = fb.firestore;
    } catch (e) {
      // Firebase not available during prerender
    }

    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [capturedImages, setCapturedImages] = useState({
      front: '', side: '', odometer: ''
    });

    useEffect(() => {
      if (typeof window === 'undefined') return;

      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           setHasCameraPermission(false);
           return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
  
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      };
  
      getCameraPermission();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
      }
    }, [toast]);

    const captureImage = (field: 'front' | 'side' | 'odometer') => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImages(prev => ({ ...prev, [field]: dataUrl }));
        }
    }

    const form = useForm<z.infer<typeof receptionFormSchema>>({
        resolver: zodResolver(receptionFormSchema),
    });

    async function onSubmit(values: z.infer<typeof receptionFormSchema>) {
        setIsSubmitting(true);
        if (!firestore) {
            toast({ variant: "destructive", title: "Firestore not available" });
            setIsSubmitting(false);
            return;
        }

        try {
            const storage = getStorage();
            
            const uploadImage = async (file: File, path: string) => {
                const storageRef = ref(storage, path);
                await uploadBytes(storageRef, file);
                return getDownloadURL(storageRef);
            };

            const frontImageUrl = await uploadImage(values.frontImage[0], `vehicles/${values.registrationNumber}/front.jpg`);
            const sideImageUrl = await uploadImage(values.sideImage[0], `vehicles/${values.registrationNumber}/side.jpg`);
            const odometerImageUrl = await uploadImage(values.odometerImage[0], `vehicles/${values.registrationNumber}/odometer.jpg`);

            await addDoc(collection(firestore, "vehicles"), {
                registrationNumber: values.registrationNumber,
                vehicleType: values.vehicleType,
                odometerReading: values.odometerReading,
                frontImage: frontImageUrl,
                sideImage: sideImageUrl,
                odometerImage: odometerImageUrl,
                status: 'available',
                createdAt: new Date(),
            });

            toast({ title: "Vehicle Registered", description: "The new vehicle has been added to the fleet." });
            form.reset();

        } catch (error) {
            console.error("Error registering vehicle:", error);
            toast({ variant: "destructive", title: "Registration Failed", description: "Could not save the vehicle details." });
        } finally {
            setIsSubmitting(false);
        }
    }

    const imageCaptureSection = (
      <Card>
        <CardHeader>
          <CardTitle>Live Image Capture</CardTitle>
          <CardDescription>Use your device camera to capture vehicle images.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted aspect-video overflow-hidden flex items-center justify-center">
            {hasCameraPermission === true && <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />}
            {hasCameraPermission === false && <p className="text-muted-foreground">Camera not available.</p>}
            {hasCameraPermission === null && <Loader2 className="h-8 w-8 animate-spin" />}
          </div>
          {hasCameraPermission === false && (
              <Alert variant="destructive">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser settings to use this feature.
                  </AlertDescription>
              </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['front', 'side', 'odometer'].map((field) => (
                  <div key={field} className="space-y-2">
                      <Button type="button" onClick={() => captureImage(field as 'front' | 'side' | 'odometer')} className="w-full" disabled={!hasCameraPermission}>
                          Capture {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Button>
                      {capturedImages[field as keyof typeof capturedImages] && (
                        <div className="border rounded-md p-2">
                           <Image src={capturedImages[field as keyof typeof capturedImages]} alt={`Captured ${field}`} width={150} height={100} className="w-full h-auto rounded-md" />
                        </div>
                      )}
                  </div>
              ))}
          </div>
        </CardContent>
      </Card>
    );

    return (
        <AuthLayout>
            <div className="grid gap-6 md:grid-cols-2">
              {imageCaptureSection}
                <Card className="w-full">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardHeader>
                                <CardTitle className="font-headline text-3xl">Fleet Reception</CardTitle>
                                <CardDescription>
                                Log new vehicle details and upload images.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="registrationNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Registration Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="XX-00-XX-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="vehicleType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vehicle Type</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. SUV, Sedan, Bus" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="odometerReading"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Odometer Reading</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g. 54321" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <Separator />

                                <div className="space-y-4">
                                    <Label className="font-medium">Or Upload Vehicle Images</Label>
                                    <div className="grid gap-4 rounded-md border p-4">
                                        <FormField
                                            control={form.control}
                                            name="frontImage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-4 text-sm font-normal">
                                                        <Car className="h-6 w-6 text-muted-foreground"/>
                                                        <span className="flex-1">Front View</span>
                                                    </FormLabel>
                                                    <FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="sideImage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-4 text-sm font-normal">
                                                        <FileImage className="h-6 w-6 text-muted-foreground"/>
                                                        <span className="flex-1">Side View</span>
                                                    </FormLabel>
                                                    <FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="odometerImage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-4 text-sm font-normal">
                                                        <Gauge className="h-6 w-6 text-muted-foreground"/>
                                                        <span className="flex-1">Odometer</span>
                                                    </FormLabel>
                                                    <FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Register Vehicle
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </AuthLayout>
    );
}

export default ReceptionPageContent;
