var getParams = function (url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

var getProblemID = function(tabs) {
	if (tabs.length <= 0) {
		return null;
	}
	var urlSplit = tabs[0].url.split("/problems/")
	if (urlSplit.length <= 1) {
		return null;
	}
	var problemSplit = urlSplit[1].split("/")
	if (problemSplit.length <= 0) {
		return null;
	}

	return problemSplit[0];
}

function userAlreadyInRoom(curRoom, userUUID) {
	for (var i = 0; i < curRoom.members.length; i++) {
		if (curRoom.members[i].userUUID === userUUID) {
			return true;
		}
	}

	return false;
}

function buildNewMemberInRoom(memNumber, userUUID, isMe, nicknameInfo) {
	var userIndex = "User " + memNumber;
	if (isMe) {
		userIndex = "Me"
	}

	return {
		userUUID: userUUID,
		dom: "<li style='weight:bold;'>" + userIndex + " (<span style='color:" + nicknameInfo.nickname_color + ";'>" + nicknameInfo.nickname + "</span>)</li>",
		nicknameInfo: nicknameInfo
	};
}

function handleRoomClosing(curRoom) {
	resetCurRoom(curRoom);
	window.history.replaceState({}, null, removeURLParameter(window.location.toString(), "roomId"));
}

function resetCurRoom(curRoom) {
	curRoom.user = "";
	curRoom.roomId = "";
	curRoom.problemId = "";
	curRoom.socket = "";
	curRoom.members = [];
}

// https://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
function removeURLParameter(url, parameter) {
	//prefer to use l.search if you have a location/link object
	var urlparts = url.split('?');
	if (urlparts.length >= 2) {

		var prefix = encodeURIComponent(parameter) + '=';
		var pars = urlparts[1].split(/[&;]/g);

		//reverse iteration as may be destructive
		for (var i = pars.length; i-- > 0;) {
			//idiom for string.startsWith
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {
				pars.splice(i, 1);
			}
		}

		return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
	}
	return url;
}
