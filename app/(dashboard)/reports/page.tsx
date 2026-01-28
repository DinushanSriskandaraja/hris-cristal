"use client";

import { useState } from "react";
import { FileText, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Select } from "@/components/ui/Select";
import { useReportStore } from "@/store/useReportStore";
import { ReportService } from "@/services/reports";
import { useToastStore } from "@/components/ui/Toaster";

export default function ReportsPage() {
    const { recentReports, generateReport } = useReportStore();
    const { addToast } = useToastStore();
    const [downloading, setDownloading] = useState("");

    const handleGenerate = (type: any, format: any) => {
        generateReport(type, format);
        addToast("success", `Generated new ${type} report`);
    };

    const handleDownload = async (id: string) => {
        setDownloading(id);
        try {
            await ReportService.download(id);
            addToast("success", "Report downloaded successfully");
        } catch (error) {
            addToast("error", "Failed to download report");
        } finally {
            setDownloading("");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {['Attendance', 'Payroll', 'Employee', 'Leave'].map((type) => (
                    <Card key={type} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleGenerate(type, 'PDF')}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Generate {type}</CardTitle>
                            <FileText className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-gray-500 mt-2">Click to generate PDF</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Reports</CardTitle>
                            <CardDescription>History of generated reports</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Generated On</TableHead>
                                <TableHead>Format</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        {report.name}
                                    </TableCell>
                                    <TableCell>{report.type}</TableCell>
                                    <TableCell>{report.generatedOn}</TableCell>
                                    <TableCell>{report.format}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDownload(report.id)}
                                            isLoading={downloading === report.id}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
