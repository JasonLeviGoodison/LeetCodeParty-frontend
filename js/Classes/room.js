class Room {
    constructor(sideBar) {
        this.room = {
            tabId: "",
        };
        this.sideBar = sideBar;
        this.resetRoom();
    }

    // Setters
    // -------

    resetRoom(userId = "") {
        this.room = {
            roomState: INIT_ROOM_STATE,
            tabId: this.room.tabId,
            userId: userId,
            roomId: "",
            problemId: "",
            socket: "",
            amReady: false,
            roomReady: false,
            roomStarted: false,
            amHost: false,
            members: [],
            roomStartedTS: null,
            finishedMembers: [],
            amSubmitted: undefined
        };
    }

    setTabID(tabID) {
        this.room.tabId = tabID;
    }

    setUserID(userID) {
        this.room.userId = userID;
        this.sideBar.setHost(userID);
    }

    setRoomInPreStartState() {
        this.room.roomState = PRE_STARTED_ROOM_STATE;
        disableCodeArea();
    }

    setRoomID(roomID) {
        this.room.roomId = roomID;
        this.setRoomInPreStartState();
    }

    setUserCreatedRoom(roomID, problemID) {
        this.setRoomID(roomID);
        this.room.problemId = problemID;
        this.room.amHost = true;
    }

    addMember(newMember) {
        this.room.members.push(newMember);
    }

    sortMembers() {
        function compare(a, b) {
            return a.nicknameInfo.nickname.localeCompare(b.nicknameInfo.nickname);
        }

        this.room.members.sort(compare);
    }

    toggleUserRoomReady() {
        this.room.amReady = !this.room.amReady;
    }

    checkIfRoomReady() {
        let self = this;
        function allUsersReady() {
            for (var i = 0; i < self.getNumberOfMembers(); i++){
                var currMember = self.getMemberAt(i);

                if (!currMember.isReady) {
                    return false;
                }
            }

            return true;
        }

        this.room.roomReady = allUsersReady();
    }

    startRoom() {
        this.room.roomStarted = true;
        this.room.roomState = STARTED_ROOM_STATE;
        this.setRoomStartedTimestamp(new Date());
        enableCodeArea();
    }

    gameOver() {
        this.room.roomState = GAME_OVER_STATE;
    }

    removeMemberAtIndex(index) {
        this.room.members.splice(index, 1);
    }

    setRoomStartedTimestamp(ts) {
        this.room.roomStartedTS = ts;
    }

    setUserSubmitted(metaData) {
        if (metaData.curMem.isMe === true) return;

        for (var i = 0; i < this.room.finishedMembers.length; i++) {
            if (this.room.finishedMembers[i].curMem.userUUID == metaData.curMem.userUUID) {
                return;
            }
        }

        this.room.finishedMembers.push(metaData);
    }

    userSubmittedAnswer(submitMetaData) {
        this.room.amSubmitted = submitMetaData;
    }

    // Getters
    // -------

    getInitData() {
        var initRoomData, preStartedData, roomStartedData, gameOverData;
        switch (this.room.roomState) {
            case INIT_ROOM_STATE:
                initRoomData = {};
                break;
            case PRE_STARTED_ROOM_STATE:
                preStartedData = {
                    members: this.room.members,
                    sideBarOpen: this.sideBar.sidebarOpen,
                    amReady: this.room.amReady,
                    roomReady: this.room.roomReady,
                    roomStarted: this.room.roomStarted,
                    amHost: this.room.amHost
                };
                break;
            case STARTED_ROOM_STATE:
                roomStartedData = {
                    amHost: this.room.amHost,
                    members: this.room.members,
                    sideBarOpen: this.sideBar.sidebarOpen,
                    roomStartedTS: this.room.roomStartedTS,
                    finishedMembers: this.room.finishedMembers,
                    amSubmitted: this.room.amSubmitted
                };
                break;
            case GAME_OVER_STATE:
                gameOverData = {
                    amHost: this.room.amHost,
                    members: this.room.members,
                    sideBarOpen: this.sideBar.sidebarOpen,
                    roomStartedTS: this.room.roomStartedTS,
                    finishedMembers: this.room.finishedMembers,
                    amSubmitted: this.room.amSubmitted
                };
                break;
        }

        return {
            roomId: this.room.roomId,
            roomState: this.room.roomState,
            initRoomData,
            preStartedData,
            roomStartedData,
            gameOverData
        };
    }

    getMessageToPopupData(origin) {
        return {
            origin: origin,
            initData: this.getInitData(),
            forTabId: this.room.tabId,
            readyState: this.room.amReady,
            allUsersReady: this.room.roomReady,
            amHost: this.room.amHost
        }
    }

    getUserID() {
        return this.room.userId;
    }

    getRoomID() {
        return this.room.roomId;
    }

    getNumberOfMembers() {
        return this.room.members.length;
    }

    getUserReady() {
        return this.room.amReady;
    }

    getMemberAt(index) {
        return this.room.members[index];
    }

    getRoomStartedTimestamp() {
        return this.room.roomStartedTS;
    }

    notInRoom() {
        return this.getRoomID() === "" || this.room.roomState == INIT_ROOM_STATE;
    }
}


