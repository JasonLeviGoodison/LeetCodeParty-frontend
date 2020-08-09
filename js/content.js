const newUserEveryConnection = true;

window.addEventListener ("load", main, false);

var socket = io(ENDPOINT);

var curRoom = {
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
            socket.emit("newSocket", { userId });
            useToken(userId);
        } else {
            socket.emit("getNewUserId");
            socket.on("userId", (userId) => {
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