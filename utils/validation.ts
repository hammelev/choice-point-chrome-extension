// URL validation function
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(`http://${url}`);
        return true;
    } catch (_) {
        return false;
    }
};