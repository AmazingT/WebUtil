/**
 *  Ares 验证模块
 */
require('validation');
var $ = require('jquery');
var Notification = require('ares.notification.js');

var Verification = {

    Engine: {
        bind: function (ctx, opts) {
            var defaultOptions = {
                showPrompts: false,
                binded: false,
                focusFirstField: false,
                showOneMessage: true,
                maxErrorsPerField: 1
            };
            opts = $.extend({}, defaultOptions, opts || {});

            $(ctx).validationEngine(opts)
                .bind('jqv.field.result', function (event, field, isError, promptText) {
                    if (isError) {
                        if (promptText.indexOf('* 至少填写其中一项') > -1) {
                            var g = field.attr('data-group-title') || '查询条件';
                            var gTip = promptText;
                            if (g) {
                                gTip = gTip.replace('*', g);
                            }

                            Notification.alert.show(gTip, '系统提示', function () {
                                field.focus();
                            });
                        } else {
                            var tip = field.attr('data-error-tip');
                            if (!tip) {
                                var title = field.attr('data-title');
                                if (!title) {
                                    var $label = $('label[for="' + field.attr('id') + '"]');
                                    title = ($label.length > 0 ? $label.html() : '');
                                }
                                promptText = promptText || '验证出错';
                                if (title) {
                                    tip = promptText.replace('*', title);
                                }
                            }
                            Notification.alert.show(tip, '系统提示', function () {
                                field.focus();
                            });
                        }
                    }
                });
        },
        validate: function (ctx) {
            return $(ctx).validationEngine('validate');
        }
    },

    /**
     * 验证是否为空串,需要true
     *
     * @param s 需要验证的字符串
     * @returns {boolean} true - 不为空
     */
    required: function (s) {
        s = (typeof s === 'string' ? s : (typeof s === 'undefined' || s === null) ? "" : s.toString());
        s = s.trim();
        return s != '';
    },

    /**
     * 判断字符串长度是否为指定的长度
     *
     * @param s
     * @param arr
     */
    length: function (s, arr) {
        s = (typeof s === 'string' ? s : (typeof s === 'undefined' || s === null) ? "" : s.toString());

        if (Array.isArray(arr)) {
            if (arr.length < 2) {
                arr.length = 2;
            }
            var minLen = parseInt(arr[0] || 0);
            var maxLen = parseInt(arr[1] || Number.MAX_VALUE);

            return !(s.length < minLen || s.length > maxLen);
        }
        return false;
    },

    /**
     * 验证是否是手机号码
     *
     * @param s 需要验证的字符串
     * @returns {boolean} true - 是手机号
     */
    isPhone: function (s) {
        var r = /^1[3456789]\d{9}$/;
        return r.test(s);
    },

    /**
     * 手机动态输入【keyUp】格式化
     *
     * @param s 需要格式化的字符串
     * @return string 返回格式化字符串
     */
    keyUpPhone: function (s) {
        return s.replace(/\s/g, '').replace(/(^\d{3})(?=\d)/g, "$1 ").replace(/(\d{4})(?=\d)/g, "$1 ");
    },

    /**
     * 手机格式化
     *
     * @param s 需要格式化的字符串
     * @return string 返回格式化字符串
     */
    formatPhone: function (s) {
        if (!s || s.length != 11) {
            return s;
        }
        return s.replace(/(\d{3})(\d{4})/, "$1 $2 ");
    },

    /**
     * 身份证格式化
     *
     * @param s 需要格式化的字符串
     * @return string 返回格式化字符串
     */
    formatIDCard: function (s) {
        if (!s || s.length != 18) {
            return s;
        }
        return s.replace(/(\d{6})(\d{4})(\d{4})(\d{2})(\w{2})/, "$1 **** **** **$5");
    },

    /**
     * 银行卡格式化【四位数字一组，以空格分割】
     *
     * @param s 需要格式化的字符串
     * @return string 返回格式化字符串
     */
    formatBankCard: function (s) {
        if (!s) {
            return s;
        }
        return s.replace(/(\d{4})(?=\d)/g, "$1 ");
    },

    /*
     * 格式化金额：
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * */
    formatMoney: function (number, decimals) {
        var s = '0';
        if (!number) {
            return s;
        }
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number;
        var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
        var toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.ceil(n * k) / k;
        };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + ',' + "$2");
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(".");
    },

    /**
     * 验证是否是身份证号码
     *
     * @param s 需要验证的字符串
     * @returns {boolean} true - 是身份证号
     */
    isIDCard: function (s) {
        var r = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
        return r.test(s);
    },

    /**
     * 验证是否是用户姓名
     *
     * @param s 需要验证的字符串
     * @returns {boolean} true - 是用户姓名
     */
    isName: function (s) {
        var r = /^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/;
        return r.test(s);
    },

    /**
     * 验证短信验证码
     *
     * @param s 需要验证的字符串
     * @returns {boolean} true - 是短信验证码
     */
    isSmsCode: function (s) {
        var r = /^(\d{6})$/;
        return r.test(s);
    },

    /**
     * 格式化电话号码
     *
     * @param s 需要验证的字符串
     * @returns string  格式化后的字符串
     */
    formatTelephone: function (s) {
        var sub = s.substring(0, 3);
        var areaCode = ["010", "021", "022", "023", "852", "853", "024", "025", "027", "028"];
        if ($.inArray(sub, areaCode) >= 0) {
            return sub + "-" + s.substring(3, s.length);
        } else {
            return s.substring(0, 4) + "-" + s.substring(4, s.length);
        }
    },

    /**
     * 校验密码一致性
     * @param pwd 密码 [密码,密码说明文字]
     * @param RePwd 确认密码 [密码,密码说明文字]
     */
    diffPwd: function(pwd,RePwd){
        if(pwd[0].trim()===""){
            Notification.alert.show("请输入"+pwd[1]);
            return false;
        }
        if(RePwd[0].trim()===""){
            Notification.alert.show("请输入"+RePwd[1]);
            return false;
        }
        if(pwd[0]!==RePwd[0]){
            Notification.alert.show(pwd[1]+" 与 "+RePwd[1]+"不一致");
            return false;
        }
        return true;
    },

    /**
     * 正则表达式
     *
     */
    match:{
        name:"/^[\u4e00-\u9fa5]{2,5}$/",
        phone:"/^0?(13|14|15|16|17|18|19)[0-9]{9}$/",
        tel:"/^(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,14}$/",
        SmsCode:"/^[0-9]{6}$/",
        email:"/^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w+)+)$/",
        IdCard:"/(^\\d{15}$)|(^\\d{17}([0-9]|X)$)/",
        postCode:"/^[1-9]{1}(\\d+){5}$/",
        money:"/^(([1-9]\\d*)|\\d)(\\.\\d{1,2})?$/"
    }
};

module.exports = Verification;