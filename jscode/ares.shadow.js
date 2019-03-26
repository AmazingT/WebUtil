/**
 * ares.shadow.js  Ares 影像获取组件
 *
 * 元素结构
 *
 */

/*
 元素结构:
     <div class="{{shadowContentElement}}">
        <div class="{{shadowClickElement}}">
            <img src="/yt-market-base/1.0.0/opencard/images/yw_pic_photo.png">
        </div>
     </div>

 控制样式:
     {{
         shadowClickElement -> 点击元素样式
         shadowRemoveElement -> 删除元素样式
         shadowItemElement -> 单个影像元素
         shadowContentElement -> 分组影像内容
     }}

 shadowClickElement 元素 属性设置

     data-return-type : 返回数据格式 base64 | path
     data-max : 最大个数, 可用于控制 {{shadowClickElement}} 点击元素的显示隐藏, 默认无限制
     data-min : 最小元素, 默认 0
     data-type : 影像类型, 目前只支持 picture, 后期 video | voice
     data-tip : 显示的提示信息
     data-code : 影像编码信息, 原生根据这个参数生成文件名称
     data-param : 传递的参数信息

 模版数据信息: 为通过 替换方式 实现数据渲染

        {{original}}  -- 原始数据, 通过插件参数替换(replace 实现)
        {{thumbnail}} -- 缩略数据, 通过插件参数替换(replace 实现)

*/

var jQuery, $;
jQuery = $ = require('jquery');
var Config = require('ares.config.js');
var Notification = require('ares.notification.js');


function Shadow(root, opts) {
    var defaultOptions = {
        shadowClickElement: '.shadow-click',
        shadowRemoveElement: '.glyphicon-remove-circle',
        shadowItemElement: '.shadow-item',
        shadowContentElement: '.photo',
        template: {
            picture: '<div class="shadow-item" data-thumbnail="{{thumbnail}}" data-original="{{original}}">' +
            '<img data-id="{{original}}" src="{{thumbnail}}"><i class="glyphicon glyphicon-remove-circle"></i></div>'
        },
        testData: {
            picture: {
                status: 1,
                message: '操作成功',
                data: {
                    thumbnail: Ares.testIDData.idPhoto,
                    original: 100
                }
            }
        },
        plugin: {
            /**
             * picture 原生插件
             *
             * options.testData.picture 设定 picture debug 模式下的测试数据
             *
             *
             * @param $this 点击的元素
             * @param dataValues 点击元素 data-* 配置信息
             * @param options 初始化参数
             * @returns {*}
             */
            picture: function ($this, dataValues, options) {
                if (!Config.debug) {
                    return Ares.Plugins.Camera.take;
                } else {
                    return function (callback, opts, type) {
                        setTimeout(function () {
                            callback(options.testData.picture);
                        }, 100);
                    }
                }
            }
        },
        callback: {
            /**
             * picture 类型回调函数
             *
             *  可以自定定义回调处理
             *
             * @param rets 客户断返回的结果数据 {status:1, message: '操作成功', data: {thumbnail: 'a', original: 'b' }}
             * @param $this 当前点击的元素
             * @param options 创建时候的配置信息
             * @param dataValues 点击元素 设置的 data-* 属性
             */
            picture: function (rets, $this, options, dataValues) {
                var thumbnail = rets.data['thumbnail'] || '';
                var original = rets.data['original'] || '';
                var src;
                if (dataValues['data-return-type'] == 'base64') {
                    src = 'data:image/jpg;base64,' + thumbnail;
                }

                var template = options.template['picture'];
                template = template.replace(new RegExp('{{thumbnail}}','gm'), thumbnail);
                template = template.replace(new RegExp('{{original}}','gm'), original);

                var $html = $(template);
                $html.find('*[src]').attr('src', src);
                $this.parent().prepend($html);
                var max = dataValues['data-max'];

                if ($this.siblings(options.shadowItemElement).length >= max) {
                    $this.hide();
                }
            }
        }
    };

    this.options = $.extend(true, {}, defaultOptions, opts);
    this.root = root;
    this.attrs = [
        'data-return-type',
        'data-max',
        'data-min',
        'data-type',
        'data-tip',
        'data-code',
        'data-param'
    ];
}

Shadow.preStop = function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
};

Shadow.getAttrValues = function ($el, attrs) {
    var values = {};
    for (var i = 0, l = attrs.length; i < l; i++) {
        var name = attrs[i];
        if (name == 'data-type') {
            values[name] = $el.attr(name) || 'picture';
        } else if (name == 'data-max') {
            values[name] = $el.attr(name) || Number.MAX_VALUE;
        } else if (name == 'data-min') {
            values[name] = $el.attr(name) || 0;
        } else if(name == 'data-return-type') {
            values[name] = $el.attr(name) || 'base64';
        } else {
            values[name] = $el.attr(name) || undefined;
        }

    }
    return values;
};

Shadow.prototype = {
    init: function (initData) {
        var $root = $(this.root);
        var options = this.options;
        var attrs = this.attrs;
        //为了防止后面生成的html中包含了 options.shadowClickElement 导致点击事件重新绑定上,不采用on方式绑定

        $root.find(options.shadowClickElement).click(function(e) {
            Shadow.preStop(e);
            var $this = $(this);
            var values = Shadow.getAttrValues($this, attrs);
            var plugin = options.plugin[values['data-type']]($this, values, options);
            var callback = options.callback[values['data-type']];
            var returnType = values['data-return-type'];
            var dataCode = values['data-code'] || '';

            plugin(function (rets) {
                if (rets.status == 1) {
                    callback(rets, $this, options, values);
                } else {
                    Notification.alert.show(rets.message || '操作失败');
                }
            }, {}, {
                type: returnType,
                name: dataCode
            });
        });

        //点击图片放大预览
        $root.on("click",".shadow-item img",function (e) {

            var html =
                "<div class='ares_msg_box'>"+
                     "<img class='alert-photo animated zoomIn' src='"+$(this).attr("src")+"'/>"+
                "</div>";
            var photo = $(html);
            $(document.body).append(photo);
        });
        $(document.body).on("click",".alert-photo",function () {
            $(this).removeClass("zoomIn").addClass("zoomOut");
            setTimeout(function () {
                $('.ares_msg_box').remove();
            }, 200);
        });
        $root.on('click', options.shadowRemoveElement, function (e) {
            Shadow.preStop(e);

            var $parent = $(this).parent();
            var $shadow = $parent.siblings();
            $parent.remove();
            $shadow.show();
        });

        if (initData && initData.cache) {
            var cacheData = initData.cache;
            this.renderFromCache(cacheData);
        }
    },
    getShadow: function (noCheck) { //获取影像，条件不满足的时候直接返回false，否则返回json数组保存影像数据
        var options = this.options;
        var $shadowContent = $(this.root).find(options.shadowContentElement);

        var attrs = this.attrs;

        var shadows = [];
        for (var i = 0; i < $shadowContent.length; i++) {
            var item_shadows = [];
            var oneShadowContent = $shadowContent[i];

            var $shadowClickElement = $(oneShadowContent).find(options.shadowClickElement);

            var dataValues = Shadow.getAttrValues($shadowClickElement, attrs);

            var o = $shadowContent[i];
            var tip = dataValues['data-tip'] || '影像信息';
            var dataMin = dataValues['data-min']; //如果必须上传，则用于检测是否满足数量
            var dataCode = dataValues['data-code'];

            var dataParam = dataValues['data-param'];
            var dataType = dataValues['data-type'];
            var returnType = dataValues['data-return-type'];

            var $shadowItem = $(o).find(options.shadowItemElement);

            if (!noCheck && ($shadowItem.length < dataMin)) {
                Ares.Notification.alert.show('请上传' + tip, '');
                return false;
            }

            $.each($shadowItem, function (i, o) {
                var original = $(o).attr('data-original');
                var thumbnail = $(o).attr('data-thumbnail');
                if (original) {
                    item_shadows.push({
                        index: i,
                        code: dataCode || '',
                        type: dataType || '',
                        returnType: returnType,
                        param: dataParam || '',
                        original: original
                        /*
                         * ,thumbnail: thumbnail
                         */
                    });
                }
            });

            shadows.push(item_shadows);
        }

        return shadows;

    },
    renderFromCache: function(data) {
        var _this = this;
        var _options = _this.options;
        var shadowClickElement = _options.shadowClickElement;

        $.each(data, function(i, arr) {
            var $shadowClickElement = $(shadowClickElement).eq(i);
            var dataValues = Shadow.getAttrValues($shadowClickElement, _this.attrs);
            $.each(arr, function(index, o) {
                var callback = _options.callback[o['type']];
                callback({
                    status:1,
                    message: '操作成功',
                    data: {thumbnail: o['thumbnail'], original: o['original'] }
                }, $shadowClickElement, _options, dataValues);
            });
        });
    }
};


module.exports = Shadow;