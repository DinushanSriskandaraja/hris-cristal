import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DeductionType {
    id: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number; // Percentage value (e.g., 8 for 8%) or Fixed amount (e.g., 500)
    isDefault: boolean; // Cannot be deleted if true
    isActive: boolean;
}

interface DeductionState {
    deductions: DeductionType[];
    addDeduction: (deduction: Omit<DeductionType, 'id'>) => void;
    updateDeduction: (id: string, deduction: Partial<DeductionType>) => void;
    removeDeduction: (id: string) => void;
}

const initialDeductions: DeductionType[] = [
    {
        id: 'epf-default',
        name: 'EPF (Employee Provident Fund)',
        type: 'percentage',
        value: 8,
        isDefault: true,
        isActive: true,
    },
    {
        id: 'etf-default',
        name: 'ETF (Employee Trust Fund)',
        type: 'percentage',
        value: 3,
        isDefault: true,
        isActive: true,
    }
];

export const useDeductionStore = create<DeductionState>()(
    persist(
        (set) => ({
            deductions: initialDeductions,
            addDeduction: (deduction) => set((state) => ({
                deductions: [
                    ...state.deductions,
                    { ...deduction, id: Math.random().toString(36).substr(2, 9) }
                ]
            })),
            updateDeduction: (id, updated) => set((state) => ({
                deductions: state.deductions.map(d => d.id === id ? { ...d, ...updated } : d)
            })),
            removeDeduction: (id) => set((state) => ({
                deductions: state.deductions.filter(d => d.id !== id || d.isDefault) // Prevent deleting defaults
            })),
        }),
        {
            name: 'deduction-store',
        }
    )
);
