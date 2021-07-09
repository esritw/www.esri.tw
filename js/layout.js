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
		/// 設定頁面顏色
		$('body').css('background', '#f8f9fa');

		/// 在 #page 外建立容器 #nxg-content
		$('#page').before('<div id="nxg-content"></div>');
		$('#nxg-content').append($('#page')).addClass(['ui', 'text', 'container']);

		/// 設定標題顏色
		$('#page h1, #page h2, #page h3, #page h4, #page h5, #page h6').css('color', '#0079c1');

		/// 設定文字與段落
		$('#page p').css('font-size', '18px')
			    .css('text-indent', '36px')
			    .css('text-align', 'justify')
			    .css('line-height', '1.8')
			    .css('margin-bottom', '24px');

		// 修正網站自動產生的元素
		var autoComponents = [
			'.contentheading',  /// 標題
			'.articleinfo',	    /// 更新時間, 作者, 建立時間
			'.buttonheading',   /// pdf, 列印, mail 功能
			'.iteminfo'	    /// 所屬的單元, 分類 
		];

		autoComponents.forEach(function (ele, idx) {
			var selector = '#page > ' + ele;

			if ( $(selector).length > 0 ) {	
				/// 修正文章標題顯示方式
				if (ele === '.contentheading') {
					$(selector)
					  .css('margin-top', '64px')
					  .css('font-size', '36px')
					  .css('color', 'black')
					  .css('margin-bottom', '24px');
				}

				/// 修正articleinfo顯示資訊
				if (ele === '.articleinfo')
					addArticleInfo (selector);
				

				/// 移除網站自動產生的 pdf預覽, 列印, mail 功能
				if (ele === '.buttonheading' || ele === '.iteminfo')
					$(selector).remove();

			}
		});
		
		/// 新增FB需要的Meta標籤
        	addFbMeta();
		addFbBtn();
	}

	/// Blog Page
	function initBlogPage () {

	}
    
    /********************
     * private functions
     *******************/
    var addArticleInfo = function (selector) {
        var infos = new Object();

        $(selector).children().each(function (idx, ele) {
            var text = ele.innerText;

            if ( ele.classList.contains('createdby') ) 
                infos.author = ele.innerText.split(' ')[1];
            
            if ( ele.classList.contains('createdate') ) {
                var createdate = ele.innerText.split(' ');
                infos.date = createdate[2] + ' ' + createdate[1] + ', &nbsp;&nbsp;'+  createdate[3];
            }
        });

        $(selector).empty();
        $(selector).css('text-indent', '0px').append(infos.date + ' &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; ' + infos.author);    
    };

    var addFbMeta = function () {
        var pageUrl = window.location.href,
            pageTitle = $('#page .contentheading').text(),
            pageImage = !( $('#page img').attr('src') )? "http://www.esri.tw/images/rwd/header/idtlogo.png": $('#page img').attr('src');

        var metas = [
            '<meta property="og:url"   content="' + pageUrl + '" />',
            '<meta property="og:type"  content="website" />',
            '<meta property="og:title" content="' + pageTitle + '" />',
            '<meta property="og:image" content="' + pageImage + '" />'
        ];

        $('head').prepend( metas.join('') );
    };

    var addFbBtn = function () {
        /// 初始化 fb
        $('body').append('<div id="fb-root"></div>');
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v11.0";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // 建立按鈕
        var shareBtn = '<div class="fb-share-button" data-href="' + window.location.href + '" data-layout="button"></div>';
        $('.articleinfo')
            .css('margin-bottom', '10px')
            .after('<div class="shareButtons"></div>');
        $('.shareButtons')
            .css('margin-bottom', '24px')
            .append(shareBtn);

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
