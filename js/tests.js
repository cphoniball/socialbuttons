// counts down to start() for async tests
// from so http://stackoverflow.com/questions/9431597/unit-testing-ajax-requests-with-qunit
function createAsyncCounter(count) {
	count = count || 1;
	return function() { --count || start(); };
}

asyncTest('getSiteCount', function() {
	var countDown = createAsyncCounter(12);

	function testSiteCount(site, url) {
		socialButtons.getSiteCount(site, url).done(function(data, status, xhr) {
			deepEqual(typeof data, 'object');
		}).always(countDown);
	}

	testSiteCount('facebook', 'http://smallbusiness.com');
	testSiteCount('facebook', 'http://google.com');
	testSiteCount('facebook', 'http://smallbusiness.com/make-sell/digital-marketing/tips-from-etsy/');

	testSiteCount('twitter', 'http://smallbusiness.com');
	testSiteCount('twitter', 'http://google.com');
	testSiteCount('twitter', 'http://smallbusiness.com/make-sell/digital-marketing/tips-from-etsy/');

	testSiteCount('linkedin', 'http://smallbusiness.com');
	testSiteCount('linkedin', 'http://google.com');
	testSiteCount('linkedin', 'http://smallbusiness.com/make-sell/digital-marketing/tips-from-etsy/');

	testSiteCount('pinterest', 'http://smallbusiness.com');
	testSiteCount('pinterest', 'http://google.com');
	testSiteCount('pinterest', 'http://smallbusiness.com/make-sell/digital-marketing/tips-from-etsy/');
});