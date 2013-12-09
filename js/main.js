$(document).ready(function() {

	// $('.button-list.showcount').each(function() {
	// 	var $total = $(this).find('.total-shares');
	// 	$(this).find('.social-button').addSocialCounts('http://smallbusiness.com/', true, function(data) {
	// 		$total.text(socialButtons.totalShares(data));
	// 	});
	// });

	var socialButtons = new SocialButtons({
		url: 'http://smallbusiness.com',
		selector: '.social-button',
		summary: 'Sample Summary',
		twitterAccount: 'smallbusiness'
	});

	socialButtons.addSocialCounts('[data-showcount="true"]', true, function() {
		console.log('Dat callback is working.');
	});

});