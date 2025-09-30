export const normalizeUrl = (url: string): string => {
  if (!url) return '';
  try {
    const fullUrl = url.includes('://') ? url : `https://${url}`;
    const urlObj = new URL(fullUrl);
    const host = urlObj.hostname.replace(/^www\./, '').replace(/\.$/, '');
    const pathname = urlObj.pathname.replace(/\/$/, '');
    return host + pathname;
  } catch (e) {
    // Fallback for invalid URLs, which should have been caught by isValidUrl.
    console.warn(`Unexpected error during URL normalization for \"${url}\". Returning original.`, e);
    return url;
  }
};
