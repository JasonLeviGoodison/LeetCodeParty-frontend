function userAlreadyInRoom(curRoom, userUUID) {
    for (var i = 0; i < curRoom.getNumberOfMembers(); i++) {
        var currMember = curRoom.getMemberAt(i);

        if (currMember.userUUID === userUUID) {
            return true;
        }
    }

    return false;
}

function addNewMembersToRoom(curRoom, newMembers, cb) {
    for (var i = 0; i < newMembers.length; i++) {
        curRoom.addMember(newMembers[i]);
    }

    curRoom.sortMembers();
    return cb();
}

function fallbackNicknameInfo() {
    return {
        nickname_color: "#ff0000",
        nickname: "Jumping Jackrabbit"
    }
}

function buildNewMemberInRoom(memNumber, userUUID, isMe, nicknameInfo) {
    var domIsMe = "";
    if (isMe) {
        domIsMe = "(Me)"
    }

    // Handle the edge case where nicknameInfo is undefined
    if (!nicknameInfo) {
        nicknameInfo = fallbackNicknameInfo();
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
    for (var i = 0; i < curRoom.getNumberOfMembers(); i++) {
        var currMember = curRoom.getMemberAt(i);

        if (currMember.userUUID === memberUUID) {
            let readyStateName = readyState === true ? "ready" : "not ready";
            sideBar.enqueue(currMember.domName + " is " + readyStateName, 'info');
            setMemberReadyState(currMember, readyState);
            break;
        }
    }

    callback();
}

function searchAndSetMemberSubmissionDataState(curRoom, memberUUID, meta, callback) {
    for (var i = 0; i < curRoom.getNumberOfMembers(); i++) {
        var currMember = curRoom.getMemberAt(i);
        if (currMember.userUUID === memberUUID) {
            currMember.meta = meta;
            break;
        }
    }
    callback();
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
