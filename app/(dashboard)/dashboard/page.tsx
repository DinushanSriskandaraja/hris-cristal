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
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
                    Dashboard
                </h1>
                <p className="text-zinc-500">Overview of your organization's performance.</p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(180px,auto)]">

                {/* Stats - Top Row */}
                <Card className="col-span-12 md:col-span-3 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Total Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{stats.totalEmployees}</div>
                        <p className="text-xs text-zinc-500 mt-1">+2 from last month</p>
                    </CardContent>
                </Card>

                <Card className="col-span-12 md:col-span-3 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <UserCheck className="w-24 h-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Present Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{stats.presentToday}</div>
                        <p className="text-xs text-zinc-500 mt-1">92% Average attendance</p>
                    </CardContent>
                </Card>

                <Card className="col-span-12 md:col-span-3 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Briefcase className="w-24 h-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">On Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{stats.onLeave}</div>
                        <p className="text-xs text-zinc-500 mt-1">Approved leaves for today</p>
                    </CardContent>
                </Card>

                <Card className="col-span-12 md:col-span-3 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard className="w-24 h-24" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Payroll Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{stats.payrollPending}</div>
                        <p className="text-xs text-zinc-500 mt-1">Records need processing</p>
                    </CardContent>
                </Card>

                {/* Main Chart - Large Span */}
                <Card className="col-span-12 md:col-span-8 md:row-span-2">
                    <CardHeader>
                        <CardTitle>Attendance Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" strokeOpacity={0.5} />
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
                                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.9)' }}
                                />
                                <Bar dataKey="present" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#c084fc" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Secondary Chart & Quick Actions */}
                <Card className="col-span-12 md:col-span-4 md:row-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle>Employee Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={departmentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {departmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {departmentData.map((d, i) => (
                                <div key={d.name} className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full text-xs">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span className="font-medium">{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
