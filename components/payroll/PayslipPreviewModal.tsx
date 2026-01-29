"use client";

import { X, Download, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PayslipPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string | null;
    onDownload: () => void;
    title?: string;
}

export function PayslipPreviewModal({ isOpen, onClose, pdfUrl, onDownload, title = "Payslip Preview" }: PayslipPreviewModalProps) {
    if (!isOpen || !pdfUrl) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <MonitorPlay className="h-5 w-5 text-zinc-500" />
                        {title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button onClick={onDownload} size="sm">
                            <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 bg-gray-100 dark:bg-zinc-950 p-4 overflow-hidden relative">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full rounded shadow-sm border border-gray-200 dark:border-zinc-800 bg-white"
                        title="PDF Preview"
                    />
                </div>
            </div>
        </div>
    );
}
