
/////////////////////////////////////// MOUSE ACTIONS /////////////////////////////////////////////
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'createTab':
      chrome.tabs.create({ url: message.url });
      break;

    case 'closeCurrentTab':
      chrome.tabs.remove(sender.tab.id);
      break;

    case 'reopenLastClosedTab':
      chrome.sessions.restore();
      break;

    case 'navigateBack':
      chrome.tabs.goBack(sender.tab.id);
      break;

    case 'navigateForward':
      chrome.tabs.goForward(sender.tab.id);
      break;

    case 'reload':
      chrome.tabs.reload(sender.tab.id);
      break;

    case 'maximizeWindow':
      chrome.windows.getCurrent({ populate: true }, (window) => {
        chrome.windows.update(window.id, { state: 'maximized' });
      });
      break;

    // TODO FIX
    case 'zoomIn':
      chrome.tabs.getZoom(sender.tab.id, (currentZoomFactor) => {
        const newZoomFactor = currentZoomFactor * 1.10;
        chrome.tabs.setZoom(sender.tab.id, newZoomFactor);
      });
      break;

    case 'zoomOut':
      chrome.tabs.getZoom(sender.tab.id, (currentZoomFactor) => {
        const newZoomFactor = currentZoomFactor / 1.10;
        chrome.tabs.setZoom(sender.tab.id, newZoomFactor);
      });
      break;

    case 'minimizeWindow':
      chrome.windows.getCurrent({ populate: true }, (window) => {
        chrome.windows.update(window.id, { state: 'minimized' });
      });
      break;
    case 'goTabLeft':
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.query({currentWindow: true}, (allTabs) => {
            let nextTabIndex = (tabs[0].index - 1) % allTabs.length;
            chrome.tabs.update(allTabs[nextTabIndex].id, {active: true});
        });
      });
      break;
    case 'goTabRight':
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.query({currentWindow: true}, (allTabs) => {
            let nextTabIndex = (tabs[0].index + 1) % allTabs.length;
            chrome.tabs.update(allTabs[nextTabIndex].id, {active: true});
        });
      });
      break;
      console.warn(`Unknown action: ${message.action}`);
  }
});


/////////////////////////////////////// BOOKMARK SYNC /////////////////////////////////////////////
// const SUPABASE_URL = 'https://your-project.supabase.co';
// const SUPABASE_KEY = 'your-supabase-key';

// async function uploadBookmarks() {
//   const bookmarks = await chrome.bookmarks.getTree();
//   const response = await fetch(`${SUPABASE_URL}/rest/v1/bookmarks`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'apikey': SUPABASE_KEY,
//       'Authorization': `Bearer ${SUPABASE_KEY}`
//     },
//     body: JSON.stringify(bookmarks)
//   });

//   if (!response.ok) {
//     console.error('Error syncing bookmarks:', await response.text());
//   }
// }

// async function downloadBookmarks() {

// }

// chrome.runtime.onInstalled.addListener(syncBookmarks);