function userAlreadyInRoom(curRoom, userUUID) {
    for (var i = 0; i < curRoom.members.length; i++) {
        if (curRoom.members[i].userUUID === userUUID) {
            return true;
        }
    }

    return false;
}

function addNewMembersToRoom(curRoom, newMembers, cb) {
    for (var i = 0; i < newMembers.length; i++) {
        curRoom.members.push(newMembers[i]);
    }

    function compare(a, b) {
        return a.nicknameInfo.nickname.localeCompare(b.nicknameInfo.nickname);
    }

    curRoom.members.sort(compare);

    return cb();
}

function buildNewMemberInRoom(memNumber, userUUID, isMe, nicknameInfo) {
    var domIsMe = "";
    if (isMe) {
        domIsMe = "(Me)"
    }

    return {
        userUUID: userUUID,
        nicknameInfo: nicknameInfo,
        isMe: isMe,
        isReady: false,

        domName: "<span class='letter-spacing-2px' style='color:" + nicknameInfo.nickname_color + ";'>" + nicknameInfo.nickname + "</span>",
        domIsMe: domIsMe,
        domReady: ""
    };
}

function searchAndSetMemberReadyState(curRoom, memberUUID, readyState, callback) {
    for (var i = 0; i < curRoom.members.length; i++) {
        if (curRoom.members[i].userUUID === memberUUID) {
            let readyStateName = readyState === true ? "ready" : "not ready";
            sideBar.enqueue(curRoom.members[i].domName + " is " + readyStateName, 'info');
            setMemberReadyState(curRoom.members[i], readyState);
            break;
        }
    }

    return callback();
}

function setMemberReadyState(member, readyState) {
    var readyStateVal = "(<img class='inline-img' src='../../images/ready-button.png' alt='ready' width='16px' height='16px'>)";
    if (!readyState) {
        readyStateVal = "";
    }

    member.domReady = readyStateVal;
    member.isReady = readyState;
    return;
}

function allUsersReady(curRoom) {
    for (var i = 0; i < curRoom.members.length; i++){
        if (!curRoom.members[i].isReady) {
            return false;
        }
    }

    return true;
}
