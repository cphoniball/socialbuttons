$(document).ready(function() {

	var socialButtons = new SocialButtons({
		getCount: true,
		url: 'http://smallbusiness.com',
		selector: '.social-button',
		summary: 'Sample Summary',
		twitterAccount: 'smallbusiness'
	});

	socialButtons.addSocialCounts(true, '[data-showcount="true"]');

	// You can use this construction to do various things with the data returned from the API call
	// e.g. save to database, etc.
	socialButtons.sharedRequest.done(function(data, status, xhr) {
		// The count information is available via socialButtons.count
		console.log(socialButtons.count);
		// Sum of all counts is available through socialButtons.count
		console.log(socialButtons.totalCount);
	});

});