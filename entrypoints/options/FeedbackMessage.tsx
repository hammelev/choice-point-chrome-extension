import React from 'react';

interface FeedbackMessageProps {
  /**
   * The feedback message object, containing text and type (success/error).
   * Null if no message is to be displayed.
   */
  message: { text: string; type: 'success' | 'error' } | null;
}

/**
 * React component for displaying a temporary feedback message.
 * The message color changes based on its type (success or error).
 */
const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <span
      id="feedbackMessage"
      style={{
        color: message.type === 'error' ? 'red' : 'green',
      }}
    >
      {message.text}
    </span>
  );
};

export default FeedbackMessage;
