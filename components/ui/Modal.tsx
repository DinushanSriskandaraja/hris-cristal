import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = "md"
}: ModalProps) {
    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className={cn(
                    "relative w-full rounded-lg bg-white shadow-lg animate-in zoom-in-95 duration-200",
                    sizes[size]
                )}
            >
                <div className="flex items-center justify-between border-b p-4">
                    <div>
                        {title && <h2 className="text-lg font-semibold">{title}</h2>}
                        {description && <p className="text-sm text-gray-500">{description}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                <div className="p-4">
                    {children}
                </div>

                {footer && (
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-lg">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
