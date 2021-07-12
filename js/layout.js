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
	
	/// 閱讀模式
	function activeReadmode () {
		var hideElements = [
		    '#nxg-main-navigator',
		    '#nxg-footer',
		    '#nxg-copyright'
		];

		$(hideElements.join(', ')).hide();
	}

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
		
		/// 設定圖片顯示
		$('#page p img').removeAttr('style');
		$('#page p img').parent().removeAttr('style');
		$('#page p img').css('width', '100%');
		
		/// 新增FB需要的Meta標籤
        	addFbMeta();
		addSocialSharingbuttons();
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

    var addSocialSharingbuttons = function () {
        /// 分享網址與分享訊息
        var shareLink = window.location.href;
        var title = $('#page .contentheading').text().replace('\t', '').replace('\n', '');
        var text = $('#page p')[1].innerText;

        /// FB 按鈕
        var FB = '<a class="resp-sharing-button__link" href="https://facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareLink) + 
        '" target="_blank" rel="noopener" aria-label=""><div class="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg></div></div></a>';

        /// Twitter
        var Twitter = '<a class="resp-sharing-button__link" href="https://twitter.com/intent/tweet/?text=' + encodeURIComponent(text) + 'amp;url=' + encodeURIComponent(shareLink) + 
        '" target="_blank" rel="noopener" aria-label=""><div class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg></div></div></a>';

        /// LinkedIn
        var LinkedIn = '<a class="resp-sharing-button__link" href="https://www.linkedin.com/shareArticle?mini=true&amp;url=' + encodeURIComponent(shareLink) + '&amp;title=' + encodeURIComponent(title) + '&amp;summary=' + encodeURIComponent(text) + '&amp;source=' + encodeURIComponent(shareLink) + 
        '" target="_blank" rel="noopener" aria-label=""><div class="resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z"/></svg></div></div></a>';


        /// Mail
        var Mail = '<a class="resp-sharing-button__link" href="mailto:?subject=' + encodeURIComponent(title) + '&amp;body=' + encodeURIComponent(shareLink) + 
        '" target="_self" rel="noopener" aria-label=""><div class="resp-sharing-button resp-sharing-button--email resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z"/></svg></div></div></a>';

        // 插入按鈕
        $('.articleinfo')
            .css('margin-bottom', '10px')
            .after('<div class="shareButtons"></div>');
        $('.shareButtons')
            .css('margin-bottom', '24px')
            .append(FB)
            .append(Twitter)
            .append(LinkedIn)
            .append(Mail);

        $('.resp-sharing-button').css('font-size', '.8em');

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
		    	
			if ( window.location.search.includes('readmode=on') )
                		activeReadmode();
			
		};

}(window, jQuery));
