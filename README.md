# Pomodoro Pal Chrome Extension

A simple Pomodoro timer Chrome extension built with **vanilla JavaScript** - no frameworks, no dependencies!

## Features

- ⏱️ Customizable work/break intervals
- 🔔 Desktop notifications
- 🎨 Animated GIF companion
- 📊 Timer badge on extension icon
- 🔄 Runs in background even when popup is closed

## Project Structure

```
├── public/          # Source files
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   ├── content.js
│   ├── background.js
│   └── *.gif, *.png
├── dist/            # Built extension (copy of public/)
├── build.js         # Simple build script
└── package.json
```

## Build

```bash
npm run build
```

This simply copies files from `public/` to `dist/`.

## Install

1. Run `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/` folder

## File Sizes

- **Total: ~12 KB** (uncompressed)
- No React, no TypeScript, no build tooling overhead
- 97% smaller than the React version!

## Development

Edit files directly in the `public/` folder, then run `npm run build` to update the extension.
