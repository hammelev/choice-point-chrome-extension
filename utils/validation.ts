/**
 * Validates if a given string is a syntactically correct URL.
 * It prepends 'http://' to allow validation of URLs without a protocol.
 * @param {string} url - The URL string to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
export const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    try {
        const urlObj = new URL(url.includes('://') ? url : `http://${url}`);
        // Check if the hostname contains a dot, which is a good indicator of a valid domain.
        return urlObj.hostname.includes('.');
    } catch (_) {
        return false;
    }
};