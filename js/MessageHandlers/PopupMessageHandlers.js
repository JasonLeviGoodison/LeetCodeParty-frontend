function PopupMessageHandlers(message, sendResponse, refreshDom) {
    switch (message.origin) {
        case NEW_MEMBER_MESSAGE:
        case ROOM_CLOSING_MESSAGE:
        case USER_LEFT_MESSAGE:
        case USER_READY_UP_MESSAGE:
        case ROOM_READY_MESSAGE:
            console.log("Refreshing Dom from: ", message);
            refreshDom(message.initData);
            break;
    }
}