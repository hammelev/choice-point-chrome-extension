import { useState, useEffect } from 'react';

/**
 * Custom React Hook to get the current active tab's information.
 * @returns {chrome.tabs.Tab | null} The current active tab object or null if not yet available.
 */
export default function useCurrentTab() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    const fetchCurrentTab = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        setCurrentTab(tab || null);
      } catch (error) {
        console.error('Choice Point: Error fetching current tab:', error);
      }
    };

    fetchCurrentTab();
  }, []);

  return currentTab;
}
