"use client";

import { useEffect, useState } from "react";
import { Download, PlayCircle, Settings, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { usePayrollStore, PayrollRecord } from "@/store/usePayrollStore";
import { PayrollService } from "@/services/payroll";
import { STATUS_COLORS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { useToastStore } from "@/components/ui/Toaster";
import { DeductionManager } from "@/components/payroll/DeductionManager";
import { useUserStore } from "@/store/useUserStore";
import { PDFGenerator } from "@/utils/pdfGenerator";
import { PayslipPreviewModal } from "@/components/payroll/PayslipPreviewModal";

export default function PayrollPage() {
    const { records, generatePayroll, markAsPaid } = usePayrollStore();
    const { user } = useUserStore();
    const { addToast } = useToastStore();
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [view, setView] = useState<'history' | 'deductions'>('history');

    // Preview Modal State
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);

    const handleRunPayroll = async () => {
        setProcessing(true);
        try {
            await PayrollService.runPayroll("November", 2023);
            addToast("success", "Payroll processed successfully for November 2023");
        } catch (error) {
            addToast("error", "Failed to process payroll");
        } finally {
            setProcessing(false);
        }
    };

    const handleMarkAsPaid = async (id: string) => {
        markAsPaid(id);
        addToast("success", "Marked as paid");
    };

    const handlePreviewPayslip = (record: PayrollRecord) => {
        const url = PDFGenerator.generatePayslip(record, true);
        if (typeof url === 'string') {
            setPreviewUrl(url);
            setSelectedRecord(record);
            setPreviewOpen(true);
        }
    };

    const handleDownloadPayslip = (record: PayrollRecord) => {
        PDFGenerator.generatePayslip(record, false);
        addToast("success", "Payslip downloaded");
    };

    const displayRecords = user?.role === 'employee'
        ? records.filter(r => r.employeeName === user.name)
        : records;

    const dummyReport = () => { /* Placeholder for future use */ };

    return (
        <div className="space-y-6">
            <PayslipPreviewModal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                pdfUrl={previewUrl}
                onDownload={() => selectedRecord && handleDownloadPayslip(selectedRecord)}
                title={selectedRecord ? `Payslip: ${selectedRecord.employeeName}` : 'Payslip Preview'}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {user?.role === 'employee' ? 'My Payslips' : 'Payroll Management'}
                    </h1>
                    <p className="text-muted-foreground">
                        {user?.role === 'employee' ? 'View and download your salary slips' : 'Manage salaries, deductions, and payments'}
                    </p>
                </div>
                {user?.role === 'admin' && (
                    <div className="flex gap-2">
                        <div className="bg-secondary p-1 rounded-md flex">
                            <Button
                                variant={view === 'history' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setView('history')}
                                className="h-8"
                            >
                                <FileText className="mr-2 h-3.5 w-3.5" /> History
                            </Button>
                            <Button
                                variant={view === 'deductions' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setView('deductions')}
                                className="h-8"
                            >
                                <Settings className="mr-2 h-3.5 w-3.5" /> Deductions
                            </Button>
                        </div>

                        {view === 'history' && (
                            <Button onClick={handleRunPayroll} isLoading={processing} size="sm">
                                <PlayCircle className="mr-2 h-4 w-4" /> Run Payroll
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {view === 'deductions' && user?.role === 'admin' ? (
                <DeductionManager />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>{user?.role === 'employee' ? 'Salary History' : 'Payroll History'}</CardTitle>
                        <CardDescription>View all processed payroll records</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Month/Year</TableHead>
                                    {user?.role === 'admin' && <TableHead>Employee</TableHead>}
                                    <TableHead>Basic Salary</TableHead>
                                    <TableHead>Net Salary</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.month} {record.year}</TableCell>
                                        {user?.role === 'admin' && <TableCell>{record.employeeName}</TableCell>}
                                        <TableCell>${record.basicSalary.toLocaleString()}</TableCell>
                                        <TableCell className="font-bold">${record.netSalary.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge className={cn("bg-opacity-20 text-opacity-100", STATUS_COLORS[record.status])}>
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{record.paymentDate || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            {user?.role === 'admin' && record.status !== 'Paid' && (
                                                <Button variant="ghost" size="sm" onClick={() => handleMarkAsPaid(record.id)}>
                                                    Mark Paid
                                                </Button>
                                            )}
                                            {record.status === 'Paid' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handlePreviewPayslip(record)} title="Preview">
                                                        <Eye className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDownloadPayslip(record)} title="Download">
                                                        <Download className="h-4 w-4 text-green-500" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {displayRecords.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={user?.role === 'admin' ? 7 : 6} className="h-24 text-center">No payroll records found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
