function SocketListen(socket, curRoom) {
    socket.on("newMember", (memberId) => {
        handleNewMemberMsg(curRoom, memberId);
    });
}

function handleNewMemberMsg(curRoom, memberId) {
    if (!userAlreadyInRoom(curRoom, memberId)) {
        curRoom.members.push(buildNewMemberInRoom(curRoom.members.length, memberId, memberId));
    }
}
