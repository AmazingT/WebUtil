var Config = require('ares.config.js');
var JSBridge = require('ares.jsbridge.js');
var $ = require('jquery');
var Notification = require('ares.notification.js');
var Format = require('ares.format.js');


var WebStorage = (function () {
    function Storage(ctx) {
        this.ctx = ctx;
    }

    Storage.prototype = {
        save: function (key, data) {
            if (key && data) {
                this.ctx.setItem(key, JSON.stringify(data));
            }
        },
        get: function (key) {
            if (key) {
                var s = this.ctx.getItem(key);
                return JSON.parse(s);
            }
            return null;
        },
        remove: function (key) {
            this.ctx.removeItem(key);
        }
    };

    var _local = new Storage(localStorage);
    var _session = new Storage(sessionStorage);

    return {
        _s_load_key_: '_s_load_key_',
        _s_load_save_key_prefix_: '_$LoadDataToStorage$_',

        _s_back_key_: '_s_back_key_',
        _s_back_save_key_prefix_: '_$BackDataToStorage$_',

        local: _local,
        session: _session
    }
})();

var Utils = (function () {

    return {
        preStop: function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        },
        /**
         * 获取当前页面的  referrer
         *
         * @returns {string} referrer
         */
        getReferrer: function () {
            var referrer = '';

            try {
                referrer = window.top.document.referrer;
            } catch (e) {
                if (window.parent) {
                    try {
                        referrer = window.parent.document.referrer;
                    } catch (e2) {
                        referrer = '';
                    }
                }
            }
            if (referrer === '') {
                referrer = document.referrer;
            }
            return referrer;
        },
        /**
         * 将json格式数据转换成查询字符串
         * 如 {a : 'a', b : 'b'} => a=a&b=b
         *
         * @param json 待处理的json对象
         * @returns {string} 查询字符串
         */
        jsonToQueryString: function (json) {
            var str = "";
            for (var i in json) {
                var t = i + "=" + json[i];

                if (str == "") {
                    str += t;
                } else {
                    str += ("&" + t);
                }
            }
            return str;
        },
        /**
         * 从元素获取 [prefix] 前缀的属性
         *
         * 如: <a data-id="1" data-name="n1">
         *   =>
         *     {id:'1', name: 'n1'}
         *
         * @param $e 需要查找的元素
         * @param prefix 前缀
         * @returns {*} 属性对象
         */
        extractPrefixAttrs: function ($e, prefix) {
            if (!prefix) {
                throw new Error("require prefix param.");
            }
            var el = $e[0];
            var elAttrs = el.attributes;

            if (elAttrs && elAttrs.length > 0) {
                var re = new RegExp("^" + prefix + "-*", "i");

                var obj = null;

                $.each(elAttrs, function (i, attr) {
                    if (re.test(attr.name)) {
                        var n = attr.name.replace(re, '');
                        obj = obj || {};
                        obj[n] = attr.value;
                    }
                });

                return obj;
            }

            return null;
        },
        /**
         * 解析查询字符串
         *
         * 如: xxx.do?a=1&b=2 => {a:1,b:2}
         *
         * @returns {{}}
         */
        getQueryStringAsJson: function () {
            var json = {};
            var match,
                pl = /\+/g,
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) {
                    return decodeURIComponent(s.replace(pl, " "));
                },
                query = window.location.search.substring(1);

            while (match = search.exec(query)) {
                var key = decode(match[1]);
                var value = decode(match[2]);
                json[key] = decode(value);
            }

            return json;
        }
    }
})();

/**
 * WebContext 环境下页面处理
 */
var WebContext = (function () {
    var _push = function (url, datas) {
        if (datas) {
            var queryString = Utils.jsonToQueryString(datas);
            if (queryString) {
                if (url.indexOf('?') > -1) {
                    window.location.assign(url + "&" + queryString);
                } else {
                    window.location.assign(url + "?" + queryString);
                }
            } else {
                window.location.assign(url);
            }
        } else {
            window.location.assign(url);
        }
    };

    var _pop = function (datas) {
        var url = Utils.getReferrer();
        if (url) {
            if (datas) {
                var queryString = Utils.jsonToQueryString(datas);
                if (queryString) {
                    if (url.indexOf('?') > -1) {
                        window.location.assign(url + "&" + queryString);
                    } else {
                        window.location.assign(url + "?" + queryString);
                    }
                } else {
                    window.location.assign(url);
                }
            }
        } else {
            window.history.back();
        }
    };

    /**
     * WebContext web环境下暂时无需实现初始化
     */
    var _init = function (opts, resumeHandler, callback) {
        console.log("WebContext init...")
    };

    var _onResumeListener = function (callback) {
        $(function () {
            var p = Utils.getQueryStringAsJson() || {};
            var data = WebStorage.local.get(p[WebStorage._s_back_key_]);
            callback && callback(data);
        });
    };

    return {
        onResumeListener: _onResumeListener,
        init: _init,
        push: _push,
        pop: _pop
    }
})
();

/**
 * 原生环境下页面处理
 */
var NativeContext = (function () {
    var nativeMethod = {
        init: 'init',
        pushWindow: 'pushWindow',
        popWindow: 'popWindow',
        resume: "resume"
    };
    var nativeParams = {
        showTitlebar: 'YES',
        showToolbar: 'NO'
    };

    var _push = function (href, datas, params) {
        params = params || nativeParams;
        var queryString = Utils.jsonToQueryString(datas);
        if (queryString) {
            if (href.indexOf('?') > -1) {
                href = href + "&" + queryString;
            } else {
                href = href + "?" + queryString;
            }
        }

        JSBridge.callHandler(nativeMethod.pushWindow, {
            url: href,
            param: params,
            needRelativeUrl: "NO"
        }, function () {
        });
    };

    var _pop = function (datas) {
        JSBridge.callHandler(nativeMethod.popWindow, {params: datas}, function () {
        });
    };

    var _init = function (opts, resumeHandler, callback) {
        callback = callback || function (rets) {
            // alert(JSON.stringify(rets))
        };

        var defaultOpts = {
            title: "",
            initToolBar: false
        };
        opts = opts || {};
        var o = $.extend(defaultOpts, opts, {});

        JSBridge.callHandler(nativeMethod.init, o, callback);

        if (resumeHandler) {
            JSBridge.registerHandler(nativeMethod.resume, function (data) {
                resumeHandler(data);
            });
        }
    };

    var _onResumeListener = function () {
        JSBridge.registerHandler(nativeMethod.resume, callback);
    };

    return {
        onResumeListener: _onResumeListener,
        init: _init,
        push: _push,
        pop: _pop
    }
})();


var Page = (function () {
    var _debug = Config.debug;

    var _load = function (href, datas) {
        var key;
        if (_debug) {
            if (datas) {
                key = WebStorage._s_load_save_key_prefix_ + Date.now();

                WebStorage.local.save(key, datas);
                datas = {};
                datas[WebStorage._s_load_key_] = key;
            }


            WebContext.push(href, datas);
        } else {

            if (datas) {
                key = WebStorage._s_load_save_key_prefix_ + Date.now();

                WebStorage.local.save(key, datas);
                datas = {};
                datas[WebStorage._s_load_key_] = key;
            }

            NativeContext.push(href, datas);
        }
    };

    var _back = function (datas) {
        if (_debug) {
            var key = WebStorage._s_back_save_key_prefix_ + Date.now();

            WebStorage.local.save(key, datas);
            datas = {};
            datas[WebStorage._s_back_key_] = key;

            WebContext.pop(datas);
        } else {
            NativeContext.pop(datas);
        }
    };

    /**
     * 绑定页面事件
     *  对 data-href 进行点击绑定
     */
    var _bindEvent = function () {

        var $body = $(document.body);
        $("#headBack").on("click", function () {
            Page.goBack();
        });
        $(".goHome").on("click", function () {
            JSBridge.callHandler("AresGoBack");
        });
        $("input[data-verityData='money']").keyup(function () {
            var $this = $(this);
            var reg = $this.val().match(/\d+\.?\d{0,2}/);
            var txt = '';
            if (reg != null) {
                txt = reg[0];
            }
            $this.val(txt);
        }).change(function () {
            var $this = $(this);
            var txt = $this.val();
            if (parseFloat($this.attr("data-max")) < parseFloat(txt)) {
                Notification.alert.show("不能超过" + $this.attr("placeholder"), "系统提示", function () {
                    $this.val($this.attr("data-max"))
                });
            } else if (parseFloat(txt) <= 0) {
                Notification.alert.show("金额必须大于0", "系统提示", function () {
                    $this.val($this.attr("data-max"))
                });
            } else $this.val(Format.fmtMoney(txt, 2, ".", ""));
        });
        $("input[type='number']").keyup(function () {
            var $this = $(this);
            var reg = $this.val().match(/\d*/);
            var txt = '';
            if (reg != null) {
                txt = reg[0];
            }
            $this.val(txt);
            if ($this.attr("data-max") && parseFloat($this.attr("data-max")) < parseFloat($this.val())) {
                Notification.alert.show("不能超过" + $this.attr("placeholder"), "系统提示", function () {
                    $this.val($this.attr("data-max"))
                });
            }else if($this.attr("data-max") && parseFloat($this.val()) <= 0){
                Notification.alert.show("数值必须大于0", "系统提示", function () {
                    $this.val($this.attr("data-max"))
                });
            }
        });
        $body.on('click', '[data-href]', function (e) {
            Utils.preStop(e);
            var href = $(this).attr('data-href');
            var datas = Utils.extractPrefixAttrs($(this), 'data-data');

            if (href.indexOf('module://') > -1) { //模块间跳转采用 module:// 开头
                console.log("module 方式暂未实现");
            } else {
                _load(href, datas);
            }
        });

        $body.on('click', '[data-back]', function (e) {
            Utils.preStop(e);

            var href = $(this).attr('data-back');
            var datas = Utils.extractPrefixAttrs($(this), 'data-data');
            if (href.indexOf('module://') > -1) { //模块间跳转采用 module:// 开头
                console.log("module 方式暂未实现");
            } else {
                _back(datas);
            }
        });
    };

    /**
     * 页面初始化
     *
     *  用于在 pad 上运行的时候 初始化 title, 返回点击等
     */
    var _init = function (opts, resumeHandler, callback) {
        if (_debug) {
            WebContext.init(opts, resumeHandler, callback);
        } else {
            NativeContext.init(opts, resumeHandler, callback);
        }
    };

    /**
     * 注册页面返回回调, 方便传递参数
     *  使用场景: 在 a.html 打开一个 页面 b.html,
     *          当在 b.html 进行相关操作后, 在返回到 a.html, 并且需要携带一些数据 到 a.html
     *
     *  使用方式:
     *      在 a.html 中注册一个  onResumeListener,
     *      callback 为回调 a.html 会执行的方法, 参数会通过 callback 的参数返回
     */
    var _onResumeListener = function (callback) {
        if (_debug) {
            WebContext.onResumeListener(callback);
        } else {
            NativeContext.onResumeListener(callback);
        }
    };

    /**
     * 获取页面数据
     *  使用场景: 当从 a.html 跳转到 b.html 是, 需要携带参数到 b.html,
     *          在 b.html 中可以采用 getPageData 获取到, 回调函数的参数中 为携带的参数
     *
     * @param callback
     * @private
     */
    var _getPageData = function (callback) {
        var p = Utils.getQueryStringAsJson() || {};
        var data = {};
        if (p[WebStorage._s_load_key_]) {
            data = WebStorage.local.get(p[WebStorage._s_load_key_]);
        }
        callback(data);
    };

    /**
     * 下一步
     * @private
     */
    var _goNext = function () {
        var $section = $("section");
        var step = Number($section.attr("data-step"));
        $section.attr("data-step", step + 1);
        $(".step").find("li").eq(step).addClass("done");
    };

    /**
     * 返回
     * @param n
     * @private
     */
    var _goBack = function (n) {
        if ($(".ares_loading").length > 0) {
            return;
        }
        if ($(".ares_msg_box").length > 0) {
            $('.ares_msg_box').remove();
            return;
        }
        n = n || 1;
        var $section = $("section");
        var dataStep = $section.attr("data-step");
        var step = Number($section.attr("data-step"));
        var maxStep = $(".step").children().length;
        //页面没有设置data-step, 直接退出
        if (!dataStep || step === 1 || step === maxStep) {
            JSBridge.callHandler("AresGoBack");
        } else {
            $section.attr("data-step", step - n);
            $(".tab-content").scrollTop = 0;
        }
    };

    return {
        onResumeListener: _onResumeListener,
        getPageData: _getPageData,

        back: _back,
        goBack: _goBack,
        goNext: _goNext,
        load: _load,
        init: _init,
        bindEvent: _bindEvent
    }
})();

module.exports = Page;