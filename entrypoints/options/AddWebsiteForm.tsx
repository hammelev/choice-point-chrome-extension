import React, { useState } from 'react';
import { BlockedWebsite } from '~/utils/types';

interface AddWebsiteFormProps {
  onAddWebsite: (websiteUrl: string) => Promise<BlockedWebsite | null>;
}

const AddWebsiteForm: React.FC<AddWebsiteFormProps> = ({ onAddWebsite }) => {
  const [newWebsiteToBlock, setNewWebsiteToBlock] = useState<string>('');

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
