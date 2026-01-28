import { delay } from '../utils/apiHandler';
import { useUserStore } from '../store/useUserStore';

export const AuthService = {
    login: async (email: string, password: string) => {
        await delay(1000); // Simulate network latency

        if (email === 'admin@company.com' && password === 'Admin123') {
            const user = {
                id: '1',
                name: 'Admin User',
                email,
                role: 'admin' as const,
                avatar: '/avatars/admin.png'
            };
            return { user, token: 'mock-admin-token' };
        }

        if (email === 'employee@company.com' && password === 'Employee123') {
            const user = {
                id: '2',
                name: 'John Doe',
                email,
                role: 'employee' as const,
                avatar: '/avatars/employee.png'
            };
            return { user, token: 'mock-employee-token' };
        }

        throw new Error('Invalid credentials');
    },

    logout: async () => {
        await delay(500);
        useUserStore.getState().logout();
    },

    resetPassword: async (email: string) => {
        await delay(1000);
        return { message: `Reset link sent to ${email}` };
    }
};
