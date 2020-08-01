function SendMessageToPopup(origin, curRoom, responseCB) {
    chrome.runtime.sendMessage({
        origin: origin,
        initData: buildInitData(curRoom),
        forTabId: curRoom.tabId
    }, function(response) {
        return responseCB(response);
    });
}