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
        if ( qstr.includes('view=article') && !ccwContent ) return 'post';
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
        $('#ccw-source-content').empty();
        global.calcite.init();
    };

    // ============================
    //      Post
    // ============================
    var initPostPage = function () {
        var postConfig = post_getConfig( $('#jv-source-content') ),
            postHTML = post_createHTML(postConfig);

        /// 插入文章
        $('#ccw-content').append(postHTML);
           
        /// 插入標題Id, 以便完成目錄連結
        post_addHeaderId($('#ccw-post-content'), postConfig.toc.ids);

        /// 清除原始內文
        $('#jv-source-content').empty();
        
        if (!postConfig.toc.ids.length) {
            $('#ccw-post-content').addClass('center-column');
            $('#ccw-post-toc').hide();
        }
        
        /// 啟動 scroll 與 sticky 行為
        global.calcite.init();
    };

    function post_getConfig (jvroot) {
        var title = jvroot.find('.contentheading')[0][0].textContent,
            author = jvroot.find('.small')[0][0].textContent,
            createdate = jvroot.find('.createdate')[0][0].textContent;

        var contentTbRoot = jvroot.find('.contentpaneopen')[1],
            contentRoot = $(contentTbRoot).find('td')[2],
            content = contentRoot.innerHTML;

        return {
            'title'     : post_rmEscapeCharacter(title),
            'author'    : post_getAuthor(author),
            'createdate': post_getDate(createdate),
            'content'   : content,
            'toc'       : post_getToc(contentRoot)
        };
    }

    function post_rmEscapeCharacter(text) {
        return text.replaceAll(/(\r|\t|\n)/gm, "");
    }

    function post_rmEmptyLine(text) {
        return text.replaceAll('<p>&nbsp;</p>');
    }

    function post_getAuthor (text) {
        return text.replace(/(\r|\t|\n)/gm, "").replace("作者是 ","").split(" ")[0];
    }

    function post_getDate(text) {
        text = text.replace(/(\r|\t|\n)/gm, "").split(",")[1].split(" ");
        return text[1] + " " + text[2] + ", " + text[3];
    }

    function post_getToc (contentRoot) {
        var headerIds = new Array();
        
        var startHTML  = '<div id="ccw-post-toc" class="column-6 tablet-hide"><h4 class="side-nav-title">目錄</h4><nav>';
        var contentHTML = '';
        var endHTML = '</nav><div class="js-sticky scroll-show padding-left-6" data-top="50"><a href="#" class="right btn btn-gray btn-clear">返回頂端</a></div></div>';

        $(contentRoot).find('h1, h2, h3, h4, h5, h6').each(function (idx, header) {
            var tagName = header.nodeName,
                text = header.textContent,
                id = !(header.id)? ('ccw-header-'+idx+Date.now()): header.id;
            
            /// 取得標題id
            headerIds.push(id);
            
            /// 產生html
            if (tagName === 'H1') contentHTML += '<a href="#'+ id +'" class="side-nav-link">' + text + '</a>';
            if (tagName === 'H2') contentHTML += '<a href="#'+ id +'" class="side-nav-link padding-left-2">' + text + '</a>';
            if (tagName === 'H3') contentHTML += '<a href="#'+ id +'" class="side-nav-link padding-left-3">' + text + '</a>';
            if (tagName === 'H4') contentHTML += '<a href="#'+ id +'" class="side-nav-link padding-left-4">' + text + '</a>';
            if (tagName === 'H5') contentHTML += '<a href="#'+ id +'" class="side-nav-link padding-left-5">' + text + '</a>';
            if (tagName === 'H6') contentHTML += '<a href="#'+ id +'" class="side-nav-link padding-left-6">' + text + '</a>';
        });

        return { 
            'ids' : headerIds,
            'html': startHTML + contentHTML + endHTML 
        };
    }

    function post_createHTML (postConfig) {
        var htmlStr = [
                /// content column 
                '<div class="grid-container leader-1"><div id="ccw-post-content" class="column-14 tablet-column-12 pre-2">',
                '<h1><strong>'+ postConfig.title +'</strong></h1>',
                '<p>'+ postConfig.createdate +'<span class="padding-left-2">'+ postConfig.author +'<span></p>',
                postConfig.content,
                '</div>',
                /// toc nav column
                postConfig.toc.html,
                '</div></div>'
        ];
        return htmlStr.join('');
    }

    function post_addHeaderId (contentRoot, ids) {
        contentRoot.find('h1, h2, h3, h4, h5, h6').each(function (idx, header) {
            if (idx > 0) header.id = ids[idx-1];
        });
    } 

    // ============================
    //      Blog
    // ============================
    var initBlogPage = function () {
        var postsConfig = blog_posts_getConfig($('#jv-source-content')),
            postsHTML = blog_posts_createHTML(postsConfig);
        
        var pagination = blog_pagination_getConfig(),
            paginationHTML = blog_pagination_createHTML(pagination);

        $('#ccw-content').append(postsHTML);
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
                        articles[idx]['thumbUrl'] = !($(tdNode).find('.thumb').length)? ( !($(tdNode).find('img').length)?'':$(tdNode).find('img')[0].src ): $(tdNode).find('.thumb')[0][0].src; 
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
            isOnlyOnePage: false,
            step: 6 // 一頁顯示幾篇文章，需再後臺選單中設定
        };

        /// 已知的值
        pagination.start.num = 1;
        pagination.isOnlyOnePage = (idxMax < 0)? true: false;
        pagination.isStart = !($(root[0]).find('a')[0])? true : false;
        pagination.isLast = !($(root[idxMax]).find('a')[0])? true : false;

        if ( pagination.isOnlyOnePage ) {
	    blog_pagination_setOnlyOnePageParams (pagination);
	    return pagination;
	}
        
	if (pagination.isStart) 
            blog_pagination_setStartPageParams(pagination, root, idxMax);
        else if (pagination.isLast) 
            blog_pagination_setEndPageParams(pagination, root, idxMax);
        else 
            blog_pagination_setIntervalPageParams(pagination, root, idxMax);

        return pagination;     
    }
    
    function blog_pagination_setOnlyOnePageParams (pagination) {
        // 設定連結網址
        pagination.start.url   = global.location.href;
        pagination.last.url    = global.location.href;
        pagination.current.url = global.location.href;
        pagination.pre.url     = global.location.href;
        pagination.next.url    = global.location.href;

        // 設定頁面編號
        pagination.start.num   = 1;
        pagination.last.num    = 1;
        pagination.current.num = 1;
        pagination.pre.num     = 1;
        pagination.next.num    = 1;

        // 設定是否為首頁與末頁
        pagination.isStart = true;
        pagination.isLast  = true;
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
        
        return startHTML + preHTML + numberHTML + nextHTML + endHTML;
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
        
        var isBig5 = (max-start) >= 5;
        
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

        var isBig5 = (max-current) >= 5;

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
        if ( getPageType() === 'post')     initPostPage();
        if ( getPageType() === 'blog')        initBlogPage();
        if ( getPageType() === 'search')      initSearchPage();
    };

    // ========================================================
    //      Export Modules & add Document Onload Event
    // ========================================================
    var layout = ccw.namespace('global.ccw.layout');
        
    ccw.addOnLoadEvent(initLayout);

}(window, jQuery));
