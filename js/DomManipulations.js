// connected/disconnected state
var showConnected = function(roomId, tabs) {
    var urlWithSessionId = tabs[0].url.split('?')[0] + '?roomId=' + encodeURIComponent(roomId);
    $('.disconnected').addClass('hidden');
    $('.connected').removeClass('hidden');
    $('#share-url').val(urlWithSessionId).focus().select();
    $("#toggle").addClass("toggle-center");
    $("#toggle").removeClass("hidden");
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
    $('.disconnected').show();
    $('.connected').hide();
    $('#control-lock').prop('checked', false);
    $("#toggle").removeClass("toggle-center");
    $("#toggle").addClass("hidden");
};

var updateHostLeaveButton = function() {
    $('#leave-room').text('Close Room');
}

var updateCloseActiveRoomButton = function(openV) {
    $('.active-game-close-room').show();
    $( "#slider-input" ).prop( "checked", openV );
    $("#toggle").addClass("toggle-left");
    $("#toggle").removeClass("hidden");
}

var forceSidebarDOM = function(openV) {
    $( "#slider-input" ).prop( "checked", openV );
    $("#toggle").addClass("toggle-center");
    $("#toggle").removeClass("hidden");
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
            curRoomV2.setUserSubmitted(metaData);
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

var showRoomStartedNotSubmittedContent = function(roomStartedTS) {
    $(".active-game").show();
    $(".connected").hide();
    $(".disconnected").hide();
    $(".active-game-not-submitted").show();
    $(".active-game-submitted").hide();

    var currTS = new Date();
    var totalSecondsSoFar = secondsBetweenDates(currTS, roomStartedTS);

    function setElapsedTime() {
        ++totalSecondsSoFar;
        $("#elapsed-minutes").text(padToTwoChar(Math.round(totalSecondsSoFar / 60)));
        $("#elapsed-seconds").text(padToTwoChar(Math.round(totalSecondsSoFar % 60)));
    }

    setElapsedTime();
    setInterval(setElapsedTime, 1000);
}

var secondsBetweenDates = function(dateA, dateB) {
    return Math.abs((dateA.getTime() - dateB.getTime()) / 1000);
}

var showRoomStartedSubmittedContent = function(metadata) {
    $(".active-game").show();
    $(".connected").hide();
    $(".disconnected").hide();
    $(".active-game-not-submitted").hide();
    $(".active-game-submitted").show();

    $("#submitted-info-runtime").text("Runtime: " + metadata.runTime);
    $("#submitted-info-memory").text("Memory: " + metadata.memoryUsage);

    var secDiff = secondsBetweenDates(new Date(metadata.finishTime), new Date(metadata.startTime));
    $("#submitted-info-time-to-write-min").text(padToTwoChar(Math.round(secDiff / 60)))
    $("#submitted-info-time-to-write-sec").text(padToTwoChar(Math.round(secDiff % 60)));
}

var showFinishedMembersContent = function(send, finishedMembers) {
    if (!finishedMembers || finishedMembers.length == 0) return;
    $('.users-submitted-list').empty();
    $('.no-users-submitted-yet-loader').hide();

    for (var i = 0; i < finishedMembers.length; i++) {
        var info = buildFinishedMemberDom(finishedMembers[i]);
        let dom = info[0];
        let buttonID = info[1];
        let code = finishedMembers[i].code;
        let domName = finishedMembers[i].curMem.domName;
        let viewedUserUUID = finishedMembers[i].curMem.userUUID;
        let sendCopy = send;

        $('.users-submitted-list').append(dom);
        $('#' + buttonID).click(function() {
            sendCopy(DISPLAY_CODE_MESSAGE, {
                code: code,
                domName: domName,
                viewedUserUUID: viewedUserUUID
            }, function(response) {});
        });
    }
}

var buildFinishedMemberDom = function(memberMetaData) {
    let buttonId = memberMetaData.curMem.userUUID + (Math.ceil(Math.random()*1000));

    var finishedMemberDom = "<a id='" + buttonId + "' class='finished-member-entry'>" + memberMetaData.curMem.domName;

    finishedMemberDom += " (" + memberMetaData.runTime + ")";
    finishedMemberDom += " (" + memberMetaData.memoryUsage + ")";

    var dom = finishedMemberDom + "</a>";

    return [dom, buttonId];
}

var showGameOver = function(members) {
    $(".connected").hide();
    $(".disconnected").hide();
    $(".active-game-not-submitted").hide();
    $(".active-game").hide();
    $(".active-game-users-submitted").hide();

    $("#endgame").removeClass("hidden");

    members = rankMembersSubmissions(members);
    
    for (var i = 0; i < members.length; i++) {
        var currMem = members[i];

        var domElement = "<p style='font-weight:bold;'> " + (i+1) + ". " + currMem.domName + " " + currMem.domIsMe;
        $('.rankings').append(domElement);
    }
}

var removeGameOver = function(members) {
    $("#endgame").addClass("hidden");
    $('.rankings').empty();
}

var showNotOnProblemScreen = function(onLeetcode = false) {
    $('.connected').addClass('hidden');
    $('.disconnected').addClass('hidden');

    var text = "Sorry, this is only available on Leetcode. Please navigate there, or click the button below.";
    if (onLeetcode) {
        text = "Sorry, you need to have a problem chosen. Choose a random one with the button below.";
    }

    $('.not-on-leetcode-text').text(text);
    $('.not-on-leetcode').removeClass('hidden');
}
