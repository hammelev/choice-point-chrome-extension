document.addEventListener('DOMContentLoaded', () => {
    const websiteInput = document.getElementById('websiteInput');
    const addWebsiteButton = document.getElementById('addWebsite');
    const blockedWebsitesList = document.getElementById('blockedWebsitesList');
    const feedbackMessage = document.getElementById('feedbackMessage');

    // Function to display feedback messages
    const showFeedback = (message, isError = false) => {
        feedbackMessage.textContent = message;
        feedbackMessage.style.color = isError ? 'red' : 'green';
        setTimeout(() => {
            feedbackMessage.textContent = '';
        }, 3000);
    };

    // URL validation function
    const isValidUrl = (string) => {
        try {
            new URL(`http://${string}`);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Load blocked websites from storage
    const loadBlockedWebsites = async () => {
        try {
            const result = await chrome.storage.sync.get(['blockedWebsites']);
            renderBlockedWebsites(result.blockedWebsites || []);
        } catch (error) {
            console.error('Choice Point: Error loading blocked websites:', error);
            showFeedback('Error loading blocked websites.', true);
        }
    };

    // Render blocked websites in the UI
    const renderBlockedWebsites = (websites) => {
        blockedWebsitesList.replaceChildren();
        websites.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item.url; // Display the URL

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-btn');
            removeButton.addEventListener('click', () => {
                if (confirm(`Are you sure you want to remove "${item.url}" from your blocked list?`)) {
                    removeWebsite(item.uuid); // Remove by UUID
                }
            });

            listItem.appendChild(removeButton);
            blockedWebsitesList.appendChild(listItem);
        });
    };

    // Add a new website
    const addWebsite = async () => {
        const websiteUrl = websiteInput.value.trim();
        if (websiteUrl) {
            if (!isValidUrl(websiteUrl)) {
                showFeedback('Please enter a valid URL (e.g., example.com)', true);
                return;
            }

            try {
                const result = await chrome.storage.sync.get(['blockedWebsites']);
                const currentWebsites = result.blockedWebsites || [];
                const exists = currentWebsites.some(item => item.url === websiteUrl);

                if (!exists) {
                    const newWebsite = { uuid: crypto.randomUUID(), url: websiteUrl };
                    const newWebsites = [...currentWebsites, newWebsite];
                    await chrome.storage.sync.set({ blockedWebsites: newWebsites });
                    websiteInput.value = '';
                    showFeedback('Website added successfully!');
                } else {
                    showFeedback('This website is already in your blocked list.', true);
                }
            } catch (error) {
                console.error('Choice Point: Error adding website:', error);
                showFeedback('Error adding website.', true);
            }
        }
    };

    // Remove a website
    const removeWebsite = async (uuidToRemove) => {
        try {
            const result = await chrome.storage.sync.get(['blockedWebsites']);
            const currentWebsites = result.blockedWebsites || [];
            const newWebsites = currentWebsites.filter(item => item.uuid !== uuidToRemove);
            await chrome.storage.sync.set({ blockedWebsites: newWebsites });
            showFeedback('Website removed successfully!');
        } catch (error) {
            console.error('Choice Point: Error removing website:', error);
            showFeedback('Error removing website.', true);
        }
    };

    // Event Listeners
    addWebsiteButton.addEventListener('click', addWebsite);
    websiteInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addWebsite();
        }
    });

    // Listen for changes from other tabs/devices and re-render
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync' && changes.blockedWebsites) {
            renderBlockedWebsites(changes.blockedWebsites.newValue || []);
        }
    });

    // Initial load
    loadBlockedWebsites();
});