# Contributing to Choice Point

First off, thank you for considering contributing to Choice Point! Your help is greatly appreciated. Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project.

## Code Style

To maintain a consistent and readable codebase, we adhere to the following style guidelines.

-   **JavaScript:** We use modern JavaScript (ES6+).
    -   Prefer `async/await` for handling asynchronous operations over `.then()` chains for better readability.
    -   Use `const` by default and `let` only when a variable needs to be reassigned. Avoid `var`.
    -   All new functions should have JSDoc comments explaining their purpose, parameters (`@param`), and return values (`@returns`), similar to the style in `background.js`.

-   **Formatting:** Please try to match the existing code formatting (indentation, spacing, etc.) to keep the style consistent across the project.

## Commit Message Conventions

We follow the Conventional Commits specification. This creates a more readable commit history that is easy to follow.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Type

The `type` must be one of the following:

-   **feat**: A new feature for the user.
-   **fix**: A bug fix for the user.
-   **docs**: Documentation only changes.
-   **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc).
-   **refactor**: A code change that neither fixes a bug nor adds a feature.
-   **test**: Adding missing tests or correcting existing tests.
-   **chore**: Changes to the build process or auxiliary tools and libraries.

### Examples

**Commit with a new feature:**
```
feat: allow users to temporarily disable blocking

Adds a button to the options page that disables all blocking rules for 15 minutes. This is implemented using the `chrome.alarms` API to re-enable rules automatically.
```

**Commit with a bug fix:**
```
fix: prevent adding duplicate websites to the blocklist

The `addWebsite` function in `options.js` now checks if a URL already exists before adding it to `chrome.storage.sync`, preventing duplicate entries.
```