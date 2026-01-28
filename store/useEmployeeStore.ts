import { create } from 'zustand';

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    department: string;
    status: 'Active' | 'Inactive' | 'On Leave';
    joinDate: string;
    phone: string;
    address: string;
}

interface EmployeeState {
    employees: Employee[];
    selectedEmployee: Employee | null;
    isLoading: boolean;
    error: string | null;
    setEmployees: (employees: Employee[]) => void;
    addEmployee: (employee: Employee) => void;
    updateEmployee: (id: string, employee: Partial<Employee>) => void;
    setSelectedEmployee: (employee: Employee | null) => void;
}

// Mock initial data
const initialEmployees: Employee[] = [
    {
        id: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        position: 'Software Engineer',
        department: 'Engineering',
        status: 'Active',
        joinDate: '2023-01-15',
        phone: '+1234567890',
        address: '123 Tech St, Silicon Valley, CA'
    },
    {
        id: 'EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        position: 'HR Manager',
        department: 'Human Resources',
        status: 'Active',
        joinDate: '2022-11-01',
        phone: '+0987654321',
        address: '456 Corp Ave, New York, NY'
    }
];

export const useEmployeeStore = create<EmployeeState>((set) => ({
    employees: initialEmployees,
    selectedEmployee: null,
    isLoading: false,
    error: null,
    setEmployees: (employees) => set({ employees }),
    addEmployee: (employee) => set((state) => ({ employees: [...state.employees, employee] })),
    updateEmployee: (id, updated) => set((state) => ({
        employees: state.employees.map((emp) => emp.id === id ? { ...emp, ...updated } : emp)
    })),
    setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
}));
