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
            console.log("got the response from create session", response)
            if (response.roomId) {
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
            console.log("Room Started!");
            showRoomStartedContent();
        });
    });
}
