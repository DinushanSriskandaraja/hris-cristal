"use client";

import { create } from 'zustand';
import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
}

interface ToastState {
    toasts: Toast[];
    addToast: (type: Toast['type'], message: string) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (type, message) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
        }, 3000); // Auto remove after 3s
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function Toaster() {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 shadow-lg min-w-[300px] animate-in slide-in-from-right-full",
                        toast.type === 'success' && "bg-white border-green-200 text-green-800",
                        toast.type === 'error' && "bg-white border-red-200 text-red-800",
                        toast.type === 'info' && "bg-white border-blue-200 text-blue-800",
                    )}
                >
                    {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
                    {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
                    {toast.type === 'info' && <Info className="h-5 w-5" />}

                    <p className="flex-1 text-sm font-medium">{toast.message}</p>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-gray-500 hover:text-gray-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
