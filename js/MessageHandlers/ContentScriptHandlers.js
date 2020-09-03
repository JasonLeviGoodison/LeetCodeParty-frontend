function getInitData(sendResponse, curRoom) {
    sendResponse(curRoom.getInitData());
    return;
}

function createRoom(request, sendResponse, curRoom) {
    let payload = {
        problemId: request.data.problemId,
        userId: curRoom.getUserID()
    };
    socket.emit(CREATE_ROOM_MESSAGE, payload, function(data) {
        curRoom.setUserCreatedRoom(data.roomId, data.problemId);
        addNewMembersToRoom(curRoom, [
            buildNewMemberInRoom(curRoom.getNumberOfMembers(), curRoom.getUserID(), true, data.nicknameInfo)
        ], function () {
            sendResponse(curRoom.getInitData());
        });
    });
    return true;
}

function startRoomTimer(request, curRoom) {
    curRoom.setRoomStartedTimestamp(request.data.ts);
}

function displayCode(request, curRoom) {
    modal.openModal(
        request.data.code,
        request.data.domName,
        curRoom.getRoomID(),
        curRoom.getUserID(),
        request.data.viewedUserUUID,
    );
}

function joinRoom(request, sendResponse, curRoom) {
    let payload = {
        roomId: request.data.roomId,
        userId: curRoom.getUserID()
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
        curRoom.setRoomID(request.data.roomId);

        // Since we are joining the room, this user is the first member of the room (to them)
        var newMembers = [];
        newMembers.push(buildNewMemberInRoom(0, curRoom.getUserID(), true, data.nicknameInfo))

        for (var i = 0; i < data.members.length; i++) {
            var currMember = data.members[i]
            var currMemberObj = buildNewMemberInRoom(
                curRoom.getNumberOfMembers(),
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
            sendResponse(curRoom.getInitData());
        });
    });
    return true;
}

function leaveRoom(sendResponse, curRoom) {
    socket.emit(LEAVE_ROOM_MESSAGE, { userId: curRoom.getUserID(), roomId: curRoom.getRoomID() }, function(_) {
        handleRoomClosing(curRoom);
        sendResponse({});
    });
    return true;
}

function resetRoom(curRoom) {
    handleRoomClosing(curRoom);
}

function readyUp(sendResponse, curRoom) {
    socket.emit(READY_UP_MESSAGE, { userId: curRoom.getUserID(), roomId: curRoom.getRoomID(), newState: !curRoom.getUserReady() }, function(data) {
        searchAndSetMemberReadyState(curRoom, curRoom.getUserID(), !curRoom.getUserReady(), function() {
            curRoom.toggleUserRoomReady();
            curRoom.checkIfRoomReady();
            sendResponse(curRoom.getInitData());
        });
    });
    return true;
}

function startRoom(sendResponse, curRoom) {
    socket.emit(START_ROOM_MESSAGE, {roomId: curRoom.getRoomID()}, function(data) {
        curRoom.startRoom();
        sendResponse(curRoom.getInitData());
    });
}

function openHowToModal() {
    modal.openHowToModal();
}

function ContentScriptHandlers(request, sender, sendResponse, curRoom) {
    switch(request.type) {
        case GET_INIT_DATA_MESSAGE:
            if (request.data.tabId) {
                curRoom.setTabID(request.data.tabId);
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
        case START_ROOM_TIMER_MESSAGE:
            return startRoomTimer(request, curRoom);
        case DISPLAY_CODE_MESSAGE:
            return displayCode(request, curRoom);
        case OPEN_HOW_TO_MODAL:
            return openHowToModal();
        default:
            console.log("Content script didnt know how to deal with ", request.type);
            return false;
    }
}
