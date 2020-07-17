const newUserEveryConnection = false;

window.addEventListener ("load", main, false);

var socket = io(ENDPOINT);

var curRoom = {
    userId: "",
    roomId: "",
    problemId: "",
    socket: "",
    members: []
}

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
    (request, sender, sendResponse) => ContentScriptMH(request, sender, sendResponse, curRoom)
  );

// socket listeners (data flowing from the server)
SocketListen(socket, curRoom);