import React from 'react';
import { BlockedWebsite } from '~/utils/types';

interface BlockedWebsitesListProps {
  /**
   * The array of blocked websites to display.
   */
  websites: BlockedWebsite[];
  /**
   * Callback function to remove a website from the blocked list.
   * @param {string} urlToRemove - The URL of the website to remove.
   * @param {string} uuidToRemove - The UUID of the website to remove.
   */
  onRemoveWebsite: (urlToRemove: string, uuidToRemove: string) => void;
}

/**
 * React component for displaying a list of blocked websites.
 * Each item includes the website URL and a button to remove it.
 */
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
