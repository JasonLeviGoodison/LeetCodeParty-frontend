var sideBar = new SideBar();

function buildInitData(curRoom) {
    return {
        roomId: curRoom.roomId,
        members: curRoom.members,
        sideBarOpen: sideBar.sidebarOpen,
        amReady: curRoom.amReady,
        roomReady: curRoom.roomReady,
        amHost: curRoom.amHost
    };
}

function getInitData(sendResponse, curRoom) {
    sendResponse(buildInitData(curRoom));
    return;
}

function createRoom(request, sendResponse, curRoom) {
    let payload = {
        problemId: request.data.problemId,
        userId: curRoom.userId
    };
    socket.emit('createRoom', payload, function(data) {
        curRoom.roomId = data.roomId;
        curRoom.problemId = data.problemId;
        curRoom.amHost = true;
        addNewMembersToRoom(curRoom, [
            buildNewMemberInRoom(curRoom.members.length, curRoom.userId, true, data.nicknameInfo)
        ], function () {
            sendResponse({
                roomId: curRoom.roomId,
                members: curRoom.members,
            });
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

        // Set the current room ID
        curRoom.roomId = request.data.roomId;

        // Since we are joining the room, this user is the first member of the room (to them)
        var newMembers = [];
        newMembers.push(buildNewMemberInRoom(0, curRoom.userId, true, data.nicknameInfo))

        for (var i = 0; i < data.members.length; i++) {
            var currMember = data.members[i]
            var currMemberObj = buildNewMemberInRoom(
                curRoom.members.length,
                currMember.participant_user_uuid,
                false,
                {
                    nickname: currMember.nickname,
                    nickname_color: currMember.nickname_color
                }
            )

            // Set if this user is ready or not
            setMemberReadyState(currMemberObj, currMember.ready);

            newMembers.push(currMemberObj)
        }

        addNewMembersToRoom(curRoom, newMembers, function () {
            sendResponse({
                roomId: curRoom.roomId,
                members: curRoom.members
            });
        });
    });
    return true;
}

function leaveRoom(sendResponse, curRoom) {
    socket.emit('leaveRoom', { userId: curRoom.userId, roomId: curRoom.roomId }, function(_) {
        handleRoomClosing(curRoom);
        sendResponse({});
    });
    return true;
}

function readyUp(sendResponse, curRoom) {
    socket.emit('readyUp', { userId: curRoom.userId, roomId: curRoom.roomId, newState: !curRoom.amReady }, function(data) {
        searchAndSetMemberReadyState(curRoom, curRoom.userId, !curRoom.amReady, function() {
            curRoom.amReady = !curRoom.amReady;
            curRoom.roomReady = allUsersReady(curRoom);
            var obj = {
                members: curRoom.members,
                readyState: curRoom.amReady,
                allUsersReady: curRoom.roomReady,
                amHost: curRoom.amHost
            };
            sendResponse(obj);
        });
    });
    return true;
}

function ContentScriptHandlers(request, sender, sendResponse, curRoom) {
    switch(request.type) {
        case "getInitData":
            return getInitData(sendResponse, curRoom);
        case "createRoom":
            return createRoom(request, sendResponse, curRoom);
        case "joinRoom":
            return joinRoom(request, sendResponse, curRoom);
        case "leaveRoom":
            return leaveRoom(sendResponse, curRoom);
        case "readyUp":
            return readyUp(sendResponse, curRoom);
        case "sidebar-toggle":
            return sideBar.toggleSidebar()
        case "sidebar-enqueue":
            console.log(request)
            const { text, eventType } = request.data;
            return sideBar.enqueue(text, eventType);
        default:
            console.log("Content script didnt know how to deal with ", request.type);
            return false;
    }
}