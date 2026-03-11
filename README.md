# India Academic Publications Application

### Repository Note

This repository contains the codebase for **Indiapub** (accessed via https://indiapub.org or https://bharatresearch.org). Due to file size limitations, the most recent full version of the files associated with the “Any Topics” option is not currently hosted in this GitHub repository. Readers who would like access to the most recent version may contact the [Yiren Hou](mailto:yiren.hou@yale.edu) to request it directly.

### Tools

- Google Firebase (and Google Firebase CLI)
- Node
- NPM

The following guides assume you have these tools set up. A simple Google search or LLM prompt can help you install any tools you may not already have.

## Installation and Use Guide

After cloning the gh repo, create a `.firebaserc` file. It should have the following content, replacing `projectId` with the actual projectId.

```
{
    "projects": {
    "default": projectId
  }
}
```

Run `npm -i` to install the project packages.

Run `npm run dev` to host the app locally for testing.

## Deployment Guide

Ensure you are logged into Google Firebase within the CLI.

Run `npm build` to build the app for production. You can test the production environment locally using `npm run preview`.

To publish your update, run `firebase deploy --only hosting`.

## Domain and Hosting Management

The domains are managed by [Matthew Schlager](mailto:matthew.schlager@yale.edu) via GoDaddy.

All other hosting is managed in the Google Firebase console.
