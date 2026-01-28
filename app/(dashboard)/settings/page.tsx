"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch"; // Need to create Switch or simulate it
import { APP_NAME, COMPANY_NAME } from "@/utils/constants";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure general system preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input label="Company Name" defaultValue={COMPANY_NAME} />
                    <Input label="Application Name" defaultValue={APP_NAME} />
                    <Select
                        label="Timezone"
                        options={[
                            { label: "(GMT-08:00) Pacific Time", value: "PST" },
                            { label: "(GMT-05:00) Eastern Time", value: "EST" },
                            { label: "(GMT+00:00) UTC", value: "UTC" },
                        ]}
                        defaultValue="UTC"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage system-wide notification settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-base font-medium">Email Notifications</label>
                            <p className="text-sm text-gray-500">Receive emails about new leave requests</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="text-base font-medium">Payroll Alerts</label>
                            <p className="text-sm text-gray-500">Get notified when payroll is due</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4" defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button>
                    <Save className="mr-2 h-4 w-4" /> Save all changes
                </Button>
            </div>
        </div>
    );
}
