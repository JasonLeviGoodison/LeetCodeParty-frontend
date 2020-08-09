

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
        send('createRoom', {
            problemId: getProblemID(tabs)
        }, function(response) {
            console.log("got the response from create session", response)
            if (response.roomId) {
                showConnected(response.roomId, tabs);
                updateUsersInRoom(response.members);
                updateHostLeaveButton();
            }
        });
    });
    
    $("#toggle-sidebar").click(() => {
        send('sidebar-toggle');
    });
    
    $('#leave-room').click(function() {
        send('leaveRoom', {}, function(response) {
            showDisconnected();
        });
    });

    $('#ready-up').click(function() {
        send('readyUp', {}, function(response) {
            updateUsersInRoom(response.members);
            updateReadyUpButton(response.readyState);
            showStartRoomButton(response.allUsersReady && response.amHost);
        });
    });
}
