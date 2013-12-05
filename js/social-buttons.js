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

	var getIndividualCount = function(site, url) {
		if (site === 'facebook') {

		}
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

	var generateShareUrl = function(site, options) {
		if (site === 'facebook') {
			return 'http://www.facebook.com/sharer/sharer.php?u=' + options.url;
		} else if (site === 'pinterest') {
			var shareUrl = 'http://pinterest.com/pin/create/button/?url=' + options.url;
			if (typeof options.summary === 'string') {
				shareUrl += '&description=' + options.summary;
			}
			if (typeof options.imageUrl === 'string') {
				shareUrl += '&media=' + options.imageUrl;
			}
			return shareUrl;
		} else if (site === 'linkedin') {
			var shareUrl = 'http://www.linkedin.com/shareArticle?mini=true&url=' + options.url + '&source=' + options.url;
			if (typeof options.title === 'string') {
				shareUrl += '&title=' + options.title;
			}
			if (typeof options.summary === 'string') {
				shareUrl += '&summary=' + options.summary;
			}
			return shareUrl;
		} else if (site === 'google-plus') {
			return 'http://plus.google.com/share?url=' + options.url;
		} else if (site === 'twitter') {
			var shareUrl = 'https://twitter.com/intent/tweet?url=' + options.url;
			if (typeof options.title === 'string') {
				shareUrl += '&text=' + options.title;
			}
			if (typeof options.twitterAccount === 'string') {
				shareUrl += '&via=' + options.twitterAccount
			}
			return shareUrl;
		}
	}

	return {
		getTwitterCount: getTwitterCount,
		getLinkedinCount: getLinkedinCount,
		getFacebookCount: getFacebookCount,
		getPinterestCount: getPinterestCount,
		getSharedcount: getSharedcount,
		extractSharedcountData: extractSharedcountData,
		generateShareUrl: generateShareUrl
	}

}();

(function() {

	$.fn.addSocialCounts = function(url) {
		var url = url || this.data('url');
		var $buttons = this.find('.social-button[data-showcount="true"]');


		socialButtons.getSharedcount(url).done(function(data, status, xhr) {
			$buttons.each(function(i, e) {
				if ($(this).data('showcount') === true) {
					var contents = $(this).html();
					var count = socialButtons.extractSharedcountData($(this).data('site'), data);
					if (count) {
						$(this).html(contents + '<span class="social-count">' + count + '</span>');
					}
				}
			});
		});
	};

	$.fn.initSocialButtons = function(options) {
		var settings = {
			url: 'http://example.com/', // note that the URL must contain a trailing slash, or twitter will add a / to the end of the tweet
			title: false,
			summary: false,
			twitterAccount: false,
			targetBlank: true
		};

		if (typeof options.title === 'undefined') return false;
		$.extend(settings, options);

		if (settings.targetBlank) {
			this.each(function(i, e) {
				$(this).attr('target', '_blank');
			});
		}

		this.each(function(i, e) {
			var site = $(this).data('site');
			var shareUrl = socialButtons.generateShareUrl(site, settings);
			$(this).attr('href', shareUrl);
		});
	};

})();