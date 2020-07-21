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
        console.log("User readied up !", data);
    })
    socket.on("roomReady", (data) => {
        console.log("Room Ready: ", data);
    })
}

function handleNewMemberMsg(curRoom, memberId, nicknameInfo) {
    if (!userAlreadyInRoom(curRoom, memberId)) {
        let newUser = buildNewMemberInRoom(curRoom.members.length, memberId, false, nicknameInfo);
        curRoom.members.push(newUser);
        sideBar.enqueue(newUser.dom, 'newuser');
    }
}

function handleUserLeftRoom(curRoom, userId) {
    for (var i = 0; i < curRoom.members.length; i++ ) {
        console.log("Comparing: " + curRoom.members[i].userUUID + " and " + userId);
        if (curRoom.members[i].userUUID === userId) {
            curRoom.members.splice(i, 1);
            break;
        }
    }
}
