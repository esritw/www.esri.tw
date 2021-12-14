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
        var articles = blog_posts_getConfig($('#jv-source-content')),
            articlesHTML = blog_posts_createHTML(articles);
        
        var pagination = blog_pagination_getConfig(),
            paginationHTML = blog_pagination_createHTML(pagination);

        $('#ccw-content').append(articlesHTML);
        $('#ccw-content').append(paginationHTML);
    };

    function blog_posts_getConfig (jvroot) {
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
                        articles[idx]['author'] = blog_posts_getAuthor(tdNode.innerText);
                    if (j === 1) 
                        articles[idx]['createDate'] = blog_posts_getDate(tdNode.innerText);
                    if (j === 2) 
                        articles[idx]['summary'] = tdNode.innerText;
                    if (j === 2) 
                        articles[idx]['thumbUrl'] = !($(tdNode).find('.thumb').length)? '': $(tdNode).find('.thumb')[0][0].src;
                });
            }
        });

        return articles;
    }

    function blog_posts_getAuthor (text) {
        return text.replace(/(\r|\t|\n)/gm, "").replace("作者是 ","").split(" ")[0];
    }

    function blog_posts_getDate(text) {
        text = text.replace(/(\r|\t|\n)/gm, "").split(",")[1].split(" ");
        return text[1] + " " + text[2] + ", " + text[3];
    }

    function blog_posts_createHTML (articles) {
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

    function blog_pagination_getConfig () {
        var root = $('#jv-source-content .pagination li');
        var idxMax = root.length - 1;

        var pagination = {
            start:   { num: 0, url:'' },
            last:    { num: 0, url:'' },
            current: { num: 0, url:'' },
            pre:     { num: 0, url:'' },
            next:    { num: 0, url:'' },
            isStart: false,
            isLast: false,
            step: 6 // 一頁顯示幾篇文章，需再後臺選單中設定
        };

        /// 已知的值
        pagination.start.num = 1;
        pagination.isStart = !($(root[0]).find('a')[0])? true : false;
        pagination.isLast = !($(root[idxMax]).find('a')[0])? true : false;

        if (pagination.isStart) 
            blog_pagination_setStartPageParams(pagination, root, idxMax);
        else if (pagination.isLast) 
            blog_pagination_setEndPageParams(pagination, root, idxMax);
        else 
            blog_pagination_setIntervalPageParams(pagination, root, idxMax);

        return pagination;     
    }

    function blog_pagination_setStartPageParams (pagination, root, idxMax) {
        // 設定連結網址
        pagination.start.url   = global.location.href;
        pagination.last.url    = $(root[idxMax]).find('a')[0].href;
        pagination.current.url = global.location.href;
        pagination.pre.url     = '';
        pagination.next.url    = $(root[idxMax-1]).find('a')[0].href;
        
        // 設定頁面編號
        total = parseInt(pagination.last.url.split('limitstart=')[1]); /// 總篇數
        pagination.last.num    = parseInt(total/pagination.step) + 1;
        pagination.current.num = pagination.start.num;
        pagination.pre.num     = 0;
        pagination.next.num    = pagination.start.num + 1;
    }

    function blog_pagination_setEndPageParams (pagination, root, idxMax) {
        // 設定連結網址
        pagination.start.url   = $(root[0]).find('a')[0].href;
        pagination.last.url    = global.location.href;
        pagination.current.url = global.location.href;
        pagination.pre.url     = $(root[1]).find('a')[0].href;
        pagination.next.url    = '';
        
        // 設定頁面編號
        pagination.last.num    = parseInt(root[idxMax-2].textContent);
        pagination.current.num = pagination.last.num;
        pagination.pre.num     = pagination.last.num - 1;
        pagination.next.num    = 0;
    }

    function blog_pagination_setIntervalPageParams (pagination, root, idxMax) {
        // 設定連結網址
        pagination.start.url   = $(root[0]).find('a')[0].href;
        pagination.last.url    = $(root[idxMax]).find('a')[0].href;
        pagination.current.url = global.location.href;
        pagination.pre.url     = $(root[1]).find('a')[0].href;
        pagination.next.url    = $(root[idxMax-1]).find('a')[0].href;
        
        // 設定頁面編號
        total = parseInt(pagination.last.url.split('limitstart=')[1]); /// 總篇數
        pagination.last.num    = parseInt(total/pagination.step) + 1;
        pagination.current.num = parseInt(root.find('span')[0].textContent);
        pagination.pre.num     = pagination.current.num - 1;
        pagination.next.num    = pagination.current.num + 1;

    }

    function blog_pagination_createHTML (pagination) {
        var startHTML = '<div class="text-center trailer-1 leader-1">',
            preHTML = blog_pagination_createPreHTML(pagination),
            numberHTML = blog_pagination_createNumberHTML(pagination),
            nextHTML = blog_pagination_createNextHTML(pagination),
            endHTML = '</div>';
        
        return startHTML + preHTML + pageNumHTML + nextHTML + endHTML;
    }

    function blog_pagination_createPreHTML (pagination) {
        if (pagination.isStart) 
            return '<a href="#" class="btn btn-transparent btn-disabled">上一頁</a>';
        else
            return '<a href="{{preUrl}}" class="btn btn-transparent btn-arrow">上一頁</a>'.replace('{{preUrl}}', pagination.pre.url);
    }

    function blog_pagination_createNextHTML (pagination) {
        if (pagination.isLast)
            return '<a href="#" class="btn btn-transparent btn-disabled">下一頁</a>';
        else
            return '<a href="{{nextUrl}}" class="btn btn-transparent btn-arrow">下一頁</a>'.replace('{{nextUrl}}', pagination.next.url); 
    }

    function blog_pagination_createNumberHTML (pagination) {
        var links = blog_pagination_getAllLinks(pagination);
        var ellipsis = '<span class="avenir-light text-light-gray">...</span>';

        // 有省略符號條件: 
        //  - 末頁要大於 7
        //  - 與current相減為5以上才產生略符號
        if (pagination.last.num < 7) 
            return blog_pagination_createAllNumberHTML(
                pagination.start.num, 
                pagination.last.num,
                pagination.current.num,
                links
            );

        if (pagination.last.num >= 7) {
            /// start ~ current
            var preHTML = blog_pagination_createNumberHTML_start2Current(pagination, links, ellipsis);

            /// current+1 ~ end
            var endHTML = blog_pagination_createNumberHTML_current2End(pagination, links, ellipsis);
            
            return preHTML + endHTML;
        }
    }

    function blog_pagination_getAllLinks (pagination) {
        var links = new Array();
        var start = pagination.start.num,
            max = pagination.last.num,
            blogUrl = pagination.start.url,
            step = pagination.step;

        for (var i=start; i<=max; i++) {
            if (i === start)
                links.push(blogUrl);
            else 
                links.push( blogUrl + '&limitstart=' + (i-1)*step );
        }
        return links;
    }

    function blog_pagination_createAllNumberHTML (start, max, current, links) {
        var html = '';  
        for (var i=start; i<=max; i++) {
            if (i === current) 
                html += '<a href="' + links[i-1] + '" class="btn">' + i + '</a>';
            else
                html += '<a href="' + links[i-1] + '" class="btn btn-transparent">' + i + '</a>';
        }
        return html;
    }

    function blog_pagination_createNumberHTML_start2Current (pagination, links, ellipsis) { 
        var html = '';
        var start = pagination.start.num,
            current = pagination.current.num,
            max = pagination.current.num;
        
        var isBig5 = (max-start)>5;
        
        if (isBig5) {
            html += '<a href="'+ links[start-1] +'" class="btn btn-transparent">' + start + '</a>';
            html += ellipsis;
            html += '<a href="'+ links[current-2] +'" class="btn btn-transparent">' + (current-1) + '</a>';
            html += '<a href="'+ links[current-1] +'" class="btn">' + current + '</a>';
            return html;
        }
        else 
            return blog_pagination_createAllNumberHTML(start, max, current, links);
    }

    function blog_pagination_createNumberHTML_current2End (pagination, links, ellipsis) {
        var html = '';
        var start = pagination.current.num + 1,
            current = pagination.current.num,
            max = pagination.last.num;

        var isBig5 = (max-current)>5;

        if (isBig5) {
            html += '<a href="'+ links[current] +'" class="btn btn-transparent">' + (current+1) + '</a>';
            html += ellipsis;
            html += '<a href="'+ links[max-1] +'" class="btn btn-transparent">' + max + '</a>';
            return html;
        }
        else
            return blog_pagination_createAllNumberHTML(start, max, current, links);
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
