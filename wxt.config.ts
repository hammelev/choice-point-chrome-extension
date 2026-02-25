import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  outDir: "dist",
  manifest: {
    host_permissions: ["<all_urls>"],
    permissions: ["declarativeNetRequestWithHostAccess", "storage", "tabs"],
    action: {
      default_icon: {
        16: "icon/icon16.png",
        32: "icon/icon32.png",
        48: "icon/icon48.png",
        128: "icon/icon128.png",
      },
    },
    icons: {
      16: "icon/icon16.png",
      32: "icon/icon32.png",
      48: "icon/icon48.png",
      128: "icon/icon128.png",
    },
    web_accessible_resources: [
      {
        resources: ["block_page_hard.html"],
        matches: ["<all_urls>"],
      },
    ],
  },
});
