const newUserEveryConnection = true;

window.addEventListener ("load", main, false);

var socket = io(ENDPOINT);

var curRoom = {
    tabId: "",
    userId: "",
    roomId: "",
    problemId: "",
    socket: "",
    amReady: false,
    roomReady: false,
    amHost: false,
    members: []
};

function getStoredInfo() {
    chrome.storage.sync.get(INFO_STORE_KEY, function(items) {
        var { userId } = items;
    
        if (userId && !newUserEveryConnection) {
            socket.emit(NEW_SOCKET_MESSAGE, { userId });
            useToken(userId);
        } else {
            socket.emit(GET_NEW_USER_ID_MESSAGE);
            socket.on(USER_ID_MESSAGE, (userId) => {
                chrome.storage.sync.set({userId}, function() {
                    useToken(userId);
                });
            });
        }
        function useToken(userid) {
            curRoom.userId = userId;
        }
    });
}

// interaction with the popup
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => ContentScriptHandlers(request, sender, sendResponse, curRoom)
);

function main(evt) {
    getStoredInfo();
    PageButtonHandlers();
}



// socket listeners (data flowing from the server)
SocketListen(socket, curRoom);