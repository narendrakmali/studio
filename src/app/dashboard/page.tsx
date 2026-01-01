import { AuthLayout } from "@/components/auth-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Car, ClipboardList, Send, Users, Route } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { requests } from "@/lib/data";

export default function DashboardPage() {
  const stats = [
    { title: "Available Vehicles", value: "12", icon: Car, color: "text-green-500", change: "+2" },
    { title: "Pending Requests", value: "8", icon: ClipboardList, color: "text-yellow-500", change: "+3" },
    { title: "Dispatches Today", value: "5", icon: Send, color: "text-blue-500", change: "-1" },
    { title: "Total Passengers", value: "48", icon: Users, color: "text-indigo-500", change: "+15" },
  ];

  const recentRequests = requests.slice(0, 5);

  return (
    <AuthLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <p className="text-xs text-muted-foreground">
                {stat.change} from last hour
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Recent Transport Requests</CardTitle>
                <CardDescription>A summary of the latest transport requests received.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead>Requested by</TableHead>
                             <TableHead>Passengers</TableHead>
                            <TableHead>Vehicle Type</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentRequests.map(req => (
                            <TableRow key={req.id}>
                                <TableCell className="font-medium">{req.departmentName}</TableCell>
                                <TableCell>{req.userName}</TableCell>
                                <TableCell>{req.passengerCount}</TableCell>
                                <TableCell className="capitalize">{req.vehicleType}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={req.status === 'pending' ? 'default' : 'secondary'} className={req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-700' : ''}>
                                        {req.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
