// none of this is doing anything atm and probably can be removed

makePopup=function(){
    console.log(window.getSelection().toString());
    alert(1);
}


chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

chrome.action.onClicked.addListener(async (tab) => {
    console.log("it works");
    alert(1);
  });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "search") {
        var query = encodeURIComponent(request.query);
        var searchUrl = "https://www.duckduckgo.com/search?q=" + query;
        chrome.tabs.create({ url: searchUrl });
    }
    if (request.action == "show_popup") {
        var text = request.text;
        var popupUrl = chrome.runtime.getURL('popup.html');
        chrome.windows.create({
            url: popupUrl,
            type: 'popup',
            width: 300,
            height: 200,
            focused: true
        }, function(window) {
            chrome.scripting.executeScript(window.tabs[0].id, {
                code: 'document.getElementById("selectedText").innerText = "' + text + '";'
            });
        });
    }
});