import React from 'react';
import { BlockedWebsite } from '~/utils/types';

interface BlockedWebsitesListProps {
  websites: BlockedWebsite[];
  onRemoveWebsite: (urlToRemove: string, uuidToRemove: string) => void;
}

const BlockedWebsitesList: React.FC<BlockedWebsitesListProps> = ({ websites, onRemoveWebsite }) => {
  return (
    <ul id="blockedWebsitesList">
      {websites.map(website => (
        <li key={website.uuid}>
          {website.url}
          <button
            className="remove-btn"
            onClick={() => onRemoveWebsite(website.url, website.uuid)}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default BlockedWebsitesList;
