function SocketListen(socket, curRoom) {
    socket.on(NEW_MEMBER_MESSAGE, (data) => {
        handleNewMemberMsg(curRoom, data.userId, data.nicknameInfo);
    });
    socket.on(ROOM_CLOSING_MESSAGE, (data) => {
        handleUserRoomClosing(curRoom);
    });
    socket.on(USER_LEFT_MESSAGE, (data) => {
        handleUserLeftRoom(curRoom, data.userId);
    });
    socket.on(USER_READY_UP_MESSAGE, (data) => {
        handleUserReadyUp(curRoom, data.userId, data.readyState);
    });
    socket.on(ROOM_READY_MESSAGE, (data) => {
        handleRoomReady(curRoom, data.allUsersReady);
    });
    socket.on(ROOM_STARTED_MESSAGE, (data) => {
       handleRoomStarted(curRoom);
    });
    socket.on(USER_SUBMITTED, (data) => {
        handleUserSubmitted(curRoom, data.userId, data.meta);
    });
    socket.on(GAME_OVER_MESSAGE, (data) => {
        handleGameOver(curRoom);
    });
    socket.on(USER_VIEWED_CODE_MESSAGE, (data) => {
        handleUserViewedSubmission(data, curRoom);
    });
    socket.on()
}

function handleNewMemberMsg(curRoom, memberId, nicknameInfo) {
    if (!userAlreadyInRoom(curRoom, memberId)) {
        let newUser = buildNewMemberInRoom(curRoom.getNumberOfMembers(), memberId, false, nicknameInfo);

        addNewMembersToRoom(curRoom, [newUser], function () {
            sideBar.enqueue(newUser.domName + " joined the room" , 'info');
            curRoom.checkIfRoomReady();
            SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
        });
    }
}

function handleUserLeftRoom(curRoom, userId) {
    for (var i = 0; i < curRoom.getNumberOfMembers(); i++ ) {
        var currMember = curRoom.getMemberAt(i);

        if (currMember.userUUID === userId) {
            sideBar.enqueue(currMember.domName + " left the room" , 'info');
            curRoom.removeMemberAtIndex(i);
            SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
            break;
        }

    }
}

function handleUserReadyUp(curRoom, userId, readyState) {
    searchAndSetMemberReadyState(curRoom, userId, readyState, function() {
        curRoom.checkIfRoomReady();
        SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
    });
}

function handleRoomReady(curRoom, roomReady) {
    curRoom.checkIfRoomReady();
    SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
}

function handleUserRoomClosing(curRoom) {
    handleRoomClosing(curRoom);
    SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
}

function handleUserSubmitted(curRoom, userId, meta) {
    searchAndSetMemberSubmissionDataState(curRoom, userId, meta, () => {
        displayUserFinished(userId, meta);
        SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function (response) {});
    });
}

function handleRoomStarted(curRoom) {
    curRoom.startRoom();
    sideBar.enqueue("Room has started. Go!!", "info");
    SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
}

function handleGameOver(curRoom) {
    curRoom.gameOver();
    sideBar.enqueue("Game Over! Everyone has submitted", "info");
    SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
}

function handleUserViewedSubmission(data, curRoom) {
    var viewerMember = null;
    var viewedMember = null;
    for (var i = 0; i < curRoom.getNumberOfMembers(); i++) {
        let mem = curRoom.getMemberAt(i);

        if (mem.userUUID == data.viewerUserUUID) {
            viewerMember = mem;
        } else if (mem.userUUID == data.viewedUserUUID) {
            viewedMember = mem;
        }

        if (viewerMember != null && viewedMember != null) {
            break;
        }
    }

    sideBar.enqueue(viewerMember.domName + " viewed a submission from " + viewedMember.domName + "!", "info");
}
