
// listen for message from content script and execute the corresponding action
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
    default:
      console.warn(`Unknown action: ${message.action}`);
      break;
  }
});
