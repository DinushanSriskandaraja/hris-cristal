import { delay } from '../utils/apiHandler';

export const NotificationService = {
    getAll: async () => {
        await delay(400);
        return [
            { id: '1', message: 'New leave request from John Doe', read: false },
            { id: '2', message: 'Payroll generated for October', read: true }
        ];
    },

    markAsRead: async (id: string) => {
        await delay(300);
        return { id, read: true };
    }
};
