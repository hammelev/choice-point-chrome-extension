# Choice Point Chrome Extension

This is a Chrome extension that blocks distracting websites.

## Development Setup

This project uses [WXT](https://wxt.dev/) with React and TypeScript.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18 or higher.
*   **pnpm:** WXT recommends pnpm for package management. You can install it via npm: `npm install -g pnpm`

### Build Process

To set up the development environment and build the extension:

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```
2.  **Start Development Server:**
    ```bash
    pnpm dev
    ```
    This will build the extension and watch for changes. The `dist` folder will be created/updated.
3.  **Build for Production:**
    ```bash
    pnpm build
    ```
    This will create an optimized production build in the `dist` folder.

### Installation in Chrome (Load Unpacked Extension)

To load the extension into your Chrome browser:

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode** using the toggle switch in the top right corner.
3.  Click the **Load unpacked** button.
4.  Navigate to your project directory, select the `dist` folder, and click **Select Folder**.

The extension should now appear in your list of extensions and be active. Any changes made during development (using `pnpm dev`) will automatically reload the extension in Chrome.