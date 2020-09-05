function PopupButtonHandlers(send, tabs) {
    $("#copy-button").click( () => {
        var copyText = document.getElementById("share-url");
      
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        var tooltip = document.getElementById("tool-tip");
        tooltip.innerHTML = "Copied link!"
      });

    $("#random-problem").click(function() {
        console.log("Sending random problem key");
        chrome.tabs.update(tabs[0].id, {url: "https://leetcode.com/problems/random-one-question/all"})
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

    $('#how-to-button').click(function() {
        send(OPEN_HOW_TO_MODAL);
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
            send(START_ROOM_TIMER_MESSAGE, {
                ts: roomStartedTS
            }, function(response) {});
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
