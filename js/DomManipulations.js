// connected/disconnected state
var showConnected = function(roomId, tabs) {
    var urlWithSessionId = tabs[0].url.split('?')[0] + '?roomId=' + encodeURIComponent(roomId);
    $('.disconnected').addClass('hidden');
    $('.connected').removeClass('hidden');
    $('#share-url').val(urlWithSessionId).focus().select();
};

// updates users in room list
var updateUsersInRoom = function(members) {
    if (!members) return;
    $('.members-in-room-list').empty();
    for (var i = 0; i < members.length; i++) {
        var currMem = members[i];

        var domElement = "<p style='font-weight:bold;'> " + currMem.domName + " " + currMem.domIsMe + " " + currMem.domReady;
        $('.members-in-room-list').append(domElement);
    }
}

var showError = function(errorMessage) {
    $('.connected').addClass('hidden');
    $('.disconnected').addClass('hidden');
    $('.some-error').removeClass('hidden');
    $("#error-msg").text(errorMessage);
};

var unshowError = function() {
    $('.connected').addClass('hidden');
    $('.disconnected').removeClass('hidden');
    $('.some-error').addClass('hidden');
    $("#error-msg").text("");
}

var showDisconnected = function() {
    $('.disconnected').removeClass('hidden');
    $('.connected').addClass('hidden');
    $('#control-lock').prop('checked', false);
};

var updateHostLeaveButton = function() {
    $('#leave-room').text('Close Room');
}

var updateReadyUpButton = function(state) {
    if (state) {
        $('#ready-up').text('Un Ready');
    } else {
        $('#ready-up').text('Ready up');
    }
}

var showStartRoomButton = function(show) {
    if (show) {
        $('#start-room').show();
    } else {
        $('#start-room').hide();
    }
}

var displayUserFinished = function (userId, metaData) {
    for (var i = 0; i < curRoomV2.getNumberOfMembers(); i++) {
        let curMem = curRoomV2.getMemberAt(i);

        if (curMem.userUUID === userId) {
            let text = createUserSubmittedText(curMem)
            metaData = {... metaData, curMem}
            sideBar.enqueue(text, USER_SUBMITTED, metaData);
            break;
        }
    }
}

var disableCodeArea = function() {
    $("div[class*=\"react-codemirror2\"]").addClass("disableCode")
}

var enableCodeArea = function() {
    $("div[class*=\"react-codemirror2\"]").removeClass("disableCode")
}

// resets all html to its original state
var resetHTML = function() {
    showStartRoomButton(false);
    updateReadyUpButton(false);
}

var totalSecondsBetween = function(time1, time2) {
    return Math.abs((time1 - time2) / 1000);
}

var secondsToMinsAndSeconds = function(secondsString) {
    return [
        padToTwoChar(Math.round(secondsString / 60)),
        padToTwoChar(Math.round(secondsString % 60))
    ];
}

var showRoomStartedContent = function(roomStartedTS) {
    $(".active-game").show();
    $(".connected").hide();
    $(".disconnected").hide();

    var currTS = new Date();
    var totalSecondsSoFar = totalSecondsBetween(currTS.getTime(), roomStartedTS.getTime());

    function setElapsedTime() {
        ++totalSecondsSoFar;
        let [ minsString, secondsString ] = secondsToMinsAndSeconds(totalSecondsSoFar);
        $("#elapsed-minutes").text(minsString);
        $("#elapsed-seconds").text(secondsString);
    }

    setElapsedTime();
    setInterval(setElapsedTime, 1000);
}

var showUserSubmittedContent = function(roomStartedData, roomStartedTS) {
    const { members } = roomStartedData;
    let userSubmittedList = $('#users-that-submitted');
    userSubmittedList.empty();

    for (var i = 0; i < members.length; i++) {
        var currMem = members[i];

        if (currMem.submissionData != null) {
            $('.loader').remove();

            var finishTimeSeconds = totalSecondsBetween(currMem.submissionData.time, roomStartedTS.getTime());
            let [ minsString, secondsString ] = secondsToMinsAndSeconds(finishTimeSeconds);

            var domElement = "<p style='font-weight:bold;'> " + currMem.domName + " " + currMem.domIsMe + " (" + minsString + ":" + secondsString + ")";
            userSubmittedList.append(domElement);
        }
    }
}
