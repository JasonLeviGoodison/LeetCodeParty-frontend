$(function() {

  function initRoomRefreshDom(send, tabs, initData, initRoomData) {
      console.log("Refreshing Init Room Dom: ", initRoomData);

      var problemId = getProblemID(tabs);
      if (!problemId) {
          showError("Please select a problem before starting the party");
          return;
      }

      if (!initData || initData.roomId === "") {
          var urlParams = getParams(tabs[0].url);
          let roomIdFromUrl = urlParams['roomId'];

          if (roomIdFromUrl) {
              send(JOIN_ROOM_MESSAGE, {
                  roomId: roomIdFromUrl.toLowerCase(),
                  problemId: problemId
              }, function(response) {
                  showConnected(response.roomId, tabs);
                  updateUsersInRoom(response.preStartedData.members);
              });
          }
      }
  }

  function preStartedRoomRefreshDom(send, tabs, initData, preStartedData) {
      console.log("Refreshing Pre Room Started Dom: ", preStartedData);

      if (initData && initData.roomId !== "") {
          showConnected(initData.roomId, tabs);
      }

      $( "#slider-input" ).prop( "checked", preStartedData.sideBarOpen );

      if (preStartedData.members) {
          updateUsersInRoom(preStartedData.members);
      }

      if (preStartedData.amReady === true || preStartedData.amReady === false) {
          updateReadyUpButton(preStartedData.amReady);
      }

      if (preStartedData.amHost === true) {
          updateHostLeaveButton();
      }

      showStartRoomButton(preStartedData.roomReady && preStartedData.amHost);
  }

  function roomStartedRefreshDom(send, tabs, initData, roomStartedData) {
      console.log("Refresh Room Started Dom: ", roomStartedData);

      if (roomStartedData.amSubmitted === undefined) {
          showRoomStartedNotSubmittedContent(new Date(Date.parse(roomStartedData.roomStartedTS)));
      } else {
          showRoomStartedSubmittedContent(roomStartedData.amSubmitted);
      }

      showFinishedMembersContent(send, roomStartedData.finishedMembers);
  }

  function refreshDom(send, tabs, initData) {

      if (initData && initData.errorMessage) {
          showError(initData.errorMessage);
          return;
      }

      var problemId = getProblemID(tabs);
      if (!problemId) {
          showError("Please select a problem before starting the party");
          return;
      }

      switch (initData.roomState) {
          case INIT_ROOM_STATE:
              initRoomRefreshDom(send, tabs, initData, initData.initRoomData);
              break;
          case PRE_STARTED_ROOM_STATE:
              preStartedRoomRefreshDom(send, tabs, initData, initData.preStartedData);
              break;
          case STARTED_ROOM_STATE:
              roomStartedRefreshDom(send, tabs, initData, initData.roomStartedData);
              break;
          default:
              console.log("Unknown Room State: ", initData.roomState);
      };
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
