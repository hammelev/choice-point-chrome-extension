import useBlockedWebsites from "~/hooks/useBlockedWebsites";
import useCurrentTab from "~/hooks/useCurrentTab";
import { normalizeUrl } from "~/utils/normalizeUrl";

function App() {
  const { blockedWebsites, addWebsite, removeWebsite } = useBlockedWebsites();
  const currentTab = useCurrentTab();

  const currentUrl = currentTab?.url || '';
  const normalizedCurrentUrl = currentUrl ? normalizeUrl(currentUrl) : '';

  const isBlocked = blockedWebsites.some(site => site.url === normalizedCurrentUrl);
  const currentBlockedSite = blockedWebsites.find(site => site.url === normalizedCurrentUrl);

  const handleToggleBlock = async () => {
    if (isBlocked && currentBlockedSite) {
      await removeWebsite(currentBlockedSite.uuid);
    } else if (normalizedCurrentUrl) {
      await addWebsite(normalizedCurrentUrl);
    }
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const isBlockable = currentUrl && !currentUrl.startsWith('chrome://') && !currentUrl.startsWith('about:') && !currentUrl.startsWith('chrome-extension://');

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
