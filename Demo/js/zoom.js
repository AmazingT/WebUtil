;(function($){
	// initialization
	Zoomify = function (element, options) {
		var that = this;
		
		this._zooming = false;
		this._zoomed  = false;
		this._timeout = null;
		this.$shadow  = null;
		this.$image   = $(element).addClass('zoomify');
        this.options  = $.extend({}, Zoomify.DEFAULTS, this.$image.data(), options);
		this.$image.on('click', function () { that.zoom(); });
		$(window).on('resize', function () { that.reposition(); });
		$(document).on('scroll', function () { that.reposition(); });
    };
    
	Zoomify.DEFAULTS = {
		duration: 200,
		easing: 'linear',
		scale: 1
	};
	
	// css utilities
	Zoomify.prototype.transition = function ($element, value) {
		$element.css({
			'-webkit-transition': value,
			'-moz-transition': value,
			'-ms-transition': value,
			'-o-transition': value,
			'transition': value
		});
	};
	
	Zoomify.prototype.addTransition = function ($element) {
		this.transition($element, 'all ' + this.options.duration + 'ms ' + this.options.easing);
	};

	Zoomify.prototype.removeTransition = function ($element, callback) {
		var that = this;
		clearTimeout(this._timeout);
		this._timeout = setTimeout(function () {
			that.transition($element, '');
			if ($.isFunction(callback)) callback.call(that);// 放大过程完毕
		}, this.options.duration);
	};

	Zoomify.prototype.transform = function (value) {
		this.$image.css({
			'-webkit-transform': value,
			'-moz-transform': value,
			'-ms-transform': value,
			'-o-transform': value,
			'transform': value
		});
	};
	
	// zooming functions
	Zoomify.prototype.zoom = function () {
		if (this._zooming) return;// 正在执行动画
		if (this._zoomed) this.zoomOut();
		else this.zoomIn();
	};
	// 放大图片
	Zoomify.prototype.zoomIn = function () {
		var that      = this,
			transform = this.$image.css('transform');
		// 重置transform样式
		this.transition(this.$image, 'none');
		this.transform('none');
		// 禁止图片滑动事件冒泡至body时产生页面穿透滚动
		this.$image.on('touchmove', function(e) { e.preventDefault(); })

		var offset     = this.$image.offset(),
			width      = this.$image.outerWidth(),//img标签规定尺寸
			height     = this.$image.outerHeight(),
			nWidth     = this.$image[0].naturalWidth || +Infinity,//获取图片原始尺寸
			nHeight    = this.$image[0].naturalHeight || +Infinity,
			wWidth     = $(window).width(),
			wHeight    = $(window).height(),
			// 若图片原始宽比屏幕宽大 则获取屏幕宽 否则获取原始宽(缩放比为1时)
			scaleX     = Math.min(nWidth, wWidth * this.options.scale) / width,
			scaleY     = Math.min(nHeight, wHeight * this.options.scale) / height,
			scale      = Math.min(scaleX, scaleY),
			// -offset.left + (wWidth - width) / 2 相当于图片在正中间时左右移动的距离
			// translateX/Y: 图片在其原始位置以中心点放大后需要移动至屏幕中心的距离
			translateX = (-offset.left + (wWidth - width) / 2) / scale,
			translateY = (-offset.top + (wHeight - height) / 2 + $(document).scrollTop()) / scale;
		
		this.transform(transform);
		
		this._zooming = true;
		this.$image.addClass('zoomed').trigger('zoom-in.zoomify');
		setTimeout(function () {
			that.addShadow();// 添加遮罩层
			// 放大过程完毕
			that.transformScaleAndTranslate(scale, translateX, translateY, function () {
				that._zooming = false;
				that.$image.trigger('zoom-in-complete.zoomify');
			});
			that._zoomed = true;// 放大状态
		});
	};

	Zoomify.prototype.zoomOut = function () {
		var that = this;
		this._zooming = true;
		// 解除图片滑动(图片缩小后滑动图片不能导致body滚动)
		this.$image.unbind("touchmove");
		this.$image.trigger('zoom-out.zoomify');
		this.transformScaleAndTranslate(1, 0, 0, function () {
			that._zooming = false;
			that.$image.removeClass('zoomed').trigger('zoom-out-complete.zoomify');
		});
		this.removeShadow();
		this._zoomed = false;
	};

	// 使用CSS3放大移动图片
	Zoomify.prototype.transformScaleAndTranslate = function (scale, translateX, translateY, callback) {
		this.addTransition(this.$image);
		// translate3d(x,y,z) 移动端开启GPU硬件加速
		this.transform('scale(' + scale + ') translate3d(' + translateX + 'px, ' + translateY + 'px, 0)');
		this.removeTransition(this.$image, callback);// 移除动画设置
	};
	
	// page listener callbacks
	Zoomify.prototype.reposition = function () {
		if (this._zoomed) {
			this.transition(this.$image, 'none');
			this.zoomIn();
		}
	};
	
	// 动态添加遮罩层
	Zoomify.prototype.addShadow = function () {
		var that = this;
		if (this._zoomed) return;
		
		if (that.$shadow) that.$shadow.remove();
		this.$shadow = $('<div class="zoomify-shadow"></div>');
		$('body').append(this.$shadow);
		this.addTransition(this.$shadow);
		this.$shadow.on('click', function () { that.zoomOut(); })
		// 禁止图片滑动事件冒泡至body时产生页面穿透滚动
		this.$shadow.on('touchmove', function (e) { e.preventDefault(); })
		
		setTimeout(function () { that.$shadow.addClass('zoomed'); }, 10);
	};
	// 移除遮罩层
	Zoomify.prototype.removeShadow = function () {
		var that = this;
		if (!this.$shadow) return;
		
		this.addTransition(this.$shadow);
		this.$shadow.removeClass('zoomed');
		this.$image.one('zoom-out-complete.zoomify', function () {
			if (that.$shadow) that.$shadow.remove();
			that.$shadow = null;
		});
	};
	
	// plugin definition
	$.fn.zoomify = function (option) {
        // this: <img/>
		return this.each(function () {
			var $this   = $(this),
				zoomify = $this.data('zoomify');
            if (!zoomify) $this.data('zoomify', (zoomify = new Zoomify(this, typeof option == 'object' && option)));
			if (typeof option == 'string' && ['zoom', 'zoomIn', 'zoomOut', 'reposition'].indexOf(option) >= 0) zoomify[option]();
		});
	};
	
})(jQuery);