function PopupMessageHandlers(message, sendResponse, refreshDom) {
    switch (message.origin) {
        case UPDATE_DOM_MESSAGE:
            refreshDom(message.initData);
            break;
    }
}