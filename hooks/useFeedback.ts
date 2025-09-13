import { useState, useEffect } from 'react';

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

    const showFeedback = (message: string, isError = false) => {
        setFeedback({ text: message, type: isError ? 'error' : 'success' });
    };

    return { feedback, showFeedback };
}