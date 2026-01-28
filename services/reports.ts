import { delay } from '../utils/apiHandler';
import { useReportStore } from '../store/useReportStore';

export const ReportService = {
    getRecent: async () => {
        await delay(500);
        return useReportStore.getState().recentReports;
    },

    download: async (id: string) => {
        await delay(1500);
        return { url: `/mock-downloads/report-${id}.pdf` };
    }
};
