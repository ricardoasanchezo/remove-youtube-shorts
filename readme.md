# Remove YouTube Shorts

A lightweight browser extension that removes unwanted YouTube Shorts and shelves from search results, the homepage, and subscriptions.

## Features

- Instantly removes Shorts shelves (`ytd-reel-shelf-renderer`, `ytd-rich-shelf-renderer`, `grid-shelf-view-model`) from YouTube.
- Keeps track of how many distracting shorts/shelves have been removed.
- Modern popup UI displaying live removal statistics.
- Built with TypeScript and bundled with `esbuild` for maximum performance.

## Repository Structure

```text
remove-youtube-shorts/
├── .gitignore
├── package.json
├── tsconfig.json
├── scripts/
│   └── build.sh           # Build script using esbuild
├── src/
│   ├── manifest.json      # Extension manifest (v3)
│   ├── content.ts         # Main content script for DOM manipulation
│   ├── logger.ts          # Centralized logging utility
│   └── popup/
│       ├── popup.html     # Extension popup UI
│       └── popup.ts       # Popup logic & storage listener
└── dist/                  # Generated build output (git-ignored)
```

## Build Instructions

Prerequisites: Node.js and npm installed.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the extension:
   ```bash
   npm run build
   ```
   This compiles TypeScript and bundles assets into the `dist/` directory.

## How to Load in Firefox

1. Open Firefox and navigate to `about:debugging#/runtime`.
2. Click **This Firefox** in the left sidebar.
3. Click **Load Temporary Add-on...**
4. Select `dist/manifest.json` from your project folder.
