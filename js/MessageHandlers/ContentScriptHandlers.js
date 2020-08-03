var sideBar = new SideBar();
var modal = new Modal();

function buildInitData(curRoom) {
    return {
        roomId: curRoom.roomId,
        members: curRoom.members,
        sideBarOpen: sideBar.sidebarOpen,
        amReady: curRoom.amReady,
        roomReady: curRoom.roomReady,
        roomStarted: curRoom.roomStarted,
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
    socket.emit(CREATE_ROOM_MESSAGE, payload, function(data) {
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

    socket.emit(JOIN_ROOM_MESSAGE, payload, function(data) {
        
        if (data.errorMessage) {
            sendResponse({ errorMessage: data.errorMessage });
            return false;
        }

        if (data.problemId !== request.data.problemId) {
            socket.emit(LEAVE_ROOM_MESSAGE, null, function(data) {
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
    socket.emit(LEAVE_ROOM_MESSAGE, { userId: curRoom.userId, roomId: curRoom.roomId }, function(_) {
        handleRoomClosing(curRoom);
        sendResponse({});
    });
    return true;
}

function resetRoom(curRoom) {
    handleRoomClosing(curRoom);
}

function readyUp(sendResponse, curRoom) {
    socket.emit(READY_UP_MESSAGE, { userId: curRoom.userId, roomId: curRoom.roomId, newState: !curRoom.amReady }, function(data) {
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

function startRoom(sendResponse, curRoom) {
    socket.emit(START_ROOM_MESSAGE, {roomId: curRoom.roomId}, function(data) {
        curRoom.roomStarted = true;
        sendResponse();
    });
}

function ContentScriptHandlers(request, sender, sendResponse, curRoom) {
    switch(request.type) {
        case GET_INIT_DATA_MESSAGE:
            if (request.data.tabId) {
                curRoom.tabId = request.data.tabId;
            }

            return getInitData(sendResponse, curRoom);
        case CREATE_ROOM_MESSAGE:
            return createRoom(request, sendResponse, curRoom);
        case JOIN_ROOM_MESSAGE:
            return joinRoom(request, sendResponse, curRoom);
        case LEAVE_ROOM_MESSAGE:
            return leaveRoom(sendResponse, curRoom);
        case READY_UP_MESSAGE:
            return readyUp(sendResponse, curRoom);
        case TOGGLE_SIDEBAR_MESSAGE:
            return sideBar.toggleSidebar()
        case ENQUE_IN_SIDEBAR:
            console.log(request)
            const { text, eventType } = request.data;
            return sideBar.enqueue(text, eventType);
        case RESET_ROOM_MESSAGE:
            return resetRoom(curRoom);
        case START_ROOM_MESSAGE:
            return startRoom(sendResponse, curRoom);
        default:
            console.log("Content script didnt know how to deal with ", request.type);
            return false;
    }
}