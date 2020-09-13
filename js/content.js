const newUserEveryConnection = TESTING || false;

window.addEventListener ("load", main, false);

var socket = io(ENDPOINT, { secure: true });
var sideBar = new SideBar();
var curRoomV2 = new Room(sideBar);
var modal = new Modal(socket);

function getStoredInfo() {
    chrome.storage.sync.get(INFO_STORE_KEY, function(items) {
        var { userId } = items;
    
        if (userId && !newUserEveryConnection) {
            socket.emit(NEW_SOCKET_MESSAGE, { userId });
            useToken(userId);
        } else {
            socket.emit(GET_NEW_USER_ID_MESSAGE, {}, function(data) {
                chrome.storage.sync.set({userId: data.userUUID}, function() {
                    useToken(data.userUUID);
                });
            });
            socket.on(USER_ID_MESSAGE, (userId) => {
                chrome.storage.sync.set({userId}, function() {
                    useToken(userId);
                });
            });
        }
        function useToken(userid) {
            curRoomV2.setUserID(userid);
        }
    });
}

// interaction with the popup
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => ContentScriptHandlers(request, sender, sendResponse, curRoomV2)
);

function main(evt) {
    getStoredInfo();
    PageButtonHandlers();
}

// socket listeners (data flowing from the server)
SocketListen(socket, curRoomV2);