import { create } from 'zustand';

export interface LeaveRequest {
    id: string;
    employeeId: string;
    employeeName: string;
    type: 'Annual' | 'Sick' | 'Casual' | 'Maternity';
    startDate: string;
    endDate: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    appliedOn: string;
}

interface LeaveState {
    requests: LeaveRequest[];
    balance: {
        annual: number;
        sick: number;
        casual: number;
    };
    addRequest: (request: LeaveRequest) => void;
    updateStatus: (id: string, status: LeaveRequest['status']) => void;
}

const initialRequests: LeaveRequest[] = [
    {
        id: 'LR001',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        type: 'Annual',
        startDate: '2023-11-01',
        endDate: '2023-11-05',
        reason: 'Family Vacation',
        status: 'Pending',
        appliedOn: '2023-10-20'
    }
];

export const useLeaveStore = create<LeaveState>((set) => ({
    requests: initialRequests,
    balance: {
        annual: 14,
        sick: 7,
        casual: 7
    },
    addRequest: (request) => set((state) => ({ requests: [request, ...state.requests] })),
    updateStatus: (id, status) => set((state) => ({
        requests: state.requests.map((req) => req.id === id ? { ...req, status } : req)
    })),
}));
