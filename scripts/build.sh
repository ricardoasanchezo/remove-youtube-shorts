#!/bin/sh
set -e

echo "Building extension..."
npx tsc
cp src/manifest.json dist/
cp src/popup/popup.html dist/
cp dist/popup/popup.js dist/
rm -rf dist/popup
echo "Build complete!"
