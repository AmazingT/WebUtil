;(function($, window, document, undefined) {
    'use strict';

    // 构造函数
    var Preload = function(el, options) {
        var $this = this;

        this.$image = $(el).addClass('preload');
        this.options = $.extend({}, Preload.default, options);
        this.$image.on('click', function() { $this.bindImgClick() });
        this.setImage();

        // this.init(options);
    };

    // 未传递参数时的默认值
    Preload.default = {
        width: '50',
        height: '50'
    };

    // 公共方法放在原型对象上(放在构造函数中会在每次实例化对象时都会保留一份)
    Preload.prototype.bindImgClick = function() {
        alert('您点击了图片');
    }

    Preload.prototype.setImage = function () {
        this.$image.css({
            width: this.options.width,
            height: this.options.height
        });
    };

    // 重写prototype对象
    // Preload.prototype = {
    //     default: {
    //         width: '80',
    //         height: '80'
    //     },
    //     init: function (options) {
    //         this.options = $.extend({}, this.default, options);
    //         console.log(this, options);
    //     },
    //     bindImgClick: function() {
    //         console.log("您点击了图片");
    //     }
    // };

    $.fn.preload = function(option) {
        this.each(function() {
            var $this = $(this),
                data = $this.data('preload'),
                options = typeof option === 'object' && option;
            if (!data) $this.data('preload', (data = new Preload(this, options)));
            if (typeof option == 'string') data[option]();
        });
    }
})(jQuery, window, document);