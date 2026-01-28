"use client";

import { useEffect, useState } from "react";
import {
    Users,
    UserCheck,
    Briefcase,
    CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmployeeService } from "@/services/employees";
import { AttendanceService } from "@/services/attendance";
import { LeaveService } from "@/services/leave";
import { PayrollService } from "@/services/payroll";
import { useUserStore } from "@/store/useUserStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardPage() {
    const { user } = useUserStore();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        onLeave: 0,
        payrollPending: 0
    });

    const [employeeStats, setEmployeeStats] = useState({
        attendance: 0,
        leaveBalance: 0,
        nextHoliday: 'None'
    });

    const [loading, setLoading] = useState(true);

    // Mock data for charts
    const attendanceData = [
        { name: 'Mon', present: 40, absent: 2, late: 1 },
        { name: 'Tue', present: 38, absent: 4, late: 3 },
        { name: 'Wed', present: 41, absent: 1, late: 2 },
        { name: 'Thu', present: 39, absent: 3, late: 1 },
        { name: 'Fri', present: 42, absent: 0, late: 1 },
    ];

    const departmentData = [
        { name: 'Engineering', value: 12 },
        { name: 'HR', value: 4 },
        { name: 'Sales', value: 8 },
        { name: 'Marketing', value: 5 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (user?.role === 'admin') {
                    const [employees, attendance, leaves, payroll] = await Promise.all([
                        EmployeeService.getAll(),
                        AttendanceService.getRecords(),
                        LeaveService.getRequests(),
                        PayrollService.getAll()
                    ]);

                    setStats({
                        totalEmployees: employees.length,
                        presentToday: attendance.filter(r => r.status === 'Present').length,
                        onLeave: leaves.filter(r => r.status === 'Approved').length,
                        payrollPending: payroll.filter(r => r.status !== 'Paid').length
                    });
                } else {
                    // Fetch individual employee stats
                    // Mocking individual stats for now
                    setEmployeeStats({
                        attendance: 95,
                        leaveBalance: 12,
                        nextHoliday: 'Christmas (25 Dec)'
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    if (loading) return <div className="p-8 text-center text-zinc-500">Loading Dashboard...</div>;

    if (user?.role === 'employee') {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Hello, {user?.name.split(' ')[0]} 👋
                    </h1>
                    <p className="text-zinc-500">Here is your daily activity overview</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Attendance Rate</CardTitle>
                            <UserCheck className="h-4 w-4 text-zinc-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{employeeStats.attendance}%</div>
                            <p className="text-xs text-zinc-500 mt-1">Current Month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Leave Balance</CardTitle>
                            <Briefcase className="h-4 w-4 text-zinc-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{employeeStats.leaveBalance} Days</div>
                            <p className="text-xs text-zinc-500 mt-1">Annual Leave Remaining</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Next Holiday</CardTitle>
                            <Briefcase className="h-4 w-4 text-zinc-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold truncate">{employeeStats.nextHoliday}</div>
                            <p className="text-xs text-zinc-500 mt-1">Upcoming</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-center">
                            <p className="font-medium text-zinc-900 dark:text-white">Check In</p>
                            <p className="text-xs text-zinc-500">Mark your attendance</p>
                        </div>
                        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-center">
                            <p className="font-medium text-zinc-900 dark:text-white">Request Leave</p>
                            <p className="text-xs text-zinc-500">Apply for time off</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Dashboard Overview
            </h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                        <p className="text-xs text-zinc-500 mt-1">+2 from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Present Today</CardTitle>
                        <UserCheck className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.presentToday}</div>
                        <p className="text-xs text-zinc-500 mt-1">92% Average attendance</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">On Leave</CardTitle>
                        <Briefcase className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.onLeave}</div>
                        <p className="text-xs text-zinc-500 mt-1">Approved leaves for today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Payroll Pending</CardTitle>
                        <CreditCard className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">{stats.payrollPending}</div>
                        <p className="text-xs text-zinc-500 mt-1">Records need processing</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Attendance Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#71717a"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#71717a"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f4f4f5' }}
                                    contentStyle={{ borderRadius: '6px', border: '1px solid #e4e4e7', boxShadow: 'none' }}
                                />
                                <Bar dataKey="present" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-zinc-900 dark:fill-zinc-50" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Employee Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={departmentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {departmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
                            {departmentData.map((d, i) => (
                                <div key={d.name} className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    {d.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
