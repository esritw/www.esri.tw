(function (global, $){
    // 命名空間
    var namespace = function (ns_string) {
        var parts = ns_string.split('.'), 
            parent = global, 
            i;
        if (parts[0] === "global") {
            parts = parts.slice(1);       
        }

        for (i = 0; i < parts.length; i++){
            // 若沒有這物件沒有這個屬性 則視為空物件
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    };

    /********************
     * Export Modules
     *******************/
    var nxg = namespace('global.nxg');
    	nxg.namespace = namespace;

}(window, jQuery));
