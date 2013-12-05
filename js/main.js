$(document).ready(function() {

	$('.showcount').each(function() {
		$(this).addSocialCounts();
	});

	$('.social-button').initSocialButtons({
		url: 'http://smallbusiness.com/',
		title: 'Sample title',
		summary: 'Sample summary',
		twitterAccount: 'smallbusiness'
	});

});