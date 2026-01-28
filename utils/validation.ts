export const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 number
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

export const isValidPhone = (phone: string) => {
    return /^\+?[\d\s-]{10,}$/.test(phone);
};

export const isRequired = (value: any) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    return true;
};
