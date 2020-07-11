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
	var problemSplit = urlSplit.split("/")
	if (problemSplit.length <= 0) {
		return null;
	}

	return problemSplit[0];
}
