"use client";

import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { User, Mail, Shield, Camera } from "lucide-react";

export default function ProfilePage() {
    const { user } = useUserStore();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-12 w-12 text-gray-400" />
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 rounded-full bg-black p-1.5 text-white hover:bg-gray-800">
                                <Camera className="h-3 w-3" />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold">{user?.name || 'Admin User'}</h2>
                        <p className="text-sm text-gray-500">{user?.role || 'Administrator'}</p>
                        <p className="text-xs text-gray-400 mt-1">{user?.email || 'admin@company.com'}</p>
                    </CardContent>
                </Card>

                {/* Details Form */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Input label="Display Name" defaultValue={user?.name || "Admin User"} />
                        </div>
                        <div className="grid gap-2">
                            <Input label="Email Address" defaultValue={user?.email || "admin@company.com"} disabled />
                            <p className="text-xs text-gray-500">Email cannot be changed.</p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password and security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="font-medium">Password</p>
                                <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                            </div>
                        </div>
                        <Button variant="outline">Change Password</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
