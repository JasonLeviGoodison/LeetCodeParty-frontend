function PopupMessageHandlers(message, sendResponse, refreshDom) {
    switch (message.origin) {
        case UPDATE_DOM_MESSAGE:
            console.log("Refreshing Dom with: ", message);
            refreshDom(message.initData);
            break;
    }
}