import { delay } from '../utils/apiHandler';
import { usePayrollStore } from '../store/usePayrollStore';

export const PayrollService = {
    getAll: async () => {
        await delay(900);
        return usePayrollStore.getState().records;
    },

    runPayroll: async (month: string, year: number) => {
        await delay(2000); // expensive operation
        usePayrollStore.getState().generatePayroll(month, year);
        return { message: 'Payroll processed successfully' };
    }
};
