function SocketListen(socket, curRoom) {
    socket.on("newMember", (data) => {
        handleNewMemberMsg(curRoom, data.userId, data.nicknameInfo);
    });
}

function handleNewMemberMsg(curRoom, memberId, nicknameInfo) {
    if (!userAlreadyInRoom(curRoom, memberId)) {
        let newUser = buildNewMemberInRoom(curRoom.members.length, memberId, false, nicknameInfo);
        curRoom.members.push(newUser);
        sideBar.enqueue(newUser.dom, 'newuser');
    }
}
