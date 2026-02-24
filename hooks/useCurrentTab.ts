import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React Hook to get the current active tab's information.
 * @returns {chrome.tabs.Tab | null | undefined} The current active tab object, null if not found, or undefined if loading.
 */
export default function useCurrentTab() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null | undefined>(undefined);

  const fetchCurrentTab = useCallback(async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      setCurrentTab(tab || null);
    } catch (error) {
      console.error('Choice Point: Error fetching current tab:', error);
      setCurrentTab(null);
    }
  }, []);

  useEffect(() => {
    fetchCurrentTab();

    const handleActivated = () => fetchCurrentTab();
    const handleUpdated = (_tabId: number, changeInfo: chrome.tabs.OnUpdatedInfo) => {
      if (changeInfo.status === 'complete' || changeInfo.url) {
        fetchCurrentTab();
      }
    };

    chrome.tabs.onActivated.addListener(handleActivated);
    chrome.tabs.onUpdated.addListener(handleUpdated);

    return () => {
      chrome.tabs.onActivated.removeListener(handleActivated);
      chrome.tabs.onUpdated.removeListener(handleUpdated);
    };
  }, [fetchCurrentTab]);

  return currentTab;
}
