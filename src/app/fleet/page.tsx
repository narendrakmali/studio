"use client"

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, FileImage, Car, Gauge, Camera } from "lucide-react";
import { vehicles } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function FleetPage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'secondary';
      case 'in-use':
        return 'default';
      case 'maintenance':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <AuthLayout>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline text-xl">Vehicle Fleet</CardTitle>
                <CardDescription>Manage and view all registered vehicles.</CardDescription>
            </div>
          <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Register Vehicle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-headline">Register New Vehicle</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new vehicle to the fleet.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="license" className="text-right">License Plate</Label>
                  <Input id="license" placeholder="XX-00-XX-0000" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="make" className="text-right">Make & Model</Label>
                  <Input id="make" placeholder="e.g. Toyota Innova" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">Capacity</Label>
                  <Input id="capacity" type="number" placeholder="e.g. 7" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Images</Label>
                    <div className="col-span-3 grid gap-4">
                         <div className="flex items-center gap-2">
                             <Car className="h-5 w-5 text-muted-foreground"/>
                             <Label htmlFor="img-front" className="flex-1 text-sm font-normal">Front View</Label>
                             <Input id="img-front" type="file" className="w-auto"/>
                         </div>
                         <div className="flex items-center gap-2">
                             <FileImage className="h-5 w-5 text-muted-foreground"/>
                             <Label htmlFor="img-side" className="flex-1 text-sm font-normal">Side View</Label>
                             <Input id="img-side" type="file" className="w-auto"/>
                         </div>
                         <div className="flex items-center gap-2">
                             <Gauge className="h-5 w-5 text-muted-foreground"/>
                             <Label htmlFor="img-odo" className="flex-1 text-sm font-normal">Odometer</Label>
                             <Input id="img-odo" type="file" className="w-auto"/>
                         </div>
                    </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Vehicle</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Make & Model</TableHead>
                <TableHead className="text-center">Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Vehicle image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={vehicle.images.front}
                      width="64"
                      data-ai-hint="white van"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell className="text-center">{vehicle.capacity}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(vehicle.status)}>{vehicle.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Mark for Maintenance</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
