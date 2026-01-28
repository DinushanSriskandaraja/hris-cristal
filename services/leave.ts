import { delay } from '../utils/apiHandler';
import { useLeaveStore, LeaveRequest } from '../store/useLeaveStore';

export const LeaveService = {
    getRequests: async () => {
        await delay(600);
        return useLeaveStore.getState().requests;
    },

    applyLeave: async (request: LeaveRequest) => {
        await delay(1200);
        useLeaveStore.getState().addRequest(request);
        return request;
    },

    approveLeave: async (id: string) => {
        await delay(800);
        useLeaveStore.getState().updateStatus(id, 'Approved');
    },

    rejectLeave: async (id: string) => {
        await delay(800);
        useLeaveStore.getState().updateStatus(id, 'Rejected');
    }
};
