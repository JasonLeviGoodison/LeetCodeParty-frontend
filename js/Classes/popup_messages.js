function SendMessageToPopup(origin, curRoom, responseCB) {
    chrome.runtime.sendMessage(curRoom.getMessageToPopupData(origin), function(response) {
        return responseCB(response);
    });
}