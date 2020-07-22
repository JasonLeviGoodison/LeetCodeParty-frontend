$(function() {
  let roomId = '';

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {

    var send = function(type, data, callback) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: type,
          data: data
        }, function(response) {
          
          if (response && response.errorMessage) {
            showError(response.errorMessage);
            return;
          }
          
          if (callback) {
            callback(response);
          }

        });
    };

    send('getInitData', {}, function(initData) {
        var problemId = getProblemID(tabs);

        if (!problemId) {
          showError("Please select a problem before starting the party");
          return;
        }
        console.log(initData)
        $( "#slider-input" ).prop( "checked", initData.sideBarOpen );

        if (initData && initData.errorMessage) {
          showError(initData.errorMessage);
          return;
        }

        if (initData.members) {
          updateUsersInRoom(initData.members);
        }

        if (initData.amReady === true || initData.amReady === false) {
          updateReadyUpButton(initData.amReady);
        }

        showStartRoomButton(initData.roomReady && initData.amHost);

        if (!initData || initData.roomId === "") {

          var urlParams = getParams(tabs[0].url);
          let roomIdFromUrl = urlParams['roomId'];
          
          if (roomIdFromUrl) {
            send('joinRoom', {
              roomId: roomIdFromUrl.toLowerCase(),
              problemId: problemId
            }, function(response) {
              showConnected(response.roomId, tabs);
              updateUsersInRoom(response.members);
            });
          }
        } else {
          showConnected(initData.roomId, tabs);
        }
      });

      PopupButtonHandlers(send, tabs);
  });
});