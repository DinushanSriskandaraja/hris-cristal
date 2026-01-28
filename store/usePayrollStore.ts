import { create } from 'zustand';

export interface PayrollRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    month: string;
    year: number;
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: 'Draft' | 'Processed' | 'Paid';
    paymentDate?: string;
}

interface PayrollState {
    records: PayrollRecord[];
    generatePayroll: (month: string, year: number) => void;
    markAsPaid: (id: string) => void;
}

const initialPayroll: PayrollRecord[] = [
    {
        id: 'PAY001',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        month: 'October',
        year: 2023,
        basicSalary: 5000,
        allowances: 500,
        deductions: 200,
        netSalary: 5300,
        status: 'Paid',
        paymentDate: '2023-10-30'
    }
];

export const usePayrollStore = create<PayrollState>((set) => ({
    records: initialPayroll,
    generatePayroll: (month, year) => {
        // consistency check or mock generation logic
        console.log(`Generating payroll for ${month} ${year}`);
    },
    markAsPaid: (id) => set((state) => ({
        records: state.records.map((rec) => rec.id === id ? { ...rec, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] } : rec)
    })),
}));
