import { delay } from '../utils/apiHandler';
import { useAttendanceStore } from '../store/useAttendanceStore';

export const AttendanceService = {
    getRecords: async () => {
        await delay(700);
        return useAttendanceStore.getState().records;
    },

    checkIn: async () => {
        await delay(1000);
        useAttendanceStore.getState().checkIn();
        return { status: 'Checked In', time: new Date().toLocaleTimeString() };
    },

    checkOut: async () => {
        await delay(1000);
        useAttendanceStore.getState().checkOut();
        return { status: 'Checked Out', time: new Date().toLocaleTimeString() };
    }
};
