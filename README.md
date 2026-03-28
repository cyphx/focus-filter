# YouTube Shorts Blocker Chrome Extension

A Chrome extension that blocks YouTube Shorts with passcode protection to help reduce short-form video addiction.

## Features

- **Passcode Protection**: Set a secure passcode to control access to YouTube Shorts
- **Temporary Unlock**: Unlock Shorts temporarily for 30 minutes when needed
- **Complete Blocking**: Blocks Shorts on homepage, sidebar, search results, and direct URLs
- **Privacy Focused**: No personal information collected or stored
- **Works on Desktop and Mobile**: Compatible with both desktop and mobile versions of YouTube

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
2. Create a passcode (minimum 4 characters)
3. Confirm the passcode
4. YouTube Shorts will be automatically blocked

### Managing Blocking

- **Unlock Temporarily**: Click "Unlock Temporarily" and enter your passcode
  - Shorts will be unlocked for 30 minutes
  - A timer shows remaining unlock time
- **Lock Immediately**: When unlocked, click "Lock Now" to re-enable blocking
- **Change Passcode**: Use the "Change Passcode" button in settings
- **Reset Extension**: Use "Reset Extension" to remove passcode and disable blocking

### What Gets Blocked

- YouTube Shorts shelf on homepage
- Shorts tab in sidebar navigation
- Direct Shorts URLs (`youtube.com/shorts/...`)
- Shorts in search results and recommendations
- Shorts thumbnails with overlay indicators

## How It Works

The extension uses:
- **Content Scripts**: Detect and block Shorts content on YouTube pages
- **Chrome Storage API**: Store passcode and blocking state locally
- **Mutation Observers**: Monitor dynamic content changes on YouTube
- **Service Worker**: Manage background tasks and unlock timers

## Privacy

- No personal information is collected
- Passcode is stored locally in Chrome's secure storage
- No external servers or analytics
- All blocking happens locally in your browser

## Testing the Extension

1. Load the extension as described above
2. Visit YouTube.com
3. Set up a passcode through the extension popup
4. Try accessing:
   - YouTube homepage (Shorts shelf should be blocked)
   - Shorts tab in sidebar (should be disabled)
   - Direct Shorts URL like `youtube.com/shorts/[video-id]`
   - Search results containing Shorts
5. Test unlock functionality with your passcode
6. Verify 30-minute timer works correctly

## Troubleshooting

- **Extension not working**: Refresh the YouTube page after installation
- **Passcode forgotten**: Use "Reset Extension" to clear all data and start over
- **Shorts still visible**: Check that blocking is enabled in the extension popup

## Development Notes

This is a POC (Proof of Concept) version. Future improvements could include:
- Customizable unlock duration
- Schedule-based blocking (e.g., block during work hours)
- Statistics on blocking effectiveness
- Whitelist for educational Shorts
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

