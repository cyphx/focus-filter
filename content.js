// YouTube Shorts Blocker Content Script
let isBlocked = true;
let passcode = null;
let templates = {};

// Template loader
async function loadTemplate(templateName) {
  if (templates[templateName]) {
    return templates[templateName];
  }

  try {
    const url = chrome.runtime.getURL(`templates/${templateName}.html`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch template ${templateName}: ${response.status}`);
      return '';
    }
    const text = await response.text();
    templates[templateName] = text;
    console.log(`Loaded template ${templateName}`);
    return text;
  } catch (error) {
    console.error(`Failed to load template ${templateName}:`, error);
    return '';
  }
}

// Template replacer
function replaceTemplateVars(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// Initialize extension state
async function init() {
  console.log('YouTube Shorts Blocker: Initializing...');

  // Pre-load templates
  await Promise.all([
    loadTemplate('blocked-overlay'),
    loadTemplate('blocked-page'),
    loadTemplate('passcode-prompt')
  ]);

  chrome.storage.local.get(['isBlocked', 'passcode'], (result) => {
    // Default to blocking (true) unless explicitly set to false
    isBlocked = result.isBlocked !== false;
    passcode = result.passcode || "default"; // Set a default passcode

    console.log('YouTube Shorts Blocker: State loaded', {
      isBlocked
    });

    if (isBlocked) {
      console.log('YouTube Shorts Blocker: Starting blocking...');
      blockShorts();
    }
  });
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.isBlocked) {
      isBlocked = changes.isBlocked.newValue;
      if (isBlocked) {
        blockShorts();
      } else {
        unblockShorts();
      }
    }
    if (changes.passcode) {
      passcode = changes.passcode.newValue;
    }
  }
});

function blockShorts() {
  // Wait for document.body to be available
  const startObserver = () => {
    if (!document.body) {
      setTimeout(startObserver, 100);
      return;
    }

    // Create observer for dynamic content
    const observer = new MutationObserver(async () => {
      if (!isBlocked) return;

      // Block Shorts shelf on homepage
      const shortsShelf = document.querySelector('[is-shorts]');
      if (shortsShelf) {
        await addBlockedOverlay(shortsShelf, 'YouTube Shorts');
      }

      // Block Shorts tab in sidebar
      const shortsLinks = document.querySelectorAll('a[href="/shorts"], ytd-guide-entry-renderer a[href="/shorts"]');
      shortsLinks.forEach(link => {
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.3';
        link.setAttribute('data-blocked', 'true');
      });

      // Block direct Shorts URLs
      if (window.location.pathname.includes('/shorts/')) {
        await blockShortsPage();
      }

      // Block Shorts in search results and recommendations
      const shortsThumbnails = document.querySelectorAll('[overlay-style="SHORTS"], ytd-reel-shelf-renderer');
      for (const thumbnail of shortsThumbnails) {
        const container = thumbnail.closest('ytd-video-renderer, ytd-grid-video-renderer, ytd-reel-shelf-renderer');
        if (container) {
          await addBlockedOverlay(container, 'Short');
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial block - run the blocking logic immediately
    setTimeout(async () => {
      // Run blocking logic once on page load
      if (!isBlocked) return;

      const shortsShelf = document.querySelector('[is-shorts]');
      if (shortsShelf) {
        await addBlockedOverlay(shortsShelf, 'YouTube Shorts');
      }

      const shortsLinks = document.querySelectorAll('a[href="/shorts"], ytd-guide-entry-renderer a[href="/shorts"]');
      shortsLinks.forEach(link => {
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.3';
        link.setAttribute('data-blocked', 'true');
      });

      if (window.location.pathname.includes('/shorts/')) {
        await blockShortsPage();
      }

      const shortsThumbnails = document.querySelectorAll('[overlay-style="SHORTS"], ytd-reel-shelf-renderer');
      for (const thumbnail of shortsThumbnails) {
        const container = thumbnail.closest('ytd-video-renderer, ytd-grid-video-renderer, ytd-reel-shelf-renderer');
        if (container) {
          await addBlockedOverlay(container, 'Short');
        }
      }
    }, 1000);
  };

  startObserver();
}

function unblockShorts() {
  // Remove all blocked overlays
  document.querySelectorAll('.shorts-blocked-overlay').forEach(overlay => {
    overlay.remove();
  });

  // Re-enable Shorts links
  const shortsLinks = document.querySelectorAll('[data-blocked="true"]');
  shortsLinks.forEach(link => {
    link.style.pointerEvents = '';
    link.style.opacity = '';
    link.removeAttribute('data-blocked');
  });

  // Show hidden content
  document.querySelectorAll('.shorts-hidden-content').forEach(element => {
    element.classList.remove('shorts-hidden-content');
    element.style.display = '';
  });
}

async function addBlockedOverlay(element, type = 'content') {
  if (!element || element.querySelector('.shorts-blocked-overlay')) return;

  const template = await loadTemplate('blocked-overlay');
  if (!template) return;

  const overlay = document.createElement('div');
  overlay.className = 'shorts-blocked-overlay';
  overlay.innerHTML = replaceTemplateVars(template, {
    type: type,
    elementId: Date.now()
  });

  element.style.position = 'relative';
  element.appendChild(overlay);

  overlay.querySelector('.unlock-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    showPasscodePrompt();
  });
}

async function blockShortsPage() {
  const mainContent = document.querySelector('#content') || document.body;

  if (mainContent.querySelector('.shorts-page-blocked')) return;

  const template = await loadTemplate('blocked-page');
  if (!template) return;

  const blockDiv = document.createElement('div');
  blockDiv.className = 'shorts-page-blocked';
  blockDiv.innerHTML = template;

  mainContent.innerHTML = '';
  mainContent.appendChild(blockDiv);

  blockDiv.querySelector('.unlock-page-btn').addEventListener('click', showPasscodePrompt);
  blockDiv.querySelector('.go-home-btn').addEventListener('click', () => {
    window.location.href = 'https://www.youtube.com';
  });
}

async function showPasscodePrompt() {
  const existingPrompt = document.querySelector('.passcode-prompt-overlay');
  if (existingPrompt) {
    existingPrompt.remove();
  }

  const template = await loadTemplate('passcode-prompt');
  if (!template) return;

  const promptOverlay = document.createElement('div');
  promptOverlay.className = 'passcode-prompt-overlay';
  promptOverlay.innerHTML = template;

  document.body.appendChild(promptOverlay);

  const input = promptOverlay.querySelector('.passcode-input');
  const errorMsg = promptOverlay.querySelector('.error-message');

  input.focus();

  const submitPasscode = () => {
    const enteredCode = input.value;
    if (enteredCode === passcode) {
      // Temporarily unlock for 30 minutes
      const unlockTime = Date.now() + (30 * 60 * 1000);
      chrome.storage.local.set({
        isBlocked: false,
        unlockExpiry: unlockTime
      });
      promptOverlay.remove();
    } else {
      errorMsg.style.display = 'block';
      input.value = '';
      input.focus();
    }
  };

  promptOverlay.querySelector('.prompt-submit').addEventListener('click', submitPasscode);
  promptOverlay.querySelector('.prompt-cancel').addEventListener('click', () => {
    promptOverlay.remove();
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitPasscode();
    }
  });
}

// Start initialization
init();