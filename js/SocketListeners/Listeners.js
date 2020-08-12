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
}

function handleNewMemberMsg(curRoom, memberId, nicknameInfo) {
    if (!userAlreadyInRoom(curRoom, memberId)) {
        let newUser = buildNewMemberInRoom(curRoom.members.length, memberId, false, nicknameInfo);

        addNewMembersToRoom(curRoom, [newUser], function () {
            console.log("Members of room: ", curRoom.members);
            sideBar.enqueue(newUser.domName + " joined the room" , 'info');

            curRoom.roomReady = allUsersReady(curRoom);

            SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
        });
    }
}

function handleUserLeftRoom(curRoom, userId) {
    for (var i = 0; i < curRoom.members.length; i++ ) {
        console.log("Comparing: " + curRoom.members[i].userUUID + " and " + userId);
        if (curRoom.members[i].userUUID === userId) {
            sideBar.enqueue(curRoom.members[i].domName + " left the room" , 'info');

            curRoom.members.splice(i, 1);

            SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
            break;
        }

    }
}

function handleUserReadyUp(curRoom, userId, readyState) {
    searchAndSetMemberReadyState(curRoom, userId, readyState, function() {
        curRoom.roomReady = allUsersReady(curRoom);

        SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
    });
}

function handleRoomReady(curRoom, roomReady) {
    console.log("Handling Room Ready: ", roomReady);
    curRoom.roomReady = roomReady;

    SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
}

function handleUserRoomClosing(curRoom) {
    handleRoomClosing(curRoom);

    SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
}

function handleUserSubmitted(curRoom, userId, meta) {
    displayUserFinished(userId, meta);
}

function handleRoomStarted(curRoom) {
    console.log("Room marked as started!");
    curRoom.roomStarted = true;

    SendMessageToPopup(UPDATE_DOM_MESSAGE, curRoom, function(response) {});
}
