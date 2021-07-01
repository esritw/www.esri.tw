(function (global, $) {
	var nxg = global.nxg;
	var namespace = nxg.namespace;

	function initDesktopMainMenu () {
		$('#nxg-main-navigator .item').on('click', function () {
			// 偵測元素狀態
			if ( $(this).hasClass('activate') ) {
				// 移除所有狀態
				$('#nxg-main-navigator .item').removeClass('activate');
				$('.nxg-menu-panel').removeClass('activate');
				
				// 增加選單列表元素狀態
				var dataTab = $(this).attr('data-tab');
				$('.nxg-menu-panel[data-tab="' + dataTab + '"]').slideUp();
			
			} else {
				// 移除所有狀態
				$('#nxg-main-navigator .item').removeClass('activate');
				$('.nxg-menu-panel').removeClass('activate');
				$('.nxg-menu-panel').hide();
				
				// 增加點選元素的狀態
				$(this).addClass('activate');
				
				// 增加選單列表元素狀態
				var dataTab = $(this).attr('data-tab');
				$('.nxg-menu-panel[data-tab="' + dataTab + '"]').addClass('activate');
				$('.nxg-menu-panel[data-tab="' + dataTab + '"]').slideDown();
			}
		});
	}

	/********************
	 * Export Modules
	 *******************/
	var menu = namespace('global.nxg.menu');
		
		menu.initialize = function () {
			/// 大螢幕選單 ///
			initDesktopMainMenu();
			// initDesktopStoryMapMenu();
			// initDesktopTwUCMenuR();

			/// 小螢幕選單 ///
			// initDeviceMainMenu();
			// initDeviceStoryMapMenu();
			// initDeviceTwUCMenuR();
		};
}(window, jQuery));
