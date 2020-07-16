const newUserEveryConnection = false;

window.addEventListener ("load", myMain, false);

const ENDPOINT = "http://127.0.0.1:4001";
console.log("about to make a connection")
var socket = io(ENDPOINT);

var curRoom = {
    userId: "",
    roomId: "",
    problemId: "",
    socket: "",
    members: []
}

console.log("Socket,", socket)

chrome.storage.sync.get('userId', function(items) {
    console.log("here", items)
    var userId = items.userId;
    if (userId && !newUserEveryConnection) {
        console.log("reusing id")
        socket.emit("newSocket", { userId });
        useToken(userId);
    } else {
        socket.emit("getNewUserId");
        socket.on("userId", (userId) => {
            chrome.storage.sync.set({userId}, function() {
                console.log("got a new id", userId)
                useToken(userId);
            });
        });
    }
    function useToken(userid) {
        curRoom.userId = userId;
    }
});

socket.on("newMember", (memberId) => {
    addNewMember(memberId);
});

function myMain (evt) {
    let submitButton = $("[data-cy=\"run-code-btn\"]");
    submitButton.click(function() {
        console.log("Run Clicked")
        let lang = $(".ant-select-selection-selected-value").attr("title");
        console.log("Using lang", lang);
    });
}

function addNewMember(userUUID) {
    var memberNumber = curRoom.members.length;

    curRoom.members.push({
       userUUID: userUUID,
       dom: "<li>User " + memberNumber + " (" + userUUID + ")</li>"
    });
}

// interaction with the popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === 'getInitData') {
        sendResponse({
            roomId: curRoom.roomId,
            members: curRoom.members,
          //chatVisible: getChatVisible()
        });
        return;
      }

      if (request.type === 'createRoom') {
        socket.emit('createRoom', {
          problemId: request.data.problemId,
          userId: curRoom.userId
        }, function(data) {
            curRoom.roomId = data.roomId;
            curRoom.problemId = data.problemId;
            addNewMember("Me!");
          sendResponse({
              roomId: curRoom.roomId,
              members: curRoom.members,
          });
        });
        return true;
      }

      if (request.type === 'joinRoom') {
        socket.emit('joinRoom', {roomId: request.data.roomId, userId: curRoom.userId}, function(data) {
          if (data.errorMessage) {
            sendResponse({
              errorMessage: data.errorMessage
            });
            return;
          }

          if (data.problemId !== request.data.problemId) {
            socket.emit('leaveRoom', null, function(data) {
              sendResponse({
                errorMessage: 'That session is for a different video.'
              });
            });
            return;
          }
        });
        return true;
      }

      if (request.type === 'leaveRoom') {
        socket.emit('leaveRoom', { userId: curRoom.userId, roomId: curRoom.roomId }, function(_) {
          curRoom.roomId = "";
          sendResponse({});
        });
        return true;
      }

      if (request.type === 'showChat') {
        if (request.data.visible) {
          setChatVisible(true);
        } else {
          setChatVisible(false);
        }
        sendResponse({});
      }
    }
  );