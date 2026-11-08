#!/bin/sh
set -e

echo "Building extension with esbuild..."
npx esbuild src/content.ts --bundle --outfile=dist/content.js
npx esbuild src/popup/popup.ts --bundle --outfile=dist/popup.js
cp src/manifest.json dist/
cp src/popup/popup.html dist/
echo "Build complete!"
