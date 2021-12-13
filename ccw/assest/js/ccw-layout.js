(function (global, $) {
    // initialize global variables
    var ccw = global.ccw;

    // default configs
    var ccwDefault = {
        thumbUrl: "http://www.esri.tw/images/ccw/layout/blog/default-thumb.jpg"
    }

    // 判斷頁面類型
    var getPageType = function () {
        var qstr = global.location.search,
            ccwContent = $('#ccw-source-content').length;

        if ( qstr.includes('view=article') && ccwContent )  return 'single-page';
        if ( qstr.includes('view=article') && !ccwContent ) return 'article';
        if ( qstr.includes('layout=blog') )   return 'blog';
        if ( qstr.includes('searchword=') ) return 'search';
        
        return "default"; // 預設值
    };

    // ============================
    //      single-page
    // ============================
    var initSinglePage = function () {
        // 搬移內容
        $('#ccw-content').append( $('#ccw-source-content')[0].innerHTML );
        $('#ccw-source-content').remove();
    };

    // ============================
    //      article
    // ============================
    var initArticlePage = function () {
        // do something ...
    };

    // ============================
    //      Blog
    // ============================
    var initBlogPage = function () {
        var articles = _getArticles($('#jv-source-content')),
            articlesHTML = _createArticlesHTML(articles);
        
        // var pagination = _getPagination(),
        //     paginationHTML = _createPaginationHTML(pagination);

        $('#ccw-content').append(articlesHTML);
        // $('#ccw-content').append(paginationHTML);
    };

    function _getArticles (jvroot) {
        var articles = new Array();
         
        jvroot.find('.contentpaneopen').each(function (i, node) {
            if ( i%2 === 0 ) { // 標題列
                var aNode = $(node).find('a')[0];
                articles.push({ 
                    'title': aNode.innerText, 
                    'link': aNode.href 
                });
            } 
            else { // 文章摘頁內容
                var idx = parseInt(i/2); /// 第幾篇文章
                $(node).find('td').each(function (j, tdNode) {
                    if (j === 0) 
                        articles[idx]['author'] = _decorateAuthor(tdNode.innerText);
                    if (j === 1) 
                        articles[idx]['createDate'] = _decorateDate(tdNode.innerText);
                    if (j === 2) 
                        articles[idx]['summary'] = tdNode.innerText;
                    if (j === 2) 
                        articles[idx]['thumbUrl'] = !($(tdNode).find('.thumb').length)? '': $(tdNode).find('.thumb')[0][0].src;
                });
            }
        });

        return articles;
    }

    function _decorateAuthor (text) {
        return text.replace(/(\r|\t|\n)/gm, "").replace("作者是 ","").split(" ")[0];
    }

    function _decorateDate(text) {
        text = text.replace(/(\r|\t|\n)/gm, "").split(",")[1].split(" ");
        return text[1] + " " + text[2] + ", " + text[3];
    }

    function _createArticlesHTML (articles) {
        var startHTML = '<div class="grid-container"><div class="column-24"><div class="block-group block-group-3-up tablet-block-group-1-up">',
            endHTML = '</div><!-- block-group --></div><!-- column-24 --></div><!-- grid-container -->';
        var contentHTML = '';
        
        articles.forEach(function (article) {
            /// 修正文章內容
            article.summary = article.summary.substring(0, 100) + ' ...';
            article.thumbUrl = !(article.thumbUrl)? ccwDefault.thumbUrl: article.thumbUrl;
            /// 建立HTML
            var articleHTML = '<div class="card block  leader-1 trailer-1"><figure class="card-image-wrap"><a href="{{link}}"><img class="card-image" src="{{thumbUrl}}" alt="{{title}}"></a></figure><div class="card-content"><h3><a class="link-darker-gray" href="{{link}}">{{title}}</a></h3><p class="font-size--2"><span class="icon-ui-calendar">{{createDate}}</span><span class="icon-ui-authorize padding-left-2">{{author}}</span></p><p class="font-size--1">{{summary}}</p><p class="font-size--1"><a class="link-darker-gray" href="{{link}}">閱讀本文</a></p></div></div>'
                               .replaceAll('{{author}}'    , article.author)
                               .replaceAll('{{createDate}}', article.createDate)
                               .replaceAll('{{link}}'      , article.link)
                               .replaceAll('{{summary}}'   , article.summary)
                               .replaceAll('{{thumbUrl}}'  , article.thumbUrl)
                               .replaceAll('{{title}}'     , article.title);

            contentHTML = contentHTML + articleHTML;
        });

        return startHTML + contentHTML + endHTML;
    }

    function _getPagination () {
        var config = new Array();

        return config;        
    }

    function _createPaginationHTML (pagination) {
        
    }

    // ============================
    //      search
    // ============================
    var initSearchPage = function () {
        // do something ...
    };

    // ============================
    //      initialize layout
    // ============================
    var initLayout = function () {
        if ( getPageType() === 'single-page') initSinglePage();
        if ( getPageType() === 'article')     initArticlePage();
        if ( getPageType() === 'blog')        initBlogPage();
        if ( getPageType() === 'search')      initSearchPage();
    };

    // ========================================================
    //      Export Modules & add Document Onload Event
    // ========================================================
    var layout = ccw.namespace('global.ccw.layout');
        
    ccw.addOnLoadEvent(initLayout);

}(window, jQuery));
