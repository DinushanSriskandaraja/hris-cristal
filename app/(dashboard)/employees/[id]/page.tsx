"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Corrected import
import { ArrowLeft, Save } from "lucide-react"; // Import ArrowLeft
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useEmployeeStore, Employee } from "@/store/useEmployeeStore";
import { EmployeeService } from "@/services/employees";
import { useToastStore } from "@/components/ui/Toaster";
import { isRequired, isValidEmail } from "@/utils/validation"; // Import validation

// Because in Next.js 13+ App Router, params are passed to the page component props, 
// using useParams hook is also viable for client components inside [id].

export default function EmployeeDetailsPage() {
    const params = useParams();
    const router = useRouter(); // Use useRouter for navigation
    const id = params?.id as string;

    const { addToast } = useToastStore();
    const { updateEmployee, addEmployee, employees } = useEmployeeStore();

    const isNew = id === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<Employee>>({
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        department: "",
        status: "Active",
        joinDate: "",
        phone: "",
        address: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!isNew && id) {
            const fetchEmployee = async () => {
                try {
                    // Check store first or fetch
                    let emp = employees.find(e => e.id === id);
                    if (!emp) {
                        emp = await EmployeeService.getById(id);
                    }

                    if (emp) {
                        setFormData(emp);
                    } else {
                        addToast("error", "Employee not found");
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchEmployee();
        }
    }, [id, isNew, employees, addToast]); // Added dependencies

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!isRequired(formData.firstName)) newErrors.firstName = "First name is required";
        if (!isRequired(formData.lastName)) newErrors.lastName = "Last name is required";
        if (!isRequired(formData.email)) newErrors.email = "Email is required";
        else if (!isValidEmail(formData.email!)) newErrors.email = "Invalid email";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        try {
            if (isNew) {
                const newEmployee = { ...formData, id: `EMP${Math.floor(Math.random() * 1000)}` } as Employee;
                await EmployeeService.create(newEmployee);
                addToast("success", "Employee created successfully");
                router.push("/employees");
            } else {
                await EmployeeService.update(id, formData);
                addToast("success", "Employee updated successfully");
            }
        } catch (error) {
            addToast("error", "Failed to save employee");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isNew ? "New Employee" : `${formData.firstName} ${formData.lastName}`}
                        </h1>
                        <p className="text-gray-500">{isNew ? "Add a new employee" : "View and edit employee details"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSave} isLoading={saving}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                error={errors.firstName}
                            />
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                error={errors.lastName}
                            />
                        </div>
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            error={errors.email}
                        />
                        <Input
                            label="Phone"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <Input
                            label="Address"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Job Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Position"
                            value={formData.position}
                            onChange={e => setFormData({ ...formData, position: e.target.value })}
                        />
                        <Select
                            label="Department"
                            value={formData.department}
                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                            options={[
                                { label: "Engineering", value: "Engineering" },
                                { label: "Human Resources", value: "Human Resources" },
                                { label: "Sales", value: "Sales" },
                                { label: "Marketing", value: "Marketing" },
                                { label: "Finance", value: "Finance" },
                            ]}
                        />
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                            options={[
                                { label: "Active", value: "Active" },
                                { label: "Inactive", value: "Inactive" },
                                { label: "On Leave", value: "On Leave" },
                            ]}
                        />
                        <Input
                            label="Date Joined"
                            type="date"
                            value={formData.joinDate}
                            onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
