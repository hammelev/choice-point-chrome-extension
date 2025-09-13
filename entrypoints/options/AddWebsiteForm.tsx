import React, { useState } from 'react';
import { BlockedWebsite } from '~/utils/types';

interface AddWebsiteFormProps {
  /**
   * Callback function to add a new website.
   * @param {string} websiteUrl - The URL of the website to add.
   * @returns {Promise<BlockedWebsite | null>} A promise that resolves with the added website object or null if unsuccessful.
   */
  onAddWebsite: (websiteUrl: string) => Promise<BlockedWebsite | null>;
}

/**
 * React component for adding new websites to the blocked list.
 * It provides an input field and a button to submit the website URL.
 */
const AddWebsiteForm: React.FC<AddWebsiteFormProps> = ({ onAddWebsite }) => {
  const [newWebsiteToBlock, setNewWebsiteToBlock] = useState<string>('');

  /**
   * Handles the form submission event.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newWebsiteToBlock.trim()) {
      const addedWebsite = await onAddWebsite(newWebsiteToBlock);
      if (addedWebsite) {
        setNewWebsiteToBlock(''); // Clear input after successful submission
      }
    }
  };

  return (
    <form className="input-section" onSubmit={handleSubmit}>
      <input
        type="text"
        id="websiteInput"
        placeholder="example.com"
        value={newWebsiteToBlock}
        onChange={(e) => setNewWebsiteToBlock(e.target.value)}
      />
      <button type="submit" id="addWebsite">Add Website</button>
    </form>
  );
};

export default AddWebsiteForm;
