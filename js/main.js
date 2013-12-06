$(document).ready(function() {

	$('.social-button').initSocialButtons({
		url: 'http://smallbusiness.com/',
		title: 'Sample title',
		summary: 'Sample summary',
		twitterAccount: 'smallbusiness'
	});

	$('.button-list.showcount').each(function() {
		var $total = $(this).find('.total-shares');
		$(this).find('.social-button').addSocialCounts('http://smallbusiness.com/', true, function(data) {
			$total.text(socialButtons.totalShares(data));
		});
	});

});