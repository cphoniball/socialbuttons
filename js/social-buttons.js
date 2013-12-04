var socialButtons = function() {

	jQuery.sharedCount = function(url, fn) {
		url = encodeURIComponent(url || location.href);
		var arg = {
			url: "//" + (location.protocol == "https:" ? "sharedcount.appspot" : "api.sharedcount") + ".com/?url=" + url,
			cache: true,
			dataType: "json"
		};
		if ('withCredentials' in new XMLHttpRequest) {
			arg.success = fn;
		} else {
			var cb = "sc_" + url.replace(/\W/g, '');
			window[cb] = fn;
			arg.jsonpCallback = cb;
			arg.dataType += "p";
		}
		return jQuery.ajax(arg);
	};

	var getSharedcount = function(url) {
		return $.sharedCount(url);
	};

	var getTwitterCount = function(url) {
		return $.ajax({
			url: 'http://cdn.api.twitter.com/1/urls/count.json?url=' + url,
			dataType: 'jsonp'
		});
	};


	var getLinkedinCount = function(url) {
		return $.ajax({
			url: 'http://www.linkedin.com/countserv/count/share?url=' + url,
			dataType: 'jsonp'
		});
	};


	var getPinterestCount = function(url) {
		return $.ajax({
			url: 'http://api.pinterest.com/v1/urls/count.json?url=' + url,
			dataType: 'jsonp'
		});
	};

	var getFacebookCount = function(url) {
		return $.ajax({
			url: 'http://graph.facebook.com/?id=' + url,
			dataType: 'jsonp'
		});
	};




	return {
		getTwitterCount: getTwitterCount,
		getLinkedinCount: getLinkedinCount,
		getFacebookCount: getFacebookCount,
		getPinterestCount: getPinterestCount,
		getSharedcount: getSharedcount
	}

}();