/**
 *  @param
 *  @return
 * 	@author
 */

var Notification = (function() {
	var loading, alert, confirm, modal, tips, choose;

	/**
	 * 加载提示框
	 * @return {[type]} [description]
	 */
	loading = function() {
		var show, hide, loadingCount = 0;

		show: function() {
			// 如果有loading框显示
			if (loadingCount === 1) {
				return;
			}

			loadingCount++;

			var html = 
				'<div class="loading_box">' +

				'</div>';

			var loading = $(html);

			$(document.body).append(loading);
		};

		hide: function() {
			if (loadingCount === 1) {
				$(".loading_box").remove();
			}
			loadingCount = 0;
		};

		return {
			show: show,
			hide: hide,
		};
	}();

	alert = function() {

	}();

	confirm = function() {

	}();

	modal = function() {

	}();

	tips = function() {

	}();

	choose = function() {

	}();

	return {
		loading: loading,
		alert: alert,
		confirm: confirm,
		modal: modal,
		tips: tips,
		choose: choose
	};
})();

module.exports = Notification;