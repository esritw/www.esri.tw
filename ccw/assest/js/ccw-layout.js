(function (global, $) {
    // initialize global variables
    var ccw = global.ccw;

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
        // do something ...
    };

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
