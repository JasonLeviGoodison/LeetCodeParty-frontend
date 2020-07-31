function SendMessageToPopup(origin, curRoom, responseCB) {
    chrome.runtime.sendMessage({
        origin: origin,
        initData: buildInitData(curRoom)
    }, function(response) {
        return responseCB(response);
    });
}