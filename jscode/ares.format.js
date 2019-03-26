/**
 * Ares 格式化模块
 * @type {{fmtAcctNo, removeSpace, fmtIdentityType, fmtDate, fmtMoney, fmtAmt, fmtAmt4s, delFmtMony, unfmtAmt, fmtAddPercent, fmtNumber2Chinese}}
 */

var Format = (function () {

    return {
        /**
         * 帐号格式化、 添加空格分隔符    hidden = true将隐藏部分号码
         * @param  value {string}账户
         * @param hidden {bool}  是否隐藏账户  true为隐藏
         */
        fmtAcctNo: function (value, hidden) {
            if (value == null || value == "") {
                return "";
            }
            hidden = hidden || false;
            value = Format.removeSpace(value);
            var tmpStr = "";
            if (hidden) {
                var start = value.length - 4;
                if (start < 4) {
                    start = 4;
                }
                tmpStr = tmpStr + value.substring(0, 6) + " ****** " + value.substring(start, value.length);
            } else {
                while (value.length > 4) {
                    tmpStr = tmpStr + value.substring(0, 4);
                    tmpStr = tmpStr + " ";
                    value = value.substring(4, value.length);
                }
                tmpStr = tmpStr + value;
            }
            return tmpStr;
        },

        /**
         * 去除字符串空格
         * @param value
         * @returns {string}
         */
        removeSpace: function (value) {
            var rtnVal = value + ""; // 转为字符串toString
            return rtnVal.replace(/\s/g, "");
        },

        /**
         * 日期格式化
         * @param {} v
         * @param {} format
         */
        fmtDate: function (v, format) {
            if (!v) return '';
            if (v == 'null') return '';
            if (!Fw.isDate(v)) {
                if (v.length == 8) {
                    return v.substring(0, 4) + '年' + v.substring(4, 6) + '月' + v.substring(6, 8) + '日';
                }
                else if (v.length == 14) {
                    return v.substring(0, 4) +
                        '年' + v.substring(4, 6) +
                        '月' + v.substring(6, 8) +
                        '日' + v.substring(8, 10) +
                        '时' + v.substring(10, 12) +
                        '分' + v.substring(12, 14) + '秒';
                }
                else if (v.length == 6) {
                    return v.substring(0, 2) +
                        '时' + v.substring(2, 4) +
                        '分' + v.substring(4, 6) + '秒';
                }
                else {
                    v = String(v).split('.')[0];
                    v = v.replace(/-/g, '/').replace('年', '/').replace('月', '/').replace('日', '').replace('时', ':').replace('分', ':').replace('秒', '');
                    v = new Date(Fw.isNumber(v * 1) ? v * 1 : Date.parse(v));
                }
            }
            return v.format(format || 'yyyy年MM月dd日');
        },
        /**
         * 格式化金额
         * @param v 原始金额
         * @param c 小数点后保留为数（默认为2）
         * @param d 小数点
         * @param t 整数区千位分割（默认为逗号）
         * @returns {string}
         */
        fmtMoney: function (v, c, d, t) {
            v = v + "";
            v = v.replace(/,/g, "");
            v *= 1;
            var p = v < 0 ? '-' : '';
            c = c || 2;
            v = v.toFixed(c);
            c = Math.abs(c) + 1 ? c : 2;
            d = d || '.';
            t = t === '' ? '' : ',';
            var m = (/(\d+)(?:(\.\d+)|)/.exec(v + ''));
            var x = m[1].length > 3 ? m[1].length % 3 : 0;
            return p + (x ? m[1].substr(0, x) + t : '')
                + m[1].substr(x).replace(/(\d{3})(?=\d)/g, '$1' + t)
                + (c ? d + (+m[2] || 0).toFixed(c).substr(2) : '');
        },

        /**
         * 金额格式化保留2位小数点
         * @param s
         * @returns {*}
         */
        fmtAmt: function (s) {
            try {
                return this.fmtMoney(s, 2, ".", ",");
            } catch (e) {
                return "0.00";
            }
        },

        /**
         * 金额格式化保留4位小数点
         * @param s
         * @returns {*}
         */
        fmtAmt4s: function (s) {
            try {
                return this.fmtMoney(1.0000 * s, 4, ".", ",");
            } catch (e) {
                return "0.0000";
            }
        },

        /**
         * 去除金额格式化
         * @param b
         * @returns {string}
         */
        delFmtMony: function (b) {
            var a = b.trim() + "";
            if (a.indexOf(".") != -1) {
                a = a.substr(0, a.indexOf(".") + 3);
            }
            return a.replace(/,/g, "");
        },

        /**
         * 金额去格式化
         * @param s
         * @returns {string|void|XML}
         */
        unfmtAmt: function (s) {
            return s.replace(/,/g, "");
        },

        /**
         * 利率格式化
         * @param b
         * @returns {string}
         */
        fmtAddPercent: function (b) {
            var a = Math.floor(b * 100) / 100;
            a = (a.toFixed(2));
            return a + "%";
        },
        /**
         * 格式化数字为大写汉字
         * @param num
         * @returns {string}
         */
        fmtNumber2Chinese: function (num) {
            num = num.replace(/,/g, '');
            if (!/^\d*(\.\d*)?$/.test(num))throw(new Error(-1, "Number is wrong!"));
            var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
            var BB = new Array("", "拾", "佰", "仟", "萬", "億", "圆", "");
            var CC = new Array("角", "分", "厘");
            var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
            for (var i = a[0].length - 1; i >= 0; i--) {
                switch (k) {
                    case 0 :
                        re = BB[7] + re;
                        break;
                    case 4 :
                        if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                            re = BB[4] + re;
                        break;
                    case 8 :
                        re = BB[5] + re;
                        BB[7] = BB[5];
                        k = 0;
                        break;
                }
                if (k % 4 == 2 && a[0].charAt(i) == "0" && a[0].charAt(i + 2) != "0") re = AA[0] + re;
                if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
                k++;
            }
            if (a.length > 1) {
                re += BB[6];
                for (var i = 0; i < a[1].length; i++) {
                    re += AA[a[1].charAt(i)] + CC[i];
                    if (i == 2) break;
                }
                if (a[1].charAt(0) == "0" && a[1].charAt(1) == "0") {
                    re += "元整";
                }
            } else {
                re += "元整";
            }
            return re;
        },

        /**
         * 手机格式化
         *
         * @param s 需要格式化的字符串
         * @return string 返回格式化字符串
         */
        formatPhone: function (s) {
            if (!s || s.length !== 11) {
                return s;
            }
            return s.replace(/(\d{3})(\d{4})/, "$1 $2 ");
        },
    }
})();

module.exports = Format;