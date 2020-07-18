function getInitData(sendResponse, curRoom) {
    sendResponse({
        roomId: curRoom.roomId,
        members: curRoom.members
    });
    return;
}

function createRoom(request, sendResponse, curRoom) {
    let payload = {
        problemId: request.data.problemId,
        userId: curRoom.userId
    };
    socket.emit('createRoom', payload, function(data) {
        console.log("CreateRoom data: ", data);
        curRoom.roomId = data.roomId;
        curRoom.problemId = data.problemId;
        curRoom.members.push(buildNewMemberInRoom(curRoom.members.length, curRoom.userId, true, data.nicknameInfo));
        sendResponse({
            roomId: curRoom.roomId,
            members: curRoom.members,
        });
    });
    return true;
}

function joinRoom(request, sendResponse, curRoom) {
    let payload = {
        roomId: request.data.roomId,
        userId: curRoom.userId
    };

    socket.emit("joinRoom", payload, function(data) {
        
        if (data.errorMessage) {
            sendResponse({ errorMessage: data.errorMessage });
            return false;
        }

        if (data.problemId !== request.data.problemId) {
            socket.emit('leaveRoom', null, function(data) {
                sendResponse({
                    errorMessage: 'That session is for a different video.'
                });
            });
            return false;
        }
    });
    return true;
}

function leaveRoom(sendResponse, curRoom) {
    socket.emit('leaveRoom', { userId: curRoom.userId, roomId: curRoom.roomId }, function(_) {
        curRoom.roomId = "";
        sendResponse({});
    });
    return true;
}

function ContentScriptMH(request, sender, sendResponse, curRoom) {
    switch(request.type) {
        case "getInitData":
            return getInitData(sendResponse, curRoom);
        case "createRoom":
            return createRoom(request, sendResponse, curRoom);
        case "joinRoom":
            return joinRoom(request, sendResponse, curRoom);
        case "leaveRoom":
            return leaveRoom(sendResponse, curRoom);
        default:
            console.log("Content script didnt know how to deal with ", request.type);
            return false;
    }
}