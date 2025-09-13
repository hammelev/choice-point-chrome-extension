import { useState, useEffect } from 'react';
import { isValidUrl } from '~/utils/validation';
import { BlockedWebsite } from "~/utils/types";
import useFeedback from "~/hooks/useFeedback";


export default function useBlockedWebsites() {
    const [blockedWebsites, setBlockedWebsites] = useState<BlockedWebsite[]>([]);
    const { feedback, showFeedback } = useFeedback();

    useEffect(() => {
        const loadBlockedWebsites = async () => {
            try {
                const savedBlockedWebsites = await chrome.storage.sync.get(['blockedWebsites']);
                setBlockedWebsites(savedBlockedWebsites.blockedWebsites || []);
            } catch (error) {
                console.error('Choice Point: Error loading blocked websites:', error);
            }
        };

        loadBlockedWebsites();
    }, []);

    useEffect(() => {
        // 1. Define the function that will run when storage changes
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, namespace: string) => {
            if (namespace === 'sync' && changes.blockedWebsites) {
                // 2. Update the component's state with the new value
                // This will cause React to re-render automatically
                setBlockedWebsites(changes.blockedWebsites.newValue || []);
            }
        };

        // 3. Add the listener when the component mounts
        chrome.storage.onChanged.addListener(handleStorageChange);

        // 4. Return a cleanup function to remove the listener when the component unmounts
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };

    }, []);

    // Add a new website
    const addWebsite = async (websiteToAdd: string) => {
        const websiteUrl = websiteToAdd.trim();
        if (websiteUrl) {
            if (!isValidUrl(websiteUrl)) {
                showFeedback('Please enter a valid URL (e.g., example.com)', true);
                return null;
            }

            try {
                const result = await chrome.storage.sync.get(['blockedWebsites']);
                const currentWebsites: Array<{ uuid: string, url: string }> = result.blockedWebsites || [];
                const exists = currentWebsites.some(item => item.url === websiteUrl);

                if (!exists) {
                    const newWebsite = { uuid: crypto.randomUUID(), url: websiteUrl };
                    const newWebsites = [...currentWebsites, newWebsite];
                    await chrome.storage.sync.set({ blockedWebsites: newWebsites });
                    showFeedback('Website added successfully!');
                    return newWebsite;
                } else {
                    showFeedback('This website is already in your blocked list.', true);
                    return null;

                }
            } catch (error) {
                console.error('Choice Point: Error adding website:', error);
                showFeedback('Error adding website.', true);
                return null;

            }
        }
    };

    // Remove a website
    const removeWebsite = async (uuidToRemove: string) => {
        try {
            const result = await chrome.storage.sync.get(['blockedWebsites']);
            const currentWebsites: Array<{ uuid: string, url: string }> = result.blockedWebsites || [];
            const newWebsites = currentWebsites.filter(item => item.uuid !== uuidToRemove);
            await chrome.storage.sync.set({ blockedWebsites: newWebsites });
            showFeedback('Website removed successfully!');
            return newWebsites;

        } catch (error) {
            console.error('Choice Point: Error removing website:', error);
            showFeedback('Error removing website.', true);
            return null;
        }
    };

    return { blockedWebsites, feedback, addWebsite, removeWebsite };
}
