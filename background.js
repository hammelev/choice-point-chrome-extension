const BLOCK_PAGE_URL = chrome.runtime.getURL('pages/block_page_hard.html');

// Define constants for storage keys to prevent typos and improve maintainability.
const STORAGE_KEYS = {
    BLOCKED_WEBSITES: 'blockedWebsites',
    UUID_TO_RULE_ID_MAP: 'uuidToRuleIdMap',
    NEXT_RULE_ID: 'nextRuleId'
};

/**
 * Creates a declarativeNetRequest rule object.
 * @param {number} id - The ID of the rule.
 * @param {string} url - The URL to block.
 * @returns {object} The declarativeNetRequest rule object.
 */
const createRuleObject = (id, url) => ({
    id,
    priority: 1,
    action: {
        type: 'redirect',
        redirect: { url: BLOCK_PAGE_URL }
    },
    condition: {
        urlFilter: `||${url}/`,
        resourceTypes: ['main_frame']
    }
});

/**
 * Fetches data from chrome.storage.
 * @returns {Promise<object>} A promise that resolves with the storage data.
 */
const getStorageData = async () => {
    try {
        const [syncData, localData] = await Promise.all([
            chrome.storage.sync.get(STORAGE_KEYS.BLOCKED_WEBSITES),
            chrome.storage.local.get([STORAGE_KEYS.UUID_TO_RULE_ID_MAP, STORAGE_KEYS.NEXT_RULE_ID])
        ]);
        return {
            desiredWebsites: syncData[STORAGE_KEYS.BLOCKED_WEBSITES] || [],
            oldUuidToRuleIdMap: localData[STORAGE_KEYS.UUID_TO_RULE_ID_MAP] || {},
            nextRuleId: localData[STORAGE_KEYS.NEXT_RULE_ID] || 1
        };
    } catch (error) {
        console.error("Choice Point: Error fetching storage data:", error);
        throw error;
    }
};

/**
 * Calculates the changes to the declarativeNetRequest rules.
 * @param {Array<object>} desiredWebsites - The desired list of blocked websites.
 * @param {object} oldUuidToRuleIdMap - The old mapping of UUIDs to rule IDs.
 * @param {number} nextRuleId - The next available rule ID.
 * @param {Set<number>} currentRuleIds - A set of the current rule IDs.
 * @returns {object} An object containing the rules to add, the rules to remove, the new UUID to rule ID map, and the next available rule ID.
 */
const calculateRuleChanges = (desiredWebsites, oldUuidToRuleIdMap, nextRuleId, currentRuleIds) => {
    const rulesToAdd = [];
    const newUuidToRuleIdMap = {};

    for (const website of desiredWebsites) {
        const ruleId = oldUuidToRuleIdMap[website.uuid] ?? nextRuleId++;
        newUuidToRuleIdMap[website.uuid] = ruleId;

        if (!currentRuleIds.has(ruleId)) {
            rulesToAdd.push(createRuleObject(ruleId, website.url));
        }
    }

    const newRuleIdSet = new Set(Object.values(newUuidToRuleIdMap));
    const ruleIdsToRemove = [...currentRuleIds.difference(newRuleIdSet)];

    return { rulesToAdd, ruleIdsToRemove, newUuidToRuleIdMap, nextRuleId };
};

/**
 * Applies the changes to the declarativeNetRequest rules and updates local storage.
 * @param {Array<object>} rulesToAdd - The rules to add.
 * @param {Array<number>} ruleIdsToRemove - The IDs of the rules to remove.
 * @param {object} newUuidToRuleIdMap - The new mapping of UUIDs to rule IDs.
 * @param {number} nextRuleId - The next available rule ID.
 */
const applyRuleChanges = async (rulesToAdd, ruleIdsToRemove, newUuidToRuleIdMap, nextRuleId) => {
    try {
        if (rulesToAdd.length > 0 || ruleIdsToRemove.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: ruleIdsToRemove,
                addRules: rulesToAdd
            });
        }

        await chrome.storage.local.set({
            [STORAGE_KEYS.UUID_TO_RULE_ID_MAP]: newUuidToRuleIdMap,
            [STORAGE_KEYS.NEXT_RULE_ID]: nextRuleId
        });
    } catch (error) {
        console.error("Choice Point: Error applying rule changes:", error);
        throw error;
    }
};

/**
 * Updates the declarativeNetRequest rules based on the blocked websites in storage.
 */
const updateBlockingRules = async () => {
    try {
        const { desiredWebsites, oldUuidToRuleIdMap, nextRuleId } = await getStorageData();
        const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
        const currentRuleIds = new Set(currentRules.map(rule => rule.id));

        const { rulesToAdd, ruleIdsToRemove, newUuidToRuleIdMap, nextRuleId: newNextRuleId } = calculateRuleChanges(desiredWebsites, oldUuidToRuleIdMap, nextRuleId, currentRuleIds);

        await applyRuleChanges(rulesToAdd, ruleIdsToRemove, newUuidToRuleIdMap, newNextRuleId);
    } catch (error) {
        console.error("Choice Point: Error updating blocking rules:", error);
    }
};

// Listen for changes in storage and update rules
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes[STORAGE_KEYS.BLOCKED_WEBSITES]) {
        updateBlockingRules();
    }
});

// Initial setup: update rules when the extension starts
chrome.runtime.onInstalled.addListener(() => {
    updateBlockingRules();
});

chrome.runtime.onStartup.addListener(() => {
    updateBlockingRules();
});
