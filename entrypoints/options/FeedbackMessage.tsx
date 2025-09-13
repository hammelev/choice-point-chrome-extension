import React from 'react';

interface FeedbackMessageProps {
  message: { text: string; type: 'success' | 'error' } | null;
}

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
