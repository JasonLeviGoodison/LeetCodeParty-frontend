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

    resetRoom() {
        this.room = {
            roomState: INIT_ROOM_STATE,
            tabId: this.room.tabId,
            userId: "",
            roomId: "",
            problemId: "",
            socket: "",
            amReady: false,
            roomReady: false,
            roomStarted: false,
            amHost: false,
            members: [],
            roomStartedTS: null
        };
    }

    setTabID(tabID) {
        this.room.tabId = tabID;
    }

    setUserID(userID) {
        this.room.userId = userID;
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
        enableCodeArea();
    }

    removeMemberAtIndex(index) {
        this.room.members.splice(index, 1);
    }

    setRoomStartedTimestamp(ts) {
        this.room.roomStartedTS = ts;
    }

    // Getters
    // -------

    getInitData() {
        var initRoomData, preStartedData, roomStartedData;
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
                    members: this.room.members,
                    sideBarOpen: this.sideBar.sidebarOpen,
                    roomStartedTS: this.room.roomStartedTS
                };
        }

        return {
            roomId: this.room.roomId,
            roomState: this.room.roomState,
            initRoomData: initRoomData,
            preStartedData: preStartedData,
            roomStartedData: roomStartedData
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
}


