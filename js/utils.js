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

function handleRoomClosing(curRoom) {
	curRoom.resetRoom();
	window.history.replaceState({}, null, removeURLParameter(window.location.toString(), "roomId"));
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

function createUserSubmittedText(curMem) {
	return curMem.domName + curMem.domIsMe;
}

function rankMembersSubmissions(members) {
	return members.sort((a, b) => (a.meta.points > b.meta.points) ? 1 : -1)
}

function padToTwoChar(val) {
	var valString = val + "";
	if (valString.length < 2) {
		return "0" + valString;
	} else {
		return valString;
	}
}