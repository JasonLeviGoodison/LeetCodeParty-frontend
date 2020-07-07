// Extension start
console.log('Thing started!');

// Listener for newly loaded pages
function onMsgListener(request, sender) {
  if (request.buildForm) {
    chrome.tabs.executeScript(sender.tab.id, { code: decodeURI(request.buildForm) });
  }
}

// Register listener
chrome.runtime.onMessage.addListener(onMsgListener);