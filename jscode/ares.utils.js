/**
 * ares.utils.js
 *
 * Ares 工具组件
 *  主要是对开发中一些公共方法的封装，方便代码编写
 */

var jQuery, $;
jQuery = $ = require('jquery');
var Config = require('ares.config.js');
var Notification = require('ares.notification.js');
var Service = require('ares.service.js');
var Verification = require("ares.verification.js");

/**
 * jQuery serializeObject
 */
(function ($) {
    $.fn.serializeObject = function () {
        "use strict";

        var result = {};
        var extend = function (i, element) {
            var node = result[element.name];

            // If node with same name exists already, need to convert it to an array as it
            // is a multi-value field (i.e., checkboxes)

            if ('undefined' !== typeof node && node !== null) {
                if ($.isArray(node)) {
                    node.push(element.value);
                } else {
                    result[element.name] = [node, element.value];
                }
            } else {
                result[element.name] = element.value;
            }
        };

        $.each(this.serializeArray(), extend);
        return result;
    };
})(jQuery || $);

function notFormSerialize($ctx) {
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i,
        rcheckableType = /^(?:checkbox|radio)$/i;
    var arr = $ctx.map(function () {
        var elements = [];
        $(this).find('input').each(function (i, o) {
            elements.push(o);
        });
        $(this).find('textarea').each(function (i, o) {
            elements.push(o);
        });
        $(this).find('select').each(function (i, o) {
            elements.push(o);
        });
        return elements;
    }).filter(function () {
        var type = this.type;
        // Use .is( ":disabled" ) so that fieldset[disabled] works
        return this.name && !jQuery(this).is(':disabled') && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
    }).map(function (i, elem) {
        var val = jQuery(this).val();
        return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val) {
            return {
                name: elem.name,
                value: val.replace(rCRLF, '\r\n')
            };
        }) : {
            name: elem.name,
            value: val.replace(rCRLF, '\r\n')
        };
    }).get();
    return arr;
}

Date.prototype.format = function (mask) {
    var d = this;
    var zeroize = function (value, length) {
        if (!length) length = 2;
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    };
    return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmMstT])\1?|[lLZ])\b/g, function ($0) {
        switch ($0) {
            case 'd':
                return d.getDate();
            case 'dd':
                return zeroize(d.getDate());
            case 'ddd':
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
            case 'dddd':
                return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
            case 'M':
                return d.getMonth() + 1;
            case 'MM':
                return zeroize(d.getMonth() + 1);
            case 'MMM':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
            case 'MMMM':
                return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
            case 'yy':
                return String(d.getFullYear()).substr(2);
            case 'yyyy':
                return d.getFullYear();
            case 'h':
                return d.getHours() % 12 || 12;
            case 'hh':
                return zeroize(d.getHours() % 12 || 12);
            case 'H':
                return d.getHours();
            case 'HH':
                return zeroize(d.getHours());
            case 'm':
                return d.getMinutes();
            case 'mm':
                return zeroize(d.getMinutes());
            case 's':
                return d.getSeconds();
            case 'ss':
                return zeroize(d.getSeconds());
            case 'l':
                return zeroize(d.getMilliseconds(), 3);
            case 'L':
                var m = d.getMilliseconds();
                if (m > 99)
                    m = Math.round(m / 10);
                return zeroize(m);
            case 'tt':
                return d.getHours() < 12 ? 'am' : 'pm';
            case 'TT':
                return d.getHours() < 12 ? 'AM' : 'PM';
            case 'Z':
                return d.toUTCString().match(/[A-Z]+$/);
            default:
                return $0.substr(1, $0.length - 2);
        }
    });
};

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时F
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
    return fmt;
}

var defaultsRenderHandlers = (function (handlers) {
    ["input", "textarea"].forEach(function (tag) {
        if (handlers[tag]) {
            return;
        }
        handlers[tag] = function (el, name, value, fnPrepare, fnComplete) {
            var v = (fnPrepare && fnPrepare(el, name, value)) || value;
            el.val(v);
            fnComplete && fnComplete(el, name, v, value);
        }
    });

    ["select"].forEach(function (tag) {
        if (handlers[tag]) {
            return;
        }
        handlers[tag] = function (el, name, value, fnPrepare, fnComplete) {
            var v = (fnPrepare && fnPrepare(el, name, value)) || value;
            v && el.find('option[value=' + v + ']').attr('selected', true);
            fnComplete && fnComplete(el, name, v, value);
        }
    });

    ["img", "audio", "video"].forEach(function (tag) {
        if (handlers[tag]) {
            return;
        }
        handlers[tag] = function (el, name, value, fnPrepare, fnComplete) {
            var v = (fnPrepare && fnPrepare(el, name, value)) || value;
            el.attr('src', v);
            fnComplete && fnComplete(el, name, v, value);
        }
    });

    ["div", "span", "body"].forEach(function (tag) {
        if (handlers[tag]) {
            return;
        }
        handlers[tag] = function (el, name, value, fnPrepare, fnComplete) {
            var v = (fnPrepare && fnPrepare(el, name, value)) || value;
            el.text(v);
            fnComplete && fnComplete(el, name, v, value);
        }
    });

    return handlers;
})({});

var Utils = {
    /**
     * 替换数据
     * @param str
     * @param pattern
     * @param target
     * @return {*}
     */
    replaceAll: function (str, pattern, target) {
        if (str)
            str = str.replace(new RegExp(pattern, "gm"), target);
        return str;
    },
    Event: {
        prStop: function (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    },
    Serializer: {
        array: function (ctx) {
            var $ctx = $(ctx);
            if ($ctx[0].tagName.toLowerCase() == 'form') {
                return $ctx.serializeArray();
            } else {
                return notFormSerialize($ctx);
            }
        },
        params: function (ctx) {
            var $ctx = $(ctx);
            if ($ctx[0].tagName.toLowerCase() == 'form') {
                return $ctx.serialize();
            } else {
                var arr = notFormSerialize($ctx);
                return jQuery.param(arr);
            }
        },
        object: function (ctx) {
            var $ctx = $(ctx);
            if ($ctx[0].tagName.toLowerCase() == 'form') {
                return $ctx.serializeObject();
            } else {
                var o = {};
                var a = notFormSerialize($ctx);
                $.each(a, function () {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        o[this.name] = this.value || '';
                    }
                });
                return o;
            }
        }
    },

    /**
     * 渲染数据
     * @param data
     * @param ctx
     * @param options
     */
    render: function (data, ctx, options) {
        var defaultOptions = {
            fnPrepare: null,
            fnComplete: null,
            handlers: defaultsRenderHandlers
        };

        var opts = $.extend(true, {}, defaultOptions, options);
        var fnPrepare = opts['fnPrepare'];
        var fnComplete = opts['fnComplete'];
        var handlers = opts['handlers'];

        ctx = ctx || 'body';
        if (data) {
            $.each(data, function (k, v) {
                var el = $(ctx).find('#' + k)
                if (!(el && el.length > 0)) {
                    el = $(ctx).find('[name="' + k + '"]');
                    if (!(el && el.length > 0)) {
                        el = $(ctx).find('[data-name="' + k + '"]');
                    }
                }

                el.each(function () {
                    var tag = this && this.tagName.toLowerCase();
                    var $this = $(this);
                    var handler = handlers[tag];
                    if (!handler) {
                        throw new Error('No handler for  tag[' + tag + '], please set a handler');
                    }

                    handler($this, k, v, fnPrepare, fnComplete);
                });

            });
        }

    },

    /**
     * 生成随机数
     * @param len   长度
     * @param radix 基数
     * @return {string} 随机数
     */
    makeUuid: function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
            uuid = [],
            i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    },

    /**
     * 发送短信验证码
     *
     * @param that 点击元素
     * @param params 参数
     *          模板编号    tempNo：FREE0001：验证码短信，FREE0002：账户变动提醒短信，FREE0003：通知短信(非必传)
     *          手机号码    phone   (必传)
     *          客户姓名    name    (必传)
     *          业务类型    busiType 00：开卡签约 01：开卡激活 02：开一站式签约 03：证书下载  (必传)
     *          短信内容    smsContent  (非必传)
     * @param callback 成功回调方法
     */
    sendSmsCode: function (that, params, callback) {
        if (!params.phone) {
            Notification.alert.show('请输入手机号码');
            return;
        }
        if (!Verification.isPhone(params.phone)) {
            Notification.alert.show('请输入正确的手机号码');
            return;
        }
        params = {
            sjhm: params.phone,
            khxm: params.name,
            ywlx: params.busiType,
        };
        //获取验证码
        Service.get('db/xaks/iGetVerifCode', params, function (json) {
            alert(json.msgCode);
            that.attr('disabled', 'disabled').html('60s');
            var time = setInterval(function () {                       //定时器
                var reExp = /[0-9]*/;
                var times = reExp.exec(that.html());
                if (times > 1) {
                    times = times - 1;
                    that.html(times + 's');
                } else {
                    clearInterval(time);
                    that.removeAttr('disabled').html('重发验证码');
                }
            }, 1000);
            callback && callback(true);
        }, function () {
            Notification.alert.show("发送失败");
            callback && callback(false);
        });
    },

    /**
     * 校验短信验证码
     * @param that  点击元素
     * @param phone 手机号码
     * @param smsCode   短信验证码
     * @param callback 成功回调方法
     */
    checkSmsCode: function (that, phone, smsCode, callback) {
        if (!Verification.required(smsCode)) {
            Notification.alert.show('请输入短信验证码');
            return false;
        }
        if (!Verification.isSmsCode(smsCode)) {
            Notification.alert.show('请输入正确的短信验证码');
            return false;
        }
        //校验短信验证码
        var param = {
            sjhm: phone,
            dxyzm: smsCode
        };
        Service.get('db/xaks/iCheckVerifCode', param, function () {
            callback && callback(true);
        }, function (data) {
            Notification.alert.show(data.MSG||"验证码错误");
            callback && callback(false);
        });
    },


    /**
     * 表单校验
     * @param   form  校验表单的jQuery对象
     * @return  boolean 校验成功或失败
     */
    formValidate: function (form) {
        var success = true;
        form.find("input,select").each(function () {
            var $this = $(this),
                label = $this.prev();
            if ($this.attr("data-required") === "false" || $this.is(":hidden")) {
                return true;
            }
            if (!Verification.required($this.val())) {
                if ($this.attr("placeholder") && $this.attr("data-verityData") !== "money") {
                    Notification.alert.show($this.attr("placeholder"))
                } else {
                    var tagName = $this[0].tagName.toLocaleLowerCase();
                    var tips = tagName === "input" && $this.attr("type") !== "date" ? "请输入" : "请选择";
                    Notification.alert.show(tips + label.text().replace(":", ""));
                }
                label.addClass("error");
                success = false;
                return false;
            } else {
                label.removeClass("error");
            }
            var dataType = $this.attr("data-verityData");
            if (dataType && !eval(Verification.match[dataType]).test($this.val())) {
                Notification.alert.show("请输入正确的" + label.text().replace(":", ""));
                label.addClass("error");
                success = false;
                return false;
            }
            var dataCompare = $this.attr("data-end");
            if(dataCompare && parseFloat($("input[data-start='"+dataCompare+"']").val()) > parseFloat($("input[data-end='"+dataCompare+"']").val())){
                Notification.alert.show($("input[data-start='"+dataCompare+"']").prev().text().split("(")[0].replace(":", "")+" 不可大于 "+label.text().replace(":", ""));
                label.addClass("error");
                success = false;
                return false;
            }

        });
        return success;
    },

    /**
     * 整合页面数据,保存待发送接口
     * @param   form 表单的jQuery对象
     * @param   mark 取数据标识,默认data-name
     * @return  object 整合后的json
     */
    buildJson: function (form, mark) {
        mark = mark || "data-name";
        var json = {};
        form.find("input,select").each(function () {
            var $this = $(this);
            if ($this.attr(mark)) {
                if($this.attr("type") === "radio" && !$this.prop("checked")){
                    return true;
                }else{
                    if($this.attr("type") === "date"){
                        json[$this.attr(mark)] = $this.val().replace(/-/g, '');
                    }else{
                        json[$this.attr(mark)] = $this.val();
                    }

                }
            } else {
                return true;
            }
        });
        return json;
    }
};

module.exports = Utils;