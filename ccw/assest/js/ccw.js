(function (global){
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

    var addOnLoadEvent = function (func) {
        var oldonload = global.onload;
        
        if ( typeof global.onload != "function" ) {
            global.onload = func;
        }
        else {
            global.onload = function() {
                if (oldonload) oldonload();
                func();
            };
        }
    };

    // ============================
    //      Export Modules
    // ============================
    var ccw = namespace('global.ccw');
    	ccw.namespace = namespace;
        ccw.addOnLoadEvent = addOnLoadEvent;
    
}(window));
