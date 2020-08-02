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

function main(evt) {
    getStoredInfo();

    //TODO leaving here cause the css selectors are right
    let submitButton = $("button[data-cy=\"run-code-btn\"]");
    submitButton.click(function() {
        console.log("Run Clicked")
        let lang = $(".ant-select-selection-selected-value").attr("title");
        console.log("Using lang", lang);
        console.log("here", $("div[class=CodeMirror-code]").text());
        let code = $("div[class=\"CodeMirror-code\"]");
    });
}

// interaction with the popup
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => ContentScriptHandlers(request, sender, sendResponse, curRoom)
);

// socket listeners (data flowing from the server)
SocketListen(socket, curRoom);