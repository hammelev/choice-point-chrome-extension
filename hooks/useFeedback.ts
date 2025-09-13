import { useState, useEffect } from 'react';

/**
 * Custom React Hook for managing and displaying temporary feedback messages.
 * @returns {{feedback: {text: string, type: 'success' | 'error'} | null, showFeedback: (message: string, isError?: boolean) => void}}
 * An object containing the current feedback message and a function to display new messages.
 */
export default function useFeedback() {
    const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        // If there is a feedback message, set a timer
        if (feedback) {
            const timer = setTimeout(() => {
                setFeedback(null); // Clear the feedback message after 3 seconds
            }, 3000);

            // IMPORTANT: Return a cleanup function
            // This runs if the component unmounts or if feedback changes again
            return () => {
                clearTimeout(timer);
            };
        }
    }, [feedback]);

    /**
     * Displays a feedback message.
     * @param {string} message - The text content of the feedback message.
     * @param {boolean} [isError=false] - Whether the message indicates an error. Defaults to false.
     * @returns {void}
     */
    const showFeedback = (message: string, isError = false) => {
        setFeedback({ text: message, type: isError ? 'error' : 'success' });
    };

    return { feedback, showFeedback };
}
