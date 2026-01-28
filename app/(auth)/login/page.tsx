"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUserStore } from "@/store/useUserStore";
import { AuthService } from "@/services/auth";
import { useToastStore } from "@/components/ui/Toaster";
import { isValidEmail, isRequired } from "@/utils/validation";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useUserStore();
    const { addToast } = useToastStore();

    const [email, setEmail] = useState("admin@company.com");
    const [password, setPassword] = useState("Admin123");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!isRequired(email)) newErrors.email = "Email is required";
        else if (!isValidEmail(email)) newErrors.email = "Invalid email format";

        if (!isRequired(password)) newErrors.password = "Password is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const { user, token } = await AuthService.login(email, password);
            login(user, token);
            addToast("success", "Successfully logged in!");
            router.push("/dashboard");
        } catch (error: any) {
            addToast("error", error.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-950 px-8 py-8 shadow-sm rounded-lg border border-zinc-200 dark:border-zinc-800 w-full">
            <div className="mb-8 text-center">
                <div className="mx-auto h-10 w-10 bg-zinc-900 dark:bg-white rounded-md flex items-center justify-center mb-4">
                    <span className="text-white dark:text-zinc-900 font-bold text-lg">C</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome Back</h2>
                <p className="mt-2 text-sm text-zinc-500">
                    Sign in to your account
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    placeholder="admin@company.com"
                />

                <div className="space-y-1">
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        placeholder="Admin123"
                    />
                    <div className="flex items-center justify-end">
                        <Link href="/password-reset" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button type="submit" className="w-full h-10" isLoading={loading}>
                    Sign in
                </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900">
                <div className="text-center">
                    <p className="text-xs text-zinc-500 mb-2">Demo Credentials</p>
                    <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">admin@company.com / Admin123</p>
                </div>
            </div>
        </div>
    );
}
