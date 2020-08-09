function SendMessageToPopup(origin, curRoom, responseCB) {
    chrome.runtime.sendMessage({
        origin: origin,
        initData: buildInitData(curRoom),
        forTabId: curRoom.tabId,
        readyState: curRoom.amReady,
        allUsersReady: curRoom.roomReady,
        amHost: curRoom.amHost
    }, function(response) {
        return responseCB(response);
    });
}