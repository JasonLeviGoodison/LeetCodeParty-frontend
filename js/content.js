
window.addEventListener ("load", myMain, false);

const ENDPOINT = "http://127.0.0.1:4001";
console.log("about to make a connection")
var socket = io(ENDPOINT);

var curRoom = {
    userId: "",
    roomId: "",
    problemId: "",
    socket: ""
}

console.log("Socket,", socket)

chrome.storage.sync.get('userId', function(items) {
    console.log("here", items)
    var userId = items.userId;
    if (userId) {
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


function myMain (evt) {
    let submitButton = $("[data-cy=\"run-code-btn\"]");
    submitButton.click(function() {
        console.log("Run Clicked")
        let lang = $(".ant-select-selection-selected-value").attr("title");
        console.log("Using lang", lang);
    });
}

// interaction with the popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === 'getInitData') {
        sendResponse({
          roomId: curRoom.roomId,
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
            curRoom.problemId = data.problemId
        //   initChat();
        //   setChatVisible(true);
        //   lastKnownTime = data.lastKnownTime;
        //   lastKnownTimeUpdatedAt = new Date(data.lastKnownTimeUpdatedAt);
        //   messages = [];
        //   sessionId = data.sessionId;
        //   ownerId = request.data.controlLock ? userId : null;
        //   state = data.state;
        //   videoId = request.data.videoId;
        //   pushTask(broadcast(false));
          sendResponse({
            roomId: curRoom.roomId
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
            socket.emit('leaveSession', null, function(data) {
              sendResponse({
                errorMessage: 'That session is for a different video.'
              });
            });
            return;
          }

        //   initChat();
        //   setChatVisible(true);
        //   sessionId = request.data.sessionId;
        //   lastKnownTime = data.lastKnownTime;
        //   lastKnownTimeUpdatedAt = new Date(data.lastKnownTimeUpdatedAt);
        //   messages = [];
        //   for (var i = 0; i < data.messages.length; i += 1) {
        //     addMessage(data.messages[i]);
        //   }
        //   ownerId = data.ownerId;
        //   state = data.state;
        //   videoId = request.data.videoId;
        //   pushTask(receive(data));
          sendResponse("https://testlink.com");
        });
        return true;
      }

      if (request.type === 'leaveSession') {
        socket.emit('leaveSession', null, function(_) {
          sessionId = null;
          setChatVisible(false);
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