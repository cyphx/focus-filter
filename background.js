// Background service worker for YouTube Shorts Blocker

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Shorts Blocker installed');

  // Set default values - blocking is enabled by default
  chrome.storage.local.get(['isBlocked'], (result) => {
    if (result.isBlocked === undefined) {
      // Extension just installed, set default to blocked
      chrome.storage.local.set({
        isBlocked: true,
        passcode: "default" // Set a default passcode for the content script
      });
    }
  });
});

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.includes('youtube.com')) {
      // Content script should already be injected via manifest
      // This is a backup in case of any issues
      chrome.tabs.sendMessage(tabId, { action: 'checkBlocking' }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script might not be loaded, inject it
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
          }).catch(err => console.log('Script injection failed:', err));

          chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ['styles.css']
          }).catch(err => console.log('CSS injection failed:', err));
        }
      });
    }
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getBlockingStatus') {
    chrome.storage.local.get(['isBlocked'], (result) => {
      sendResponse({
        isBlocked: result.isBlocked !== false
      });
    });
    return true; // Keep message channel open for async response
  }
});