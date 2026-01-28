// Simulating API delays
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiHandler = async <T>(
    request: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void
) => {
    try {
        const data = await request();
        if (onSuccess) onSuccess(data);
        return { data, error: null };
    } catch (error) {
        console.error("API Error:", error);
        if (onError) onError(error);
        return { data: null, error };
    }
};
