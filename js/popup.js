$(function() {

  function refreshDom(send, tabs, initData) {
      var problemId = getProblemID(tabs);

      if (!problemId) {
          showError("Please select a problem before starting the party");
          return;
      }

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

      if (initData.amHost === true) {
          updateHostLeaveButton();
      }

      showStartRoomButton(initData.roomReady && initData.amHost);

      if (!initData || initData.roomId === "") {
          var urlParams = getParams(tabs[0].url);
          let roomIdFromUrl = urlParams['roomId'];

          if (roomIdFromUrl) {
              send(JOIN_ROOM_MESSAGE, {
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
  }

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    var tabID = tabs[0].id;

    var send = function(type, data, callback) {
        chrome.tabs.sendMessage(tabID, {
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

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        PopupMessageHandlers(message, sendResponse, function(initData) {
            if (message.forTabId != tabID) {
                console.log("Caught message for different tabID");
                return;
            }

            refreshDom(send, tabs, initData);
        })
    });

    send(GET_INIT_DATA_MESSAGE, {
        tabId: tabID
    }, function(initData) {
        refreshDom(send, tabs, initData);
    });

    PopupButtonHandlers(send, tabs);
  });
});