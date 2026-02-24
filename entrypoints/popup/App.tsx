import { useMemo, useCallback } from 'react';
import useBlockedWebsites from "~/hooks/useBlockedWebsites";
import useCurrentTab from "~/hooks/useCurrentTab";
import { normalizeUrl } from "~/utils/normalizeUrl";

function App() {
  const { blockedWebsites, addWebsite, removeWebsite } = useBlockedWebsites();
  const currentTab = useCurrentTab();

  const currentUrl = currentTab?.url || '';

  const normalizedCurrentUrl = useMemo(() =>
    currentUrl ? normalizeUrl(currentUrl) : ''
  , [currentUrl]);

  const currentBlockedSite = useMemo(() =>
    normalizedCurrentUrl ? blockedWebsites.find(site => site.url === normalizedCurrentUrl) : undefined
  , [blockedWebsites, normalizedCurrentUrl]);

  const isBlocked = !!currentBlockedSite;

  const handleToggleBlock = useCallback(async () => {
    if (isBlocked && currentBlockedSite) {
      await removeWebsite(currentBlockedSite.uuid);
    } else if (normalizedCurrentUrl) {
      await addWebsite(normalizedCurrentUrl);
    }
  }, [isBlocked, currentBlockedSite, normalizedCurrentUrl, removeWebsite, addWebsite]);

  const handleOpenOptions = useCallback(() => {
    chrome.runtime.openOptionsPage();
  }, []);

  const isBlockable = useMemo(() =>
    !!currentUrl &&
    !currentUrl.startsWith('chrome://') &&
    !currentUrl.startsWith('about:') &&
    !currentUrl.startsWith('chrome-extension://')
  , [currentUrl]);

  if (currentTab === undefined) {
    return (
      <div className="popup-container">
        <h1>Choice Point</h1>
        <div className="status-section">
          <p>Loading current tab...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <h1>Choice Point</h1>

      <div className="status-section">
        {isBlockable ? (
          <>
            <p className="current-url" title={currentUrl}>{normalizedCurrentUrl}</p>
            <button
              className={`action-btn ${isBlocked ? 'unblock-btn' : 'block-btn'}`}
              onClick={handleToggleBlock}
            >
              {isBlocked ? 'Unblock this site' : 'Block this site'}
            </button>
          </>
        ) : (
          <p>This page cannot be blocked.</p>
        )}
      </div>

      <div className="footer-section">
        <button className="options-btn" onClick={handleOpenOptions}>
          Open Options
        </button>
      </div>
    </div>
  );
}

export default App;
