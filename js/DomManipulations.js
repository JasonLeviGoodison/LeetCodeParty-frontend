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
    for (var i = 0; i < members.length; i++) {
        $('.members-in-room-list').append(members[i].dom);
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