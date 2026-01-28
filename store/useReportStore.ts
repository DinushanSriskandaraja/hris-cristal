import { create } from 'zustand';

export interface ReportConfig {
    id: string;
    name: string;
    type: 'Employee' | 'Attendance' | 'Payroll' | 'Leave';
    generatedOn: string;
    format: 'PDF' | 'CSV';
}

interface ReportState {
    recentReports: ReportConfig[];
    generateReport: (type: ReportConfig['type'], format: ReportConfig['format']) => void;
}

export const useReportStore = create<ReportState>((set) => ({
    recentReports: [
        { id: '1', name: 'Monthly Attendance Oct 2023', type: 'Attendance', generatedOn: '2023-11-01', format: 'PDF' },
        { id: '2', name: 'Q3 Payroll Summary', type: 'Payroll', generatedOn: '2023-10-15', format: 'CSV' },
    ],
    generateReport: (type, format) => {
        const newReport: ReportConfig = {
            id: Math.random().toString(36).substr(2, 9),
            name: `New ${type} Report`,
            type,
            generatedOn: new Date().toISOString().split('T')[0],
            format
        };
        set((state) => ({ recentReports: [newReport, ...state.recentReports] }));
    },
}));
