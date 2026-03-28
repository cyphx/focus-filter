# Focus Filter Chrome Extension

A Chrome extension that blocks addictive short-form content and distracting pages to help reduce digital addiction and improve focus.

## Features

- **Temporary Unlock**: Unlock content temporarily for 30 minutes when needed
- **Complete Blocking**: Blocks short-form content on homepages, sidebars, search results, and direct URLs
- **Privacy Focused**: No personal information collected or stored
- **Works on Desktop and Mobile**: Compatible with both desktop and mobile versions of supported sites

## Installation

### Developer Mode Installation (for testing)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `focus-filter` folder containing the extension files
5. The extension will be installed and ready to use

### Creating Icons (Optional)

The extension requires icon files. For testing, you can create simple placeholder icons:

1. Create 16x16, 48x48, and 128x128 pixel PNG files
2. Name them `icon16.png`, `icon48.png`, and `icon128.png`
3. Place them in the extension folder

Or use any image editing tool to create a simple icon (e.g., a blocked/prohibited symbol).

## Usage

### Initial Setup

1. Click the extension icon in Chrome toolbar
2. Blocking is enabled automatically

### Managing Blocking

- **Unlock Temporarily**: Click "Unlock Temporarily" to unlock content for 30 minutes
  - A timer shows remaining unlock time
- **Lock Immediately**: When unlocked, click "Lock Now" to re-enable blocking
- **Reset Extension**: Use "Reset Extension" to disable blocking

### What Gets Blocked

- YouTube Shorts shelf on homepage
- Shorts tab in sidebar navigation
- Direct Shorts URLs (`youtube.com/shorts/...`)
- Shorts in search results and recommendations
- Shorts thumbnails with overlay indicators

## How It Works

The extension uses:
- **Content Scripts**: Detect and block Shorts content on YouTube pages
- **Chrome Storage API**: Store blocking state locally
- **Mutation Observers**: Monitor dynamic content changes on YouTube
- **Service Worker**: Manage background tasks and unlock timers

## Privacy

- No personal information is collected
- No external servers or analytics
- All blocking happens locally in your browser

## Testing the Extension

1. Load the extension as described above
2. Visit YouTube.com
3. Try accessing:
   - YouTube homepage (Shorts shelf should be blocked)
   - Shorts tab in sidebar (should be disabled)
   - Direct Shorts URL like `youtube.com/shorts/[video-id]`
   - Search results containing Shorts
4. Test unlock functionality
5. Verify 30-minute timer works correctly

## Troubleshooting

- **Extension not working**: Refresh the YouTube page after installation
- **Shorts still visible**: Check that blocking is enabled in the extension popup

## Roadmap

This is a POC (Proof of Concept) version. Planned improvements include:

### Platform Expansion
- **Reddit**: Block infinite scroll feeds and distracting subreddits
- **Instagram Reels**: Block Reels tab and autoplay short-form videos
- **Facebook**: Block Reels and addictive feed elements
- **TikTok**: Full page blocking or feed filtering
- **X / Twitter**: Block algorithmically amplified content and trending feeds

### Feature Improvements
- Customizable unlock duration
- Schedule-based blocking (e.g., block during work hours)
- Statistics on blocking effectiveness
- Per-site blocking configuration
- Better mobile YouTube support

## Files Structure

```
focus-filter/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for background tasks
├── content.js            # Content script for YouTube pages
├── styles.css            # Styles for blocked content overlays
├── popup.html            # Extension popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── icon16.png            # 16x16 icon (needs to be created)
├── icon48.png            # 48x48 icon (needs to be created)
├── icon128.png           # 128x128 icon (needs to be created)
└── README.md             # This file
```
