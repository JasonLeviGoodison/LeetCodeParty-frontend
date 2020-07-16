$(function() {
  let joinParty = $('#join-session');
  let problemId = '';

  function handleRemoveNameError(partyName, errorText) {
    console.log(partyName, errorText)
    if (partyName == "") {
      console.log("going to remove class")
      errorText.removeClass("hidden")
      console.log(errorText)
    } else {
      if (!errorText.hasClass("hidden")) {
        errorText.addClass("hidden")
      }
    }
  }

  joinParty.click(function() {
    let errorText = $("#errorJoinInput");
    let partyName = $("#session-input-join").val();
    handleRemoveNameError(partyName, errorText)
  });

  // get the current tab
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {

    // send a message to the content script
    var sendMessageToContentScript = function(type, data, callback) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: type,
          data: data
        }, function(response) {
          console.log("response", response)
          if (response && response.errorMessage) {
            showError(response.errorMessage);
            return;
          }
          if (callback) {
            callback(response);
          }
        });
    };

    sendMessageToContentScript('getInitData', {}, function(initData) {
        var problemId = getProblemID(tabs);

        if (!problemId) {
          showError("Please select a problem before starting the party");
          return;
        }

        // initial state
        console.log("InitData: ", initData);
        if (initData && initData.errorMessage) {
          showError(initData.errorMessage);
          return;
        }
        if (initData.members && initData.members.length > 0) {
          updateUsersInRoom(initData.members);
        }
        if (!initData || initData.roomId === "") {
          var urlParams = getParams(tabs[0].url);
          console.log(urlParams);
          let roomIdFromUrl = urlParams['roomId'];
          if (roomIdFromUrl) {
            console.log("room id rom url", roomIdFromUrl)
            sendMessageToContentScript('joinRoom', {
              roomId: roomIdFromUrl.toLowerCase(),
              problemId: problemId
            }, function(response) {
              showConnected(roomIdFromUrl);
            });
          }
        } else {
          showConnected(initData.roomId);
        }
      });

      $('#create-session').click(function() {
        sendMessageToContentScript('createRoom', {
            problemId: getProblemID(tabs)
        }, function(response) {
          showConnected(response.roomId);
          updateUsersInRoom(response.members);
        });
      });

      $('#leave-room').click(function() {
        sendMessageToContentScript('leaveRoom', {}, function(response) {
          showDisconnected();
        });
      });

      // connected/disconnected state
      var showConnected = function(roomId) {
        var urlWithSessionId = tabs[0].url.split('?')[0] + '?roomId=' + encodeURIComponent(roomId);
        $('.disconnected').addClass('hidden');
        $('.connected').removeClass('hidden');
        $('#show-chat').prop('checked', true);
        $('#share-url').val(urlWithSessionId).focus().select();
      };

      // updateUsersInRoom state
      var updateUsersInRoom = function(members) {
        for (var i = 0; i < members.length; i++) {
          $('ul.members-in-room-list').append(members[i].dom);
        }
      }

      // connected/disconnected state
      var showError = function(errorMessage) {
        $('.connected').addClass('hidden');
        $('.disconnected').addClass('hidden');
        $('.some-error').removeClass('hidden');
        $("#error-msg").text(errorMessage);
      };

      var showDisconnected = function() {
        $('.disconnected').removeClass('hidden');
        $('.connected').addClass('hidden');
        $('#control-lock').prop('checked', false);
      };
  });
});