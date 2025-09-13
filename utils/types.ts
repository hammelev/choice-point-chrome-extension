/**
 * Represents a blocked website.
 * @property {string} uuid - A unique identifier for the blocked website.
 * @property {string} url - The URL of the blocked website.
 */
export type BlockedWebsite = {
  uuid: string;
  url: string;
};

/**
 * Represents a mapping of UUIDs to declarativeNetRequest rule IDs.
 * @property {number} [key: string] - The rule ID associated with a website's UUID.
 */
export type uuidToRuleIdMapType = { [key: string]: number };