
'use client';

import { AuthLayout } from "@/components/auth-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Car, ClipboardList, Send, Users, Route, Building, Globe } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { requests, dispatches, vehicles } from "@/lib/data";
import { isToday } from "date-fns";
import { useEffect, useState } from "react";
import { TransportRequest } from "@/lib/types";

export default function DashboardPage() {
  const [currentRequests, setCurrentRequests] = useState(requests);

  useEffect(() => {
    const interval = setInterval(() => {
      if(requests.length !== currentRequests.length) {
        setCurrentRequests([...requests]);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentRequests.length]);

  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const pendingRequests = currentRequests.filter(r => r.status === 'pending').length;
  const dispatchesToday = dispatches.filter(d => isToday(new Date(d.dispatchedAt))).length;
  const totalPassengers = currentRequests.filter(r => r.status === 'pending').reduce((acc, req) => acc + (req.passengerCount || req.trainDevoteeCount || 0), 0);

  const stats = [
    { title: "Available Vehicles", value: availableVehicles, icon: Car, color: "text-green-500", change: "" },
    { title: "Pending Requests", value: pendingRequests, icon: ClipboardList, color: "text-yellow-500", change: "" },
    { title: "Dispatches Today", value: dispatchesToday, icon: Send, color: "text-blue-500", change: "" },
    { title: "Total Passengers", value: totalPassengers, icon: Users, color: "text-indigo-500", change: "" },
  ];

  const indoorRequests = currentRequests.filter(r => r.source === 'indoor').slice(0, 5);
  const outdoorRequests = currentRequests.filter(r => r.source === 'outdoor').slice(0, 5);
  
  const RequestTable = ({ title, requests, icon: Icon }: { title: string, requests: TransportRequest[], icon: React.ElementType }) => (
    <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2"><Icon className="h-6 w-6"/>{title}</CardTitle>
            <CardDescription>A summary of the latest requests received.</CardDescription>
        </CardHeader>
        <CardContent>
            {requests.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department / Branch</TableHead>
                            <TableHead className="hidden sm:table-cell">Requested by</TableHead>
                            <TableHead className="hidden md:table-cell">Vehicle/Mode</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map(req => (
                            <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.departmentName}</TableCell>
                                <TableCell className="hidden sm:table-cell">{req.userName}</TableCell>
                                <TableCell className="hidden md:table-cell capitalize">{req.requestType === 'private' ? req.vehicleType : req.requestType}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={req.status === 'pending' ? 'default' : 'secondary'} className={req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700' : ''}>
                                        {req.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center text-muted-foreground py-12">
                    <p>No recent requests found.</p>
                </div>
            )}
        </CardContent>
    </Card>
  );

  return (
    <AuthLayout>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 text-muted-foreground ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.change && <p className="text-xs text-muted-foreground">
                {stat.change} from last hour
              </p>}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RequestTable title="Recent Indoor Requests" requests={indoorRequests} icon={Building} />
        <RequestTable title="Recent Outdoor Registrations" requests={outdoorRequests} icon={Globe} />
      </div>
    </AuthLayout>
  );
}
