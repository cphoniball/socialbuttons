// counts down to start() for async tests
// from so http://stackoverflow.com/questions/9431597/unit-testing-ajax-requests-with-qunit
function createAsyncCounter(count) {
	count = count || 1;
	return function() { --count || start(); };
}

asyncTest('getTwitterCount', function() {
	var countDown = createAsyncCounter(3);

	function testTwitter(url) {
		socialButtons.getTwitterCount(url).done(function(data, status, xhr) {
			deepEqual(typeof data.count, 'number');
		}).always(countDown);
	}

	testTwitter('http://smallbusiness.com');
	testTwitter('http://google.com');
	testTwitter('http://smallbusiness.com/make-sell/digital-marketing/tips-from-etsy/');
});

asyncTest('getLinkedinCount', function() {
	var countDown = createAsyncCounter(3);

	function testLinkedin(url) {
		socialButtons.getLinkedinCount(url).done(function(data, status, xhr) {
			deepEqual(typeof data.count, 'number');
		}).always(countDown);
	}

	testLinkedin('http://smallbusiness.com');
	testLinkedin('http://google.com');
	testLinkedin('http://smallbusiness.com/make-sell/digital-marketing/tips-from-etsy/');
});

asyncTest('getFacebookCount', function() {
	var countDown = createAsyncCounter(3);

	function testFacebook(url) {
		socialButtons.getFacebookCount(url).done(function(data, status, xhr) {
			deepEqual(typeof data.shares, 'number');
		}).always(countDown);
	}

	testFacebook('http://smallbusiness.com');
	testFacebook('http://google.com');
	testFacebook('http://smallbusiness.com/make-sell/digital-marketing/tips-from-etsy/');
});
