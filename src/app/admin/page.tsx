"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/auth-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, KeyRound, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { importVehicleDataFromCsv, ImportVehicleDataFromCsvOutput } from "@/ai/flows/import-vehicle-data-from-csv";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
    const { toast } = useToast();
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [mappedData, setMappedData] = useState<ImportVehicleDataFromCsvOutput | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setCsvFile(event.target.files[0]);
            setMappedData(null);
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
                toast({ title: "CSV Processed", description: "AI has mapped the data. Review and confirm." });
            } catch (error) {
                console.error("CSV import failed:", error);
                toast({ variant: "destructive", title: "Import Failed", description: "The AI could not process the CSV file." });
            } finally {
                setIsImporting(false);
            }
        };
    };

    return (
        <AuthLayout>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Import Vehicle Data</CardTitle>
                        <CardDescription>Upload a CSV with pre-registered vehicles. The AI will map columns automatically.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Input type="file" accept=".csv" onChange={handleFileChange} />
                            <Button onClick={handleImport} disabled={isImporting || !csvFile}>
                                {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            </Button>
                        </div>
                        {mappedData && (
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center justify-between">
                                    <span>Data Preview</span>
                                    <Badge>Confidence: {mappedData.mappingConfidence}%</Badge>
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

                <div className="space-y-6">
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
                        <CardContent className="flex items-center gap-2">
                            <Input placeholder="Enter Staff ID or Phone Number" />
                            <Button variant="outline">
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
