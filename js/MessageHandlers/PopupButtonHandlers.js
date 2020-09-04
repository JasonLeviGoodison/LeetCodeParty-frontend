function PopupButtonHandlers(send, tabs) {
    $("#copy-button").click( () => {
        var copyText = document.getElementById("share-url");
      
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        var tooltip = document.getElementById("tool-tip");
        tooltip.innerHTML = "Copied link!"
      });
    
    $('#create-session').click(function() {

        send(CREATE_ROOM_MESSAGE, {
            problemId: getProblemID(tabs)
        }, function(response) {
            if (response.roomId) {
                send(TOGGLE_SIDEBAR_MESSAGE);
                showConnected(response.roomId, tabs);
                updateUsersInRoom(response.preStartedData.members);
                updateHostLeaveButton();
            }
        });
    });
    
    $("#toggle-sidebar").click(() => {
        send(TOGGLE_SIDEBAR_MESSAGE);
    });
    
    $('#leave-room').click(function() {
        send(LEAVE_ROOM_MESSAGE, {}, function(response) {
            console.log("Showing disconnected!")
            showDisconnected();
            resetHTML();
        });
    });

    $('#ready-up').click(function() {
        send(READY_UP_MESSAGE, {}, function(response) {
            updateUsersInRoom(response.preStartedData.members);
            updateReadyUpButton(response.preStartedData.amReady);
            showStartRoomButton(response.preStartedData.roomReady && response.preStartedData.amHost);
        });
    });

    $('#close-error').click(function() {
        send(RESET_ROOM_MESSAGE, {}, function(response) {
            unshowError();
        });
    });

    $('#start-room').click(function() {
        send(START_ROOM_MESSAGE, {}, function(response) {

            var roomStartedTS = new Date();
            showRoomStartedNotSubmittedContent(roomStartedTS);

            if (response.preStartedData.amHost === true) {
                updateCloseActiveRoomButton(response.preStartedData.sideBarOpen);
            }

            send(START_ROOM_TIMER_MESSAGE, {
                ts: roomStartedTS
            }, function(response) {});
        });
    });

    $('#close-active-room-button').click(function() {
        send(TOGGLE_SIDEBAR_MESSAGE, {}, function() {});
        send(LEAVE_ROOM_MESSAGE, {}, function(response) {
            showDisconnected();
            resetHTML();

            $(".active-game-not-submitted").hide();
            $(".active-game").hide();
            $(".active-game-users-submitted").hide();
            $(".active-game-close-room").hide();
        });
    });

    $('#endgame-button').click(function() {
        send(RESET_ROOM_MESSAGE, {}, function(response) {
            showDisconnected();
            removeGameOver();
            resetHTML();
        });
    });
}
