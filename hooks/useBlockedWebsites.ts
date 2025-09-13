import { useState, useEffect } from 'react';
import { isValidUrl } from '~/utils/validation';
import { BlockedWebsite } from "~/utils/types";
import useFeedback from "~/hooks/useFeedback";

/**
 * Custom React Hook for managing blocked websites.
 * It handles loading, adding, and removing websites from Chrome storage,
 * and provides feedback messages for these operations.
 * @returns {{blockedWebsites: BlockedWebsite[], feedback: {text: string, type: 'success' | 'error'} | null, addWebsite: (websiteToAdd: string) => Promise<BlockedWebsite | null>, removeWebsite: (uuidToRemove: string) => Promise<void>}}
 * An object containing the list of blocked websites, feedback state, and functions to add/remove websites.
 */
export default function useBlockedWebsites() {
    const [blockedWebsites, setBlockedWebsites] = useState<BlockedWebsite[]>([]);
    const { feedback, showFeedback } = useFeedback();

    useEffect(() => {
        /**
         * Loads blocked websites from Chrome storage.
         * @returns {Promise<void>}
         */
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
        /**
         * Handles changes in Chrome storage and updates the local state.
         * @param {object} changes - The changes in storage.
         * @param {string} namespace - The storage area (e.g., 'sync', 'local').
         * @returns {void}
         */
        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, namespace: string) => {
            if (namespace === 'sync' && changes.blockedWebsites) {
                setBlockedWebsites(changes.blockedWebsites.newValue || []);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };

    }, []);

    /**
     * Adds a new website to the blocked list.
     * @param {string} websiteToAdd - The URL of the website to add.
     * @returns {Promise<BlockedWebsite | null>} The added website object if successful, otherwise null.
     */
    const addWebsite = async (websiteToAdd: string): Promise<BlockedWebsite | null> => {
        const websiteUrl = websiteToAdd.trim();
        if (!websiteUrl) {
            return null;
        }

        if (!isValidUrl(websiteUrl)) {
            showFeedback('Please enter a valid URL (e.g., example.com)', true);
            return null;
        }

        try {
            const result = await chrome.storage.sync.get(['blockedWebsites']);
            const currentWebsites: BlockedWebsite[] = result.blockedWebsites || [];
            const exists = currentWebsites.some(item => item.url === websiteUrl);

            if (!exists) {
                const newWebsite: BlockedWebsite = { uuid: crypto.randomUUID(), url: websiteUrl };
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
    };

    /**
     * Removes a website from the blocked list.
     * @param {string} uuidToRemove - The UUID of the website to remove.
     * @returns {Promise<void>}
     */
    const removeWebsite = async (uuidToRemove: string): Promise<void> => {
        try {
            const result = await chrome.storage.sync.get(['blockedWebsites']);
            const currentWebsites: BlockedWebsite[] = result.blockedWebsites || [];
            const newWebsites = currentWebsites.filter(item => item.uuid !== uuidToRemove);
            await chrome.storage.sync.set({ blockedWebsites: newWebsites });
            showFeedback('Website removed successfully!');
        } catch (error) {
            console.error('Choice Point: Error removing website:', error);
            showFeedback('Error removing website.', true);
        }
    };

    return { blockedWebsites, feedback, addWebsite, removeWebsite };
}
