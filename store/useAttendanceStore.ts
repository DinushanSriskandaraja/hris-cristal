import { create } from 'zustand';

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    checkIn: string;
    checkOut?: string;
    status: 'Present' | 'Absent' | 'Late' | 'Half Day';
    totalHours?: number;
}

interface AttendanceState {
    records: AttendanceRecord[];
    isCheckedIn: boolean;
    checkInTime: string | null;
    checkIn: () => void;
    checkOut: () => void;
}

const initialRecords: AttendanceRecord[] = [
    {
        id: 'ATT001',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        date: '2023-10-25',
        checkIn: '09:00 AM',
        checkOut: '05:00 PM',
        status: 'Present',
        totalHours: 8
    },
    {
        id: 'ATT002',
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        date: '2023-10-25',
        checkIn: '09:15 AM',
        checkOut: '05:15 PM',
        status: 'Present',
        totalHours: 8
    }
];

export const useAttendanceStore = create<AttendanceState>((set) => ({
    records: initialRecords,
    isCheckedIn: false,
    checkInTime: null,
    checkIn: () => set({ isCheckedIn: true, checkInTime: new Date().toLocaleTimeString() }),
    checkOut: () => set({ isCheckedIn: false, checkInTime: null }),
}));
