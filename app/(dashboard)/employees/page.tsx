"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Employee, useEmployeeStore } from "@/store/useEmployeeStore";
import { EmployeeService } from "@/services/employees";
import { STATUS_COLORS } from "@/utils/constants";
import { cn } from "@/utils/cn";

export default function EmployeesPage() {
    const { employees, setEmployees } = useEmployeeStore();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await EmployeeService.getAll();
                setEmployees(data);
            } catch (error) {
                console.error("Failed to fetch employees", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, [setEmployees]);

    const filteredEmployees = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                    <p className="text-gray-500">Manage your workforce</p>
                </div>
                <Link href="/employees/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>All Employees</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search employees..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading employees...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                                    {employee.firstName[0]}{employee.lastName[0]}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{employee.firstName} {employee.lastName}</div>
                                                    <div className="text-xs text-gray-500">{employee.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{employee.position}</TableCell>
                                        <TableCell>{employee.department}</TableCell>
                                        <TableCell>
                                            <Badge className={cn("bg-opacity-20 text-opacity-100", STATUS_COLORS[employee.status])}>
                                                {employee.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{employee.joinDate}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/employees/${employee.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredEmployees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No employees found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
