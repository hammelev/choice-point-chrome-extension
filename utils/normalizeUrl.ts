export const normalizeUrl = (url: string): string => {
  if (!url) return '';
  try {
    const fullUrl = url.includes('://') ? url : `https://${url}`;
    const urlObj = new URL(fullUrl);
    const host = urlObj.hostname.replace(/^www\./, '');
    const pathname = urlObj.pathname.replace(/\/$/, '');
    return host + pathname;
  } catch (e) {
    // Fallback for invalid URLs, which should have been caught by isValidUrl
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  }
};
