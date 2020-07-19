function SocketListen(socket, curRoom) {
    socket.on("newMember", (data) => {
        handleNewMemberMsg(curRoom, data.userId, data.nicknameInfo);
    });
}

function handleNewMemberMsg(curRoom, memberId, nicknameInfo) {
    if (!userAlreadyInRoom(curRoom, memberId)) {
        curRoom.members.push(buildNewMemberInRoom(curRoom.members.length, memberId, false, nicknameInfo));
    }
}
