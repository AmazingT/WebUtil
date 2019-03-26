;(function($) {
	function PreLoad(imgs, options) {
		this.imgs = (typeof imgs === 'string') ? [imgs] : imgs; //传进来的可能是单张图片或数组
		this.opts = $.extend({}, PreLoad.DEFAULTS, options);
		this._unordered();
    }

	PreLoad.DEFAULTS = { //设置默认参数
		each: null, //每一张图片加载完毕后执行
		all: null //所有图片加载完毕后执行
    };

	//写在原型上这样每次实例化时，都保持只有一份，减少生成量
	PreLoad.prototype._unordered = function() {
		//无序加载
		var imgs = this.imgs,
			opts = this.opts,
			count = 0,
			len = imgs.length;

		$.each(imgs, function(i, src) {
			if (typeof src != 'string') {
				return;
			}
			var imgObj = new Image();
		
			$(imgObj).on('load error', function() {
			
				opts.each && opts.each(count, len); // 判断opts存不存在，若不存在执行后续的会报错

				if (count >= len - 1) {
					opts.all && opts.all();
				}
				count++;
			});
			imgObj.src = src;
		});
	};
	//封装插件
	//方法一：需要绑定到一个元素上
	//$.fn.extend->$("#img").preLoad;
	//方法二：单独的工具方法
	//$.extend->$.preLoad();
	$.extend({
		preload: function(imgs, opts) {
			new PreLoad(imgs, opts); //实例化
		}
	});
})(jQuery);