"use client";

import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { useDeductionStore, DeductionType } from "@/store/useDeductionStore";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { useToastStore } from "@/components/ui/Toaster";

export function DeductionManager() {
    const { deductions, addDeduction, removeDeduction, updateDeduction } = useDeductionStore();
    const { addToast } = useToastStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState<Partial<DeductionType>>({
        name: "",
        type: "fixed",
        value: 0,
        isDefault: false,
        isActive: true
    });

    const handleAdd = () => {
        if (!newItem.name || !newItem.value) {
            addToast("error", "Name and Value are required");
            return;
        }

        addDeduction({
            name: newItem.name,
            type: newItem.type as 'percentage' | 'fixed',
            value: Number(newItem.value),
            isDefault: false,
            isActive: true
        });

        setNewItem({ name: "", type: "fixed", value: 0, isDefault: false, isActive: true });
        setIsAdding(false);
        addToast("success", "Deduction added successfully");
    };

    const handleDelete = (id: string, isDefault: boolean) => {
        if (isDefault) {
            addToast("error", "Cannot delete default deductions");
            return;
        }
        removeDeduction(id);
        addToast("success", "Deduction removed");
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Deduction Settings</CardTitle>
                    <CardDescription>Manage standard and custom deductions</CardDescription>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} variant="outline" size="sm">
                    {isAdding ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {isAdding ? 'Cancel' : 'Add Deduction'}
                </Button>
            </CardHeader>
            <CardContent>
                {isAdding && (
                    <div className="mb-6 p-4 border rounded-md bg-secondary/20 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="e.g. Welfare"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    value={newItem.type}
                                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'percentage' | 'fixed' })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="fixed">Fixed Amount</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Value</label>
                                <input
                                    type="number"
                                    value={newItem.value}
                                    onChange={(e) => setNewItem({ ...newItem, value: Number(e.target.value) })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleAdd} size="sm">
                                <Save className="h-4 w-4 mr-2" /> Save Deduction
                            </Button>
                        </div>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deductions.map((deduction) => (
                            <TableRow key={deduction.id}>
                                <TableCell className="font-medium">
                                    {deduction.name}
                                    {deduction.isDefault && (
                                        <Badge variant="secondary" className="ml-2 text-xs">Default</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className="capitalize">{deduction.type}</span>
                                </TableCell>
                                <TableCell>
                                    {deduction.type === 'percentage' ? `${deduction.value}%` : `Rs. ${deduction.value.toLocaleString()}`}
                                </TableCell>
                                <TableCell>
                                    <Badge className={deduction.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800'}>
                                        {deduction.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {!deduction.isDefault && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(deduction.id, deduction.isDefault)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
