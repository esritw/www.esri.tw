(function (global, $){
	// initialize global variables
	var ccw = global.ccw;
	
	// ============================
	//      ccw-subnav-tablet
	// ============================
	var subnav_tablet = function () {
		$('.js-ccw-dropdown .ccw-dropdown-title').on('click', function (evt) {
			var dropdown = $( $(this).parent().find('.ccw-dropdown-menu')[0] ),
				icon = $( $(this).parent().find('.ccw-dropdown-title .ccw-dropdown-icon')[0] );

			var isDropdownOpen = dropdown.hasClass('ccw-active');
			
			if (isDropdownOpen) {
				dropdown.slideUp();
				dropdown.removeClass('ccw-active');
				icon.removeClass('icon-ui-up-arrow');
				icon.addClass('icon-ui-down-arrow');
			}

			if (!isDropdownOpen) {
				dropdown.slideDown();
				dropdown.addClass('ccw-active');
				icon.removeClass('icon-ui-down-arrow');
				icon.addClass('icon-ui-up-arrow');
			}
		});
	};
	
	// ============================
	//      initialize components
	// ============================
	var initComponents = function () {
		subnav_tablet();
	};

    // ========================================================
    //      Export Modules & add Document Onload Event
    // ========================================================
    var components = ccw.namespace('global.ccw.components');
	  ccw.addOnLoadEvent(initComponents);

}(window, jQuery));
