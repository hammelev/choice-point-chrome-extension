# Gemini Project Instructions: Choice Point Extension

This is a Chrome extension that blocks distracting websites.

## Key Files

-   `manifest.json`: Extension configuration
-   `rules.json`: Site blocking rules
-   `background.js`: Core logic

## Commands

The following commands can be used to interact with Gemini for this project:

### Feature Issues Creation

-   `Create feature draft: {description}`
    -   Creates a feature draft for a GitHub issue using the `feature.md` template.
        -   For any sections in `feature.md` stated as optional only if them if it make sense. If they are added remove the '(optional)' tag.
    -   The draft will include a title and a body.
    -   Gemini will perform the checklist steps in `feature.md`, report the results, and mark them as complete.
    -   No GitHub issue will be created at this stage.

-   `Update feature draft: {update description}`
    -   Updates the existing feature draft with new information.
    -   No GitHub issue will be created.

-   `Submit feature draft`
    -   Displays the content of the feature draft and asks for confirmation.
    -   Creates a GitHub issue from the feature draft upon user approval.

-   `Review feature draft`
    -   Provides a comprehensive review of the feature draft, offering feedback and suggestions on the following aspects:
        -   **Clarity and Completeness:** Assesses if the feature is well-defined, and if there is any missing information.
        -   **Value and Priority:** Evaluates the feature's potential value to users and its priority in the context of the project.
        -   **Technical Feasibility:** Analyzes the technical approach, suggesting potential challenges and alternative implementations.
        -   **User Experience (UX):** Considers the impact on the user interface and overall user experience.
        -   **Edge Cases and Risks:** Identifies potential edge cases, error conditions, and risks.
        -   **Implementation Plan:** Outlines a high-level plan for implementation, including files to be modified and new files to be created.
        -   **Success Metrics:** Suggests metrics to measure the feature's success and impact.

### Interaction with Git

Commands to manage version control and integrate with the GitHub repository.

-   `Create feature branch: {branch-name}`
    -   **Purpose:** Creates a new local branch from the `main` branch to begin work on a new feature or bugfix. This keeps the `main` branch clean and isolates work.
    -   **Example:** `Create feature branch: feature/add-new-blocking-rule`

-   `Commit changes`
    -   **Purpose:** Bundles and commits all staged changes. The tool will first display the changes (`git diff --staged`) and then prompt for a commit message, suggesting a conventional commit format (e.g., `feat: Add new blocking rule`).
    -   **Clarity:** This ensures every commit is deliberate and well-documented.

-   `Create pull request`
    -   **Purpose:** Pushes a feature branch to the remote repository and creates a pull request on GitHub to merge it into the main branch.
    -   **Workflow:**
        1.  The command will first push the current branch and its commits to the remote repository (e.g., GitHub).
        2.  It will then prompt for a title and body for the pull request, suggesting defaults based on commit history.
        3.  Finally, it will create the pull request.
    -   **Prerequisite:** This command should be run after you have committed all your changes to the feature branch.

-   `Abandon branch`
    -   **Purpose:** Deletes the current local branch, switches to the `main` branch, and pulls the latest changes from the remote.
    -   **Safety Check:** Before deleting, the command will check for unpushed commits. If any are found, it will warn you and require confirmation to prevent accidental data loss.