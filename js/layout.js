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
		// 修正容器 #page
		$('#page').addClass(['ui', 'grid']);
		$('#page').css('margin-top', '0px');
		
		// 修正網站自動產生的元素
		var autoComponents = [
			'.contentheading',  /// 標題
			'.articleinfo',		/// 更新時間, 作者, 建立時間
			'.buttonheading',   /// pdf, 列印, mail 功能
			'.iteminfo'			/// 所屬的單元, 分類 
		];

		autoComponents.forEach(function (ele, idx) {
			var selector = '#page > ' + ele;
			/// 隱藏所有元素
			$(selector).css('display', 'none');

		});
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
