/**
 * Validates if a given string is a syntactically correct URL.
 * It prepends 'http://' to allow validation of URLs without a protocol.
 * @param {string} url - The URL string to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(`http://${url}`);
        return true;
    } catch (_) {
        return false;
    }
};