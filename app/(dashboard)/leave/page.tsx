"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { useLeaveStore, LeaveRequest } from "@/store/useLeaveStore";
import { LeaveService } from "@/services/leave";
import { STATUS_COLORS } from "@/utils/constants";
import { cn } from "@/utils/cn";
import { useToastStore } from "@/components/ui/Toaster";
import { isRequired } from "@/utils/validation";

import { useUserStore } from "@/store/useUserStore";

export default function LeavePage() {
    const { requests, balance, addRequest } = useLeaveStore();
    const { user } = useUserStore();
    const { addToast } = useToastStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: "Annual",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!isRequired(formData.startDate)) newErrors.startDate = "Start date is required";
        if (!isRequired(formData.endDate)) newErrors.endDate = "End date is required";
        if (!isRequired(formData.reason)) newErrors.reason = "Reason is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const newRequest: LeaveRequest = {
                id: `LR${Math.floor(Math.random() * 1000)}`,
                employeeId: user?.id || 'EMP001',
                employeeName: user?.name || 'Admin User',
                type: formData.type as any,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
                status: 'Pending',
                appliedOn: new Date().toISOString().split('T')[0]
            };

            await LeaveService.applyLeave(newRequest);
            addToast("success", "Leave request submitted successfully");
            setIsModalOpen(false);
            setFormData({ type: "Annual", startDate: "", endDate: "", reason: "" });
        } catch (error) {
            addToast("error", "Failed to submit leave request");
        } finally {
            setLoading(false);
        }
    };

    const displayRequests = user?.role === 'employee'
        ? requests.filter(r => r.employeeName === user.name)
        : requests;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Leave Management</h1>
                {user?.role === 'employee' && (
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Apply for Leave
                    </Button>
                )}
            </div>

            {user?.role === 'employee' && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Annual Leave</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{balance.annual} Days</div>
                            <p className="text-xs text-zinc-500">Remaining</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Sick Leave</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{balance.sick} Days</div>
                            <p className="text-xs text-zinc-500">Remaining</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-500">Casual Leave</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{balance.casual} Days</div>
                            <p className="text-xs text-zinc-500">Remaining</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{user?.role === 'employee' ? 'My Leave Requests' : 'Leave Approval Requests'}</CardTitle>
                    <CardDescription>
                        {user?.role === 'employee'
                            ? 'Track the status of your leave applications'
                            : 'Manage leave requests from employees'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {user?.role === 'admin' && <TableHead>Employee</TableHead>}
                                <TableHead>Type</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Applied On</TableHead>
                                <TableHead>Status</TableHead>
                                {user?.role === 'admin' && <TableHead className="text-right">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayRequests.map((req) => (
                                <TableRow key={req.id}>
                                    {user?.role === 'admin' && <TableCell className="font-medium">{req.employeeName}</TableCell>}
                                    <TableCell className="font-medium">{req.type}</TableCell>
                                    <TableCell>
                                        {req.startDate} to {req.endDate}
                                    </TableCell>
                                    <TableCell>{req.reason}</TableCell>
                                    <TableCell>{req.appliedOn}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("bg-opacity-20 text-opacity-100", STATUS_COLORS[req.status])}>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                    {user?.role === 'admin' && req.status === 'Pending' && (
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50">Approve</Button>
                                                <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">Reject</Button>
                                            </div>
                                        </TableCell>
                                    )}
                                    {user?.role === 'admin' && req.status !== 'Pending' && (
                                        <TableCell className="text-right text-zinc-400">
                                            -
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                            {displayRequests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={user?.role === 'admin' ? 7 : 5} className="h-24 text-center">No leave requests found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Apply for Leave"
                footer={
                    <>
                        <Button onClick={handleSubmit} isLoading={loading}>Submit Request</Button>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="mr-2">Cancel</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Select
                        label="Leave Type"
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        options={[
                            { label: "Annual", value: "Annual" },
                            { label: "Sick", value: "Sick" },
                            { label: "Casual", value: "Casual" },
                            { label: "Maternity", value: "Maternity" },
                        ]}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            error={errors.startDate}
                        />
                        <Input
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            error={errors.endDate}
                        />
                    </div>
                    <Input
                        label="Reason"
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        error={errors.reason}
                    />
                </div>
            </Modal>
        </div>
    );
}
