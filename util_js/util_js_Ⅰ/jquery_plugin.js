/* jquery插件开发 */
/* 1. 添加jquery对象级插件 给jquery对象添加方法 eg: $("#el").fn();*/
;(function($) {
    $.fn.extend({
        "函数名": function (自定义参数) {
            // 插件代码
        }
    });
})(jQuery);

// 另一种写法
;(function($) {
    $.fn.函数名 = function (自定义参数) {
        // 插件代码
    }
})(jQuery);


// 示例
//封装插件
	//方法一：需要绑定到一个元素上
	//$.fn.extend->$("#img").preLoad;
	//方法二：单独的工具方法
	//$.extend->$.preLoad();
;(function($) {
    // $.fn.toolTip = function (options) {
    //     var defaults = {
    //         'location': 'top',
    //         'background-color': 'red'
    //     };

    //     var option = $.extend({}, defaults, options);

    //     return '返回的值';
    // };

    var PreLoad = {};

    $.fn.extend({
        preload: function (参数) {
            new preLoad(参数);
        }
    });

    // 或者
    $.fn.preload = function (参数) {
        new preLoad(参数);
    };
})(jQuery);



/* 2. jQuery类级别的插件 相当于添加静态方法 eg: $.ajax({}) */
;(function($) {
    $.extend({
        "函数名": function (自定义参数) {
            // 插件代码
        }
    });
})(jQuery);

// 另一种写法
;(function($) {
    $.函数名 = function (自定义参数) {
        // 插件代码
    }
})(jQuery);