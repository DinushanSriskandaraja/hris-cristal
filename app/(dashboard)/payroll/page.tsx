"use client";

import { useEffect, useState } from "react";
import { Download, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { usePayrollStore } from "@/store/usePayrollStore";
import { PayrollService } from "@/services/payroll";
import { STATUS_COLORS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { useToastStore } from "@/components/ui/Toaster";

import { useUserStore } from "@/store/useUserStore";

export default function PayrollPage() {
    const { records, generatePayroll, markAsPaid } = usePayrollStore();
    const { user } = useUserStore();
    const { addToast } = useToastStore();
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

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

    const displayRecords = user?.role === 'employee'
        ? records.filter(r => r.employeeName === user.name)
        : records;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        {user?.role === 'employee' ? 'My Payslips' : 'Payroll Management'}
                    </h1>
                    <p className="text-zinc-500">
                        {user?.role === 'employee' ? 'View and download your salary slips' : 'Manage salaries and payments'}
                    </p>
                </div>
                {user?.role === 'admin' && (
                    <Button onClick={handleRunPayroll} isLoading={processing}>
                        <PlayCircle className="mr-2 h-4 w-4" /> Run Payroll
                    </Button>
                )}
            </div>

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
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
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
        </div>
    );
}
