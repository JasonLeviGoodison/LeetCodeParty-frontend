$(function() {
  let createParty = $('#create-session');
  let joinParty = $('#join-session');
  const ENDPOINT = "http://127.0.0.1:4001";
  var userId = ''

  console.log(createParty)

  // check if there is something in the URL to join us into a session

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

  createParty.click(function() {
    let errorText = $("#errorCreateInput");
    var socket = io.connect(ENDPOINT);
    socket.on('userId', function (userId, fn) {
      userId = userId;
      socket.emit("createRoom", {playerId: userId, problemId: "test"})
    });
    //connect and create a new party, get the id and then set that in the 
  });
  joinParty.click(function() {
    let errorText = $("#errorJoinInput");
    let partyName = $("#session-input-join").val();
    handleRemoveNameError(partyName, errorText)
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   chrome.tabs.executeScript(
    //       tabs[0].id,
    //       {code: 'document.body.style.backgroundColor = "' + color + '";'});
    // });
  });
});