var socialButtons = function() {

	// Get functions, retrieves share counts
	// This is a jQuery extension from sharedcount.com, as the jQuery jsonp module
	// cachebusts too aggressively for their API
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

	// Makes the sharedcount call and returns the jqXHR object
	// Args:
	//    url: url to get share count for
	var getSharedcount = function(url) {
		return $.sharedCount(url);
	};

	// Makes a request to get a social media share count from an individual site
	// This makes the request directly to the service and does not go through sharedcount.com
	// GooglePlus is not available, as they do not have a readily accessible http endpoint to get shared counts
	// Args:
	//   site: one of 'facebook', 'twitter', 'linkedin', or 'pinterest'
	//   url: url to get share count for
	var getSiteCount = function(site, url) {
		if (site === 'facebook') {
			return $.ajax({
				url: 'http://graph.facebook.com/?id=' + url,
				dataType: 'jsonp'
			});
		} else if (site === 'twitter') {
			return $.ajax({
				url: 'http://cdn.api.twitter.com/1/urls/count.json?url=' + url,
				dataType: 'jsonp'
			});
		} else if (site === 'linkedin') {
			return $.ajax({
				url: 'http://www.linkedin.com/countserv/count/share?url=' + url,
				dataType: 'jsonp'
			});
		} else if (site === 'pinterest') {
			return $.ajax({
				url: 'http://api.pinterest.com/v1/urls/count.json?url=' + url,
				dataType: 'jsonp'
			});
		} else return false;
	};

	// Returns total share count for Facebook, Twitter, Pinterest, and LinkedIn
	// Args:
	//   data: Data returned by the request to sharedcount.com
	var extractTotalShares = function(data) {
		return data.Facebook.total_count + data.Twitter + data.Pinterest + data.LinkedIn;
	}

	// Returns share count for individual site
	// Args:
	//   site: name of site you'd like information for, one of 'facebook', 'pinterest', 'linkedin', 'google-plus', and 'twitter'
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

	// Generates the correct http endpoint for each of the social sharing services
	// Args:
	//   site: social network to generate url for, one of 'facebook', 'twitter', 'google-plus' or 'linkedin'
	//   options: should be the same object that is passed in to $.fn.initSocialButtons, see that documention for options
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
		getSharedcount: getSharedcount,
		getSiteCount: getSiteCount,
		sharedcountData: extractSharedcountData,
		totalShares: extractTotalShares,
		generateShareUrl: generateShareUrl
	}

}();

(function() {


	// Sets the URLs for share buttons appropriately. Needs to be called on a class attached to the social buttons themselves
	// Recommended class is 'social-button'
	// Args:
	//   url: base url of the website you're sharing. Must end with a trailing slash.
	//   title: title of the article or page
	//   summary: summary of article or page
	//   twitterAccount: name of the twitter account for @via options
	//   imgUrl: image URL for pinterest shares
	//   targetBlank: whether or not to make the links open in another window, true by default
	$.fn.initSocialButtons = function(options) {
		var settings = {
			url: 'http://example.com/', // note that the URL must contain a trailing slash, or twitter will add a / to the end of the tweet
			title: false,
			summary: false, //
			twitterAccount: false, // will be used as the twitter .via
			imageUrl: false,
			targetBlank: true // sets target = blank on all buttons
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
		return this;
	};


	// Adds social counts to buttons
	// Should be called on buttons themselves
	// Args:
	//   url: URL to get information for. Pass in false if you want to read from data attributes on each button instead
	//   showLoader: boolean, true if you want to show a loader while the http request runs
	//   callback: function, accepts "data" argument which will be the data returned from the http request to sharedcount.com
	$.fn.addSocialCounts = function(url, showLoader, callback) {
		var url = url || this.data('url');
		var $buttons = this;

		if (showLoader) {
			$buttons.each(function(i, e) {
				$(this).append('<i class="fa fa-spinner fa-spin"></i>');
			});
		}

		socialButtons.getSharedcount(url).done(function(data, status, xhr) {
			$buttons.each(function(i, e) {
				if ($(this).data('showcount') === true) {
					var count = socialButtons.sharedcountData($(this).data('site'), data);
					if (showLoader) { $(this).find('.fa-spinner').remove(); }
					if (count) {
						$(this).append('<span class="social-count">' + count + '</span>');
					}
				}
			});
			callback(data);
		});

		return this;
	};



})();