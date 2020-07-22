function SocketListen(socket, curRoom) {
    socket.on("newMember", (data) => {
        handleNewMemberMsg(curRoom, data.userId, data.nicknameInfo);
    });
    socket.on("roomClosing", (data) => {
        handleRoomClosing(curRoom);
    });
    socket.on("userLeftRoom", (data) => {
        handleUserLeftRoom(curRoom, data.userId);
    });
    socket.on("userReadyUp", (data) => {
        handleUserReadyUp(curRoom, data.userId, data.readyState);
    });
    socket.on("roomReady", (data) => {
        handleRoomReady(curRoom, data.allUsersReady);
    });
}

function handleNewMemberMsg(curRoom, memberId, nicknameInfo) {
    if (!userAlreadyInRoom(curRoom, memberId)) {
        let newUser = buildNewMemberInRoom(curRoom.members.length, memberId, false, nicknameInfo);
        curRoom.members.push(newUser);
        sideBar.enqueue(newUser.domName + " joined the room" , 'info');

        curRoom.roomReady = allUsersReady(curRoom);
    }
}

function handleUserLeftRoom(curRoom, userId) {
    for (var i = 0; i < curRoom.members.length; i++ ) {
        console.log("Comparing: " + curRoom.members[i].userUUID + " and " + userId);
        sideBar.enqueue(curRoom.members[i].domName + " left the room" , 'info');
        if (curRoom.members[i].userUUID === userId) {
            curRoom.members.splice(i, 1);
            break;
        }
    }
}

function handleUserReadyUp(curRoom, userId, readyState) {
    searchAndSetMemberReadyState(curRoom, userId, readyState, function() {
        curRoom.roomReady = allUsersReady(curRoom);
    });
}

function handleRoomReady(curRoom, roomReady) {
    console.log("Handling Room Ready: ", roomReady);
    curRoom.roomReady = roomReady;
}
