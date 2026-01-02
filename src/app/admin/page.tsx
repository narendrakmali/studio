"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, KeyRound, Loader2, Car, Wrench, CircleCheck, FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { importVehicleDataFromCsv, ImportVehicleDataFromCsvOutput } from "@/ai/flows/import-vehicle-data-from-csv";
import { importDispatchDataFromCsv, ImportDispatchDataFromCsvOutput } from "@/ai/flows/import-dispatch-data-from-csv";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { vehicles } from "@/lib/data";

export default function AdminPage() {
    const { toast } = useToast();
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [dispatchCsvFile, setDispatchCsvFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [isDispatchImporting, setIsDispatchImporting] = useState(false);
    const [mappedData, setMappedData] = useState<ImportVehicleDataFromCsvOutput | null>(null);
    const [mappedDispatchData, setMappedDispatchData] = useState<ImportDispatchDataFromCsvOutput | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setCsvFile(event.target.files[0]);
            setMappedData(null);
        }
    };
    
    const handleDispatchFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setDispatchCsvFile(event.target.files[0]);
            setMappedDispatchData(null);
        }
    };

    const handleImport = async () => {
        if (!csvFile) {
            toast({ variant: "destructive", title: "No file selected", description: "Please select a CSV file to import." });
            return;
        }

        setIsImporting(true);
        setMappedData(null);
        const reader = new FileReader();
        reader.readAsText(csvFile);
        reader.onload = async (e) => {
            const csvData = e.target?.result as string;
            try {
                const result = await importVehicleDataFromCsv({ csvData });
                setMappedData(result);
                toast({ title: "CSV Processed", description: "AI has mapped the vehicle data. Review and confirm." });
            } catch (error) {
                console.error("Vehicle CSV import failed:", error);
                toast({ variant: "destructive", title: "Import Failed", description: "The AI could not process the vehicle CSV file." });
            } finally {
                setIsImporting(false);
            }
        };
    };
    
    const handleDispatchImport = async () => {
        if (!dispatchCsvFile) {
            toast({ variant: "destructive", title: "No file selected", description: "Please select a CSV file to import." });
            return;
        }

        setIsDispatchImporting(true);
        setMappedDispatchData(null);
        const reader = new FileReader();
        reader.readAsText(dispatchCsvFile);
        reader.onload = async (e) => {
            const csvData = e.target?.result as string;
            try {
                const result = await importDispatchDataFromCsv({ csvData });
                setMappedDispatchData(result);
                toast({ title: "CSV Processed", description: "AI has mapped the dispatch data. Review and confirm." });
            } catch (error) {
                console.error("Dispatch CSV import failed:", error);
                toast({ variant: "destructive", title: "Import Failed", description: "The AI could not process the dispatch CSV file." });
            } finally {
                setIsDispatchImporting(false);
            }
        };
    };

    const handleDownloadTemplate = () => {
        const headers = "licensePlate,make,model,capacity,ownerName,ownerContact,ownerAddress";
        const csvContent = "data:text/csv;charset=utf-8," + headers;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "vehicle_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Template Downloaded", description: "vehicle_template.csv has been downloaded." });
    }
    
    const handleDownloadDispatchTemplate = () => {
        const headers = "requestId,vehicleId,driverName,driverLicense,dispatchedAt";
        const csvContent = "data:text/csv;charset=utf-8," + headers;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dispatch_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Template Downloaded", description: "dispatch_template.csv has been downloaded." });
    }

    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === 'available').length;
    const inUseVehicles = vehicles.filter(v => v.status === 'in-use').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;

    return (
        <AuthLayout>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <div className="space-y-6">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Import Vehicle Data</CardTitle>
                            <CardDescription>Upload a CSV with pre-registered vehicles. The AI will map columns automatically.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <Input type="file" accept=".csv" onChange={handleFileChange} className="flex-grow" />
                                <Button onClick={handleImport} disabled={isImporting || !csvFile} className="w-full sm:w-auto" size="icon">
                                    {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                </Button>
                            </div>
                            <Button variant="outline" onClick={handleDownloadTemplate} className="w-full">
                                <FileText className="mr-2 h-4 w-4" />
                                Download Vehicle Template
                            </Button>
                            {mappedData && (
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center justify-between">
                                        <span>Data Preview</span>
                                        {mappedData.mappingConfidence && <Badge>Confidence: {mappedData.mappingConfidence}%</Badge>}
                                    </h3>
                                    <div className="max-h-60 overflow-auto border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {Object.keys(mappedData.mappedData[0]).map(key => <TableHead key={key}>{key}</TableHead>)}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mappedData.mappedData.slice(0, 5).map((row, index) => (
                                                <TableRow key={index}>
                                                    {Object.values(row).map((val, i) => <TableCell key={i}>{val}</TableCell>)}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={!mappedData}>Confirm & Save {mappedData?.mappedData.length} Vehicles</Button>
                        </CardFooter>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Import Dispatch Data</CardTitle>
                            <CardDescription>Upload a CSV with allocated or dispatched vehicle records.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <Input type="file" accept=".csv" onChange={handleDispatchFileChange} className="flex-grow" />
                                <Button onClick={handleDispatchImport} disabled={isDispatchImporting || !dispatchCsvFile} className="w-full sm:w-auto" size="icon">
                                    {isDispatchImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                </Button>
                            </div>
                            <Button variant="outline" onClick={handleDownloadDispatchTemplate} className="w-full">
                                <Send className="mr-2 h-4 w-4" />
                                Download Dispatch Template
                            </Button>
                            {mappedDispatchData && (
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center justify-between">
                                        <span>Data Preview</span>
                                        {mappedDispatchData.mappingConfidence && <Badge>Confidence: {mappedDispatchData.mappingConfidence}%</Badge>}
                                    </h3>
                                    <div className="max-h-60 overflow-auto border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {Object.keys(mappedDispatchData.mappedData[0]).map(key => <TableHead key={key}>{key}</TableHead>)}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mappedDispatchData.mappedData.slice(0, 5).map((row, index) => (
                                                <TableRow key={index}>
                                                    {Object.values(row).map((val, i) => <TableCell key={i}>{val}</TableCell>)}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={!mappedDispatchData}>Confirm & Save {mappedDispatchData?.mappedData.length} Dispatches</Button>
                        </CardFooter>
                    </Card>

                </div>

                <div className="space-y-6">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Fleet Summary</CardTitle>
                            <CardDescription>An overview of the current vehicle fleet status.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 rounded-lg bg-secondary">
                                    <Car className="mx-auto h-8 w-8 text-primary" />
                                    <p className="text-2xl font-bold mt-2">{totalVehicles}</p>
                                    <p className="text-sm text-muted-foreground">Total Vehicles</p>
                                </div>
                                <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <CircleCheck className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
                                    <p className="text-2xl font-bold mt-2">{availableVehicles}</p>
                                    <p className="text-sm text-green-700 dark:text-green-300">Available</p>
                                </div>
                                <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                                    <Car className="mx-auto h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                                    <p className="text-2xl font-bold mt-2">{inUseVehicles}</p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">In Use</p>
                                </div>
                                <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30">
                                    <Wrench className="mx-auto h-8 w-8 text-red-600 dark:text-red-400" />
                                    <p className="text-2xl font-bold mt-2">{maintenanceVehicles}</p>
                                    <p className="text-sm text-red-700 dark:text-red-300">Maintenance</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Export Data</CardTitle>
                            <CardDescription>Download dispatch sheets and reports.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export Today's Dispatch Sheet
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">OTP Verification Tool</CardTitle>
                            <CardDescription>Verify staff without managed email accounts.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row items-center gap-2">
                            <Input placeholder="Enter Staff ID or Phone Number" />
                            <Button variant="outline" className="w-full sm:w-auto">
                                <KeyRound className="mr-2 h-4 w-4" />
                                Send OTP
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthLayout>
    );
}
