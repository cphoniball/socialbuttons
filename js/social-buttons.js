var socialButtons = function() {

	// Get functions, retrieves share counts
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

	var extractSharedcountData = function(site, data) {
		if (!site || !data) return false;

		if (site === 'facebook') {
			return data.Facebook.total_count;
		} else if (site === 'pinterest') {
			return data.Pinterest;
		} else if (site === 'linkedin') {
			return data.LinkedIn;
		} else if (site === 'google-plus') {
			return data.GooglePlusOne;
		} else if (site === 'twitter') {
			return data.Twitter;
		} else {
			return false;
		}
	};

	return {
		getTwitterCount: getTwitterCount,
		getLinkedinCount: getLinkedinCount,
		getFacebookCount: getFacebookCount,
		getPinterestCount: getPinterestCount,
		getSharedcount: getSharedcount,
		extractSharedcountData: extractSharedcountData
	}

}();

(function() {

	$.fn.addSocialCounts = function(url) {
		var url = url || this.data('url');
		var $buttons = this.find('button[data-showcount="true"]');


		socialButtons.getSharedcount(url).done(function(data, status, xhr) {
			$buttons.each(function(i, e) {
				if ($(this).data('showcount') === true) {
					var contents = $(this).html();
					var count = socialButtons.extractSharedcountData($(this).data('site'), data);
					if (count) {
						contents = contents + '<span class="social-count">' + count + '</span>';
						$(this).html(contents);
					}
				}
			});
		});
	};

	$.fn.registerShareButtons = function() {

	};

})();