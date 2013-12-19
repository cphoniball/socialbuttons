var SocialButtons = function(options) {

	/****************
	// Public vars
	****************/
	this.count = {}; // equal to data returned from sharedCount API
	this.totalCount = false; // equal to totalCount once request has been made
	this.sharedRequest = false; // equal to the $.ajax promise object once the request has been made

	/****************
	// Private vars
	****************/
	var settings = {
		selector: '.social-button',
		url: 'http://example.com/', // note that the URL must contain a trailing slash, or twitter will add a / to the end of the tweet
		title: false,
		summary: false, //
		twitterAccount: false, // will be used as the twitter .via
		imageUrl: false,
		targetBlank: true, // sets target = blank on all buttons
		getCount: false,
		internalEndpoint: false // internal endpoint for ajax functions
	};

	$.extend(settings, options);

	var $buttons = $(settings.selector);
	var instance = this;

	/****************
	// Public methods
	****************/

	// Calls to the sharedcount API

	// Makes the sharedcount call and returns the jqXHR object
	// Uses the jQuery plugin provided on sharedcount.com, as the service does not like the jQuery jsonp wrapper
	// Args:
	//    url: url to get share count for
	this.getSharedcount = function(fn) {
		var url = encodeURIComponent(settings.url || location.href);
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
		instance.sharedRequest = jQuery.ajax(arg);

		instance.sharedRequest.done(function(data, status, xhr) {
			instance.count = data;
			instance.totalCount = instance.extractTotalShares(data);
		});

		return instance.sharedRequest;
	};

	// Makes a request to get a social media share count from an individual site
	// This makes the request directly to the service and does not go through sharedcount.com
	// GooglePlus is not available, as they do not have a readily accessible http endpoint to get shared counts
	// Args:
	//   site: one of 'facebook', 'twitter', 'linkedin', or 'pinterest'
	//   url: url to get share count for
	this.getSiteCount = function(site) {
		if (site === 'facebook') {
			return $.ajax({
				url: 'http://graph.facebook.com/?id=' + settings.url,
				dataType: 'jsonp'
			});
		} else if (site === 'twitter') {
			return $.ajax({
				url: 'http://cdn.api.twitter.com/1/urls/count.json?url=' + settings.url,
				dataType: 'jsonp'
			});
		} else if (site === 'linkedin') {
			return $.ajax({
				url: 'http://www.linkedin.com/countserv/count/share?url=' + settings.url,
				dataType: 'jsonp'
			});
		} else if (site === 'pinterest') {
			return $.ajax({
				url: 'http://api.pinterest.com/v1/urls/count.json?url=' + settings.url,
				dataType: 'jsonp'
			});
		} else return false;
	};

	// Internals calls to PHP functions, which will retrieve stored data from the server. Use these functions to reduce the number of API calls that are made to sharedcount.com

	// Should return an array of social data that is stored internally
	// Returns the jqXHR object so that different data formats may be dealt with
	this.getInternalSocialData = function() {
		return $.ajax({
			url: settings.internalEndpoint,
			dataType: 'json',
			method: 'GET',
			data: {
				action: 'social-buttons-get',
				url: settings.url
			}
		});
	};

	this.getLatestInternalSocialData = function() {
		return $.ajax({
			url: settings.internalEndpoint,
			dataType: 'json',
			method: 'GET',
			data: {
				action: 'social-buttons-get-latest',
				url: settings.url
			}
		});
	};

	// Sends new social count data from sharedcount.com to the internal server to be written to the database
	this.updateInternalSocialData = function(callback) {
		var socialData = instance.getSharedcount();
		socialData.done(function(data, status, xhr) {
			data.timestamp = new Date().getTime() / 1000; // number of seconds since epoch
			data.action = 'social-buttons-update';
			$.ajax({
				url: settings.internalEndpoint,
				dataType: 'json',
				method: 'POST',
				data: data
			}).done(callback);
		});
	};

	// Sets up a watch on the current social buttons object
	// This means that instead of automatically fetching the social count from the sharedcount API,
	// social buttons will first check with the internal server to see if it has data newer than "interval" seconds
	// If it does, it uses that data; if not, it calls the updateInternalSocialData method and uses that data instead
	this.watch = function(interval) {
		var socialData = instance.getLatestInternalSocialData();
		socialData.done(function(data, status, xhr) {
			var currentTime = new Date().getTime() / 1000;
			if (data.timestamp < (currentTime - interval) {
				instance.updateInternalSocialData();
			}
		});
	};

	// Returns total share count for Facebook, Twitter, Pinterest, and LinkedIn
	// Args:
	//   data: Data returned by the request to sharedcount.com
	this.extractTotalShares = function(data) {
		return data.Facebook.total_count + data.Twitter + data.Pinterest + data.LinkedIn;
	}

	// Returns share count for individual site
	// Args:
	//   site: name of site you'd like information for, one of 'facebook', 'pinterest', 'linkedin', 'google-plus', and 'twitter'
	this.extractSiteData = function(site, data) {
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

	// Displays social count on buttons
	// Buttons must have the data attribute 'showcount' set to true
	// Additionally, you may optionally filter by selector 'filterSelector'
	// Args:
	//   showLoader: true if you want a spinning loader to appear while the function waits for ajax call to finish
	//   filterSelector: filters buttons to only show the count on some of them
	//   callback: runs a callback after social counts have been added, passing in the count data to the function
	this.addSocialCounts = function(showLoader, filterSelector, callback) {
		if (!settings.getCount) return false;

		var $filteredButtons = $buttons;
		if (filterSelector) $filteredButtons = $buttons.filter(filterSelector);

		if (showLoader) {
			$filteredButtons.each(function(i, e) {
				$(this).append('<i class="fa fa-spinner fa-spin"></i>');
			});
		}

		instance.sharedRequest.done(function() {
			// set buttons that will get social counts added
			$filteredButtons.each(function(i, e) {
				if ($(this).data('showcount') === true) {
					var count = instance.extractSiteData($(this).data('site'), instance.count);
					if (showLoader) { $(this).find('.fa-spinner').remove(); }
					if (count) {
						$(this).append('<span class="social-count">' + count + '</span>');
					}
				}
			});
			if (callback) callback(data);
		});

		return $buttons;
	}




	/****************
	// Private methods
	****************/


	// Generates the correct http endpoint for each of the social sharing services
	// Args:
	//   site: social network to generate url for, one of 'facebook', 'twitter', 'google-plus' or 'linkedin'
	//   options: should be the same object that is passed in to $.fn.initSocialButtons, see that documention for options
	var _generateShareUrl = function(site) {
		if (site === 'facebook') {
			return 'http://www.facebook.com/sharer/sharer.php?u=' + settings.url;
		} else if (site === 'pinterest') {
			var shareUrl = 'http://pinterest.com/pin/create/button/?url=' + settings.url;
			if (typeof settings.summary === 'string') {
				shareUrl += '&description=' + settings.summary;
			}
			if (typeof settings.imageUrl === 'string') {
				shareUrl += '&media=' + settings.imageUrl;
			}
			return shareUrl;
		} else if (site === 'linkedin') {
			var shareUrl = 'http://www.linkedin.com/shareArticle?mini=true&url=' + settings.url + '&source=' + settings.url;
			if (typeof settings.title === 'string') {
				shareUrl += '&title=' + settings.title;
			}
			if (typeof settings.summary === 'string') {
				shareUrl += '&summary=' + settings.summary;
			}
			return shareUrl;
		} else if (site === 'google-plus') {
			return 'http://plus.google.com/share?url=' + settings.url;
		} else if (site === 'twitter') {
			var shareUrl = 'https://twitter.com/intent/tweet?url=' + settings.url;
			if (typeof settings.title === 'string') {
				shareUrl += '&text=' + settings.title;
			}
			if (typeof settings.twitterAccount === 'string') {
				shareUrl += '&via=' + settings.twitterAccount
			}
			return shareUrl;
		}
	}

	// init function
	var _init = function() {
		// set buttons to open in another window
		if (settings.targetBlank) {
			$buttons.each(function(i, e) {
				$(this).attr('target', '_blank');
			});
		}

		// get social counts if settings.getCount = true
		if (settings.getCount) {
			instance.getSharedcount();
		}

		// Set URLs on each of the buttons to the proper share endpoint
		$buttons.each(function(i, e) {
			var site = $(this).data('site');
			var shareUrl = _generateShareUrl(site, settings);
			$(this).attr('href', shareUrl);
		});
	}();

};