
document.addEventListener('DOMContentLoaded', () => {
  const syncButton = document.getElementById('sync-button');
  const syncTimeDisplay = document.getElementById('last-sync-time');

  if (syncButton) {
    syncButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'syncNow' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error handling response:', chrome.runtime.lastError);
        } else {
          console.log(response.status);
        }
      });
    });
  } else {
    console.error('Sync button not found');
  }

  // Fetch and display the last sync time when the popup is opened
  updateSyncTimeDisplay();

  // Update the sync time display when the storage changes
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.lastSyncTime) {
      updateSyncTimeDisplay();
    }
  });

  // Function to update the sync time display
  function updateSyncTimeDisplay() {
    chrome.storage.local.get('lastSyncTime', (result) => {
      const lastSyncTime = result.lastSyncTime || 'Never';
      syncTimeDisplay.textContent = `Last Sync Time: ${lastSyncTime}`;
    });
  }

});

