import { delay } from '../utils/apiHandler';
import { useEmployeeStore, Employee } from '../store/useEmployeeStore';

export const EmployeeService = {
    getAll: async () => {
        await delay(800);
        return useEmployeeStore.getState().employees;
    },

    getById: async (id: string) => {
        await delay(500);
        return useEmployeeStore.getState().employees.find(e => e.id === id);
    },

    create: async (data: Employee) => {
        await delay(1000);
        useEmployeeStore.getState().addEmployee(data);
        return data;
    },

    update: async (id: string, data: Partial<Employee>) => {
        await delay(1000);
        useEmployeeStore.getState().updateEmployee(id, data);
        return { id, ...data };
    }
};
