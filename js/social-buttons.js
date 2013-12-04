var socialButtons = function() {



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

	};


	var getFacebookCount = function(url) {

	};


	var getGplusCount = function(url) {

	};


	return {
		getTwitterCount: getTwitterCount,
		getLinkedinCount: getLinkedinCount
	}

}();