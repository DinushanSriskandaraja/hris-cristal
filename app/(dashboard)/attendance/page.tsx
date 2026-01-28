"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { useAttendanceStore } from "@/store/useAttendanceStore";
import { AttendanceService } from "@/services/attendance";
import { STATUS_COLORS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { useUserStore } from "@/store/useUserStore";
import { useToastStore } from "@/components/ui/Toaster";

export default function AttendancePage() {
    const { records, isCheckedIn, checkInTime, checkIn, checkOut } = useAttendanceStore();
    const { user } = useUserStore();
    const { addToast } = useToastStore();
    const [loading, setLoading] = useState(false);

    // Initial fetch could go here if implementing real data syncing

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            await AttendanceService.checkIn();
            addToast("success", "Checked in successfully!");
        } catch (error) {
            addToast("error", "Failed to check in");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setLoading(true);
        try {
            await AttendanceService.checkOut();
            addToast("success", "Checked out successfully!");
        } catch (error) {
            addToast("error", "Failed to check out");
        } finally {
            setLoading(false);
        }
    };

    // Filter records for employees
    const displayRecords = user?.role === 'employee'
        ? records.filter(r => r.employeeName === user.name)
        : records;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Attendance</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" /> Today's Action
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
                        <div className="text-4xl font-mono font-bold">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <p className="text-zinc-500">{format(new Date(), "EEEE, d MMMM yyyy")}</p>

                        {isCheckedIn ? (
                            <div className="text-center space-y-4">
                                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                                    Checked In at {checkInTime}
                                </div>
                                <Button onClick={handleCheckOut} isLoading={loading} variant="destructive" size="lg" className="w-48">
                                    Check Out
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={handleCheckIn} isLoading={loading} size="lg" className="w-48 bg-emerald-600 hover:bg-emerald-700 text-white">
                                Check In
                            </Button>
                        )}

                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-4">
                            <MapPin className="h-3 w-3" /> Location access active
                        </div>
                    </CardContent>
                </Card>

                {/* Only show Summary to Employees or maybe admins too? Let's show to both but personal stats for employee */}
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Working Days</span>
                            <span className="font-bold">22</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Present</span>
                            <span className="font-bold text-green-600">18</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Absent</span>
                            <span className="font-bold text-red-600">1</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                            <span className="text-zinc-600 dark:text-zinc-400">Late Arrivals</span>
                            <span className="font-bold text-yellow-600">3</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{user?.role === 'employee' ? 'My History' : 'Attendance Overview'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                {user?.role === 'admin' && <TableHead>Employee</TableHead>}
                                <TableHead>Check In</TableHead>
                                <TableHead>Check Out</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total Hours</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayRecords.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.date}</TableCell>
                                    {user?.role === 'admin' && <TableCell>{record.employeeName}</TableCell>}
                                    <TableCell>{record.checkIn}</TableCell>
                                    <TableCell>{record.checkOut || '-'}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("bg-opacity-20 text-opacity-100", STATUS_COLORS[record.status])}>
                                            {record.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{record.totalHours ? `${record.totalHours} hrs` : '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
