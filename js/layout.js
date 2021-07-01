(function (global, $) {
	var nxg = global.nxg;
	var namespace = nxg.namespace;

	/// 頁面類型
	var pageType = (function (){
		var qstr = global.location.search;
		if ( qstr.includes('view=article') && qstr.includes('landingpage=true') )
			return 'Landing Page';
		if ( qstr.includes('view=article') )
			return 'Article';
		if ( qstr.includes('view=blog') )
			return 'Blog';

		// 預設值
		return "default";
	}());

	/// Landing Page
	function initLandingPage () {

	}

	/// Arctile Page
	function initArticlePage () {

	}

	/// Blog Page
	function initBlogPage () {

	}

	/********************
	 * Export Modules
	 *******************/
	var layout = namespace('global.nxg.layout');
		layout.type = pageType;

		layout.initialize = function () {
			if (pageType === 'Landing Page')
				initLandingPage();
			
			if (pageType === 'Article')
				initArticlePage();

			if (pageType === 'Blog')
				initArticlePage();

			if (pageType === 'default')
				initLandingPage();
		};

}(window, jQuery));
