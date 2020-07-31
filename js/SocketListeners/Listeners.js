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
}

function handleNewMemberMsg(curRoom, memberId, nicknameInfo) {
    if (!userAlreadyInRoom(curRoom, memberId)) {
        let newUser = buildNewMemberInRoom(curRoom.members.length, memberId, false, nicknameInfo);

        addNewMembersToRoom(curRoom, [newUser], function () {
            console.log("Members of room: ", curRoom.members);
            sideBar.enqueue(newUser.domName + " joined the room" , 'info');

            curRoom.roomReady = allUsersReady(curRoom);

            SendMessageToPopup(NEW_MEMBER_MESSAGE, curRoom, function(response) {});
        });
    }
}

function handleUserLeftRoom(curRoom, userId) {
    for (var i = 0; i < curRoom.members.length; i++ ) {
        console.log("Comparing: " + curRoom.members[i].userUUID + " and " + userId);
        if (curRoom.members[i].userUUID === userId) {
            sideBar.enqueue(curRoom.members[i].domName + " left the room" , 'info');

            curRoom.members.splice(i, 1);

            if (curRoom.userId != curRoom.members[i].userUUID) {
                SendMessageToPopup(USER_LEFT_MESSAGE, curRoom, function(response) {});
            }
            break;
        }

    }
}

function handleUserReadyUp(curRoom, userId, readyState) {
    searchAndSetMemberReadyState(curRoom, userId, readyState, function() {
        curRoom.roomReady = allUsersReady(curRoom);

        SendMessageToPopup(USER_READY_UP_MESSAGE, curRoom, function(response) {});
    });
}

function handleRoomReady(curRoom, roomReady) {
    console.log("Handling Room Ready: ", roomReady);
    curRoom.roomReady = roomReady;

    SendMessageToPopup(ROOM_READY_MESSAGE, curRoom, function(response) {});
}

function handleUserRoomClosing(curRoom) {
    handleRoomClosing(curRoom);

    SendMessageToPopup(ROOM_READY_MESSAGE, curRoom, function(response) {});
}
