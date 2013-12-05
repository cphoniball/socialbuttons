$(document).ready(function() {

	$('.social-button').initSocialButtons({
		url: 'http://smallbusiness.com/',
		title: 'Sample title',
		summary: 'Sample summary',
		twitterAccount: 'smallbusiness'
	});

	$('.showcount').each(function() {
		$(this).addSocialCounts(false, true);
	});



});