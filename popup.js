document.addEventListener('DOMContentLoaded', async () => {
  // Get current blocking state
  const result = await chrome.storage.local.get(['isBlocked']);
  const isBlocked = result.isBlocked !== false; // Default to true

  updateStatus(isBlocked);

  // Toggle button functionality
  const toggleBtn = document.getElementById('toggle-btn');

  toggleBtn.addEventListener('click', async () => {
    const currentResult = await chrome.storage.local.get(['isBlocked']);
    const currentlyBlocked = currentResult.isBlocked !== false;

    // Toggle the state
    const newBlockedState = !currentlyBlocked;
    await chrome.storage.local.set({ isBlocked: newBlockedState });

    updateStatus(newBlockedState);
  });
});

function updateStatus(isBlocked) {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.getElementById('status-text');
  const toggleBtn = document.getElementById('toggle-btn');
  const toggleText = document.getElementById('toggle-text');
  const infoText = document.querySelector('.info-section p');

  if (isBlocked) {
    statusDot.classList.remove('inactive');
    statusText.textContent = 'Shorts Blocked';
    toggleBtn.classList.remove('unlocked');
    toggleText.textContent = 'Disable Blocking';
    infoText.textContent = 'YouTube Shorts are currently being blocked to help reduce short-form video addiction.';
  } else {
    statusDot.classList.add('inactive');
    statusText.textContent = 'Shorts Allowed';
    toggleBtn.classList.add('unlocked');
    toggleText.textContent = 'Enable Blocking';
    infoText.textContent = 'YouTube Shorts are currently accessible. Enable blocking to reduce distractions.';
  }
}