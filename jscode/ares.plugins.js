var $ = require('jquery');
var JSBridge = require('ares.jsbridge.js');
var Notification = require('ares.notification.js');

var Plugins = {};

/**
 * 监听当前焦点, 控制键盘显示隐藏
 *
 * @type {{show, hide}}
 */
Plugins.KeyBoardListener = (function () {

    var _show, _hide;

    _show = function (h) {
        var $focus = $(':focus');

        var $content = $focus.closest(".modal").length ? $focus.closest(".modal") : $focus.closest("section article"),
            keyboardH = parseInt(h.height),
            meTop = $focus.get(0).getBoundingClientRect().top,
            offset = $focus.outerHeight() + 10;

        if (keyboardH - (Ares.deviceHeihgt - meTop) >= 0) {
            $content.css({
                "transform": "translateY(-" + (keyboardH - (Ares.deviceHeihgt - meTop) + offset) + "px)"
            });
        }
    };

    _hide = function (h) {
        $('.modal,section article').css({
            "transform": "translateY(0)"
        });
    };
    return {
        show: _show,
        hide: _hide
    };
})();

/**
 * 照相机插件
 *
 * @type {{name, type, take}}
 */
Plugins.Camera = (function () {
    var defOpts = {
        width: 262,
        height: 167
    };
    var _type = {
        base64: 'base64',
        path: 'path'
    };

    var _take = function (callback, opts, params) {
        opts = opts || {};
        params = $.extend({}, defOpts, opts);
        params = [params, {type: opts.type || _type.base64, name: opts.name || '', ishead: opts.ishead || false, hasHjBase: opts.hasHjBase || false}];

        JSBridge.callHandler('AresPluginsCamera', params, callback);
    };

    return {
        name: "Ares.Plugins.Camera",
        type: _type,
        take: _take
    }
})();


/**
 * 背夹插件
 */
Plugins.IMate = (function () {

    return {
        take: function (params, callback, errorCallback) {
            // Notification.loading.show();
            JSBridge.callHandler('AresIMate', params, function(data){
                // Notification.loading.hide();
                if(data.STATUS==="1"){
                    callback && callback(data.data);
                }else{
                    if (errorCallback) {
                        errorCallback && errorCallback();
                    }
                    else {
                        Notification.alert.show(data.MSG);
                    }
                }
            });
        },
        idCard: function (callback) {
            this.take(['IDCard'], callback);
        },
        icCard: function (callback) {
            this.take(['ICCard'], callback);
        },
        icCardNoTip: function (callback, errorCallback) {
            this.take(['ICCardNoTip'], callback, errorCallback);
        },
        bankCard: function (callback) {
            this.take(['BankCard'], callback);
        },
        fingerPrint: function (callback) {//指纹
            this.take(['fingerprint'], callback);
        },
        secPassWd: function (params,callback) {//安全密码
            this.take(['keyboard',params], callback);
        },
        sign: function (callback) {//签名
            this.take(['getSign'], callback);
        },
        getSn: function(callback){//背夹序列号
            this.take(['getSn'], callback);
        }
    }

})();


/**
 * 网络请求插件
 */
Plugins.HttpRequest = (function () {

    /**
     * application/x-www-form-urlencoded
     *
     * @private
     */
    var _form = function (method, url, params, callback, encrypt) {
        var data = [method, url, params, encrypt];

        console.log("------------" + url + "------------------");
        console.log(data);

        JSBridge.callHandler('AresHttpRequest', data, function (rets) {
            console.log(rets);
            console.log("------------" + url + "------------------");
            console.log("");


            callback(rets);
        });
    };

    return {
        form: _form
    }
})();

/**
 * 文件上传
 * @type {{uploadZipFile}}
 */
Plugins.FileUploder = (function () {

    var _uploadZipFile = function (paths, params, callback) {
        var data = [{"url": "ares/file/upload.do"}, {"paths": paths}, {"params": params}];
        JSBridge.callHandler('AresFileUpload', data, function (rets) {
            callback && callback(rets);
        });
    };

    return {
        uploadZipFile: _uploadZipFile,
    }
})();

/**
 * 发卡箱
 * @type {{take, dispense, retain, reset}}
 */
Plugins.CardBox = (1function(){

    return {
        take: function (params,callback) {
            if(Ares.Config.debug){
                callback && callback(data);
                return;
            }
            Notification.loading.show();
            JSBridge.callHandler('AresIMate', params, function(data){
                Notification.loading.hide();
                if(data.status==="1"){
                    callback && callback(data.data);
                }else{
                    Notification.alert.show(data.msg);
                }
            });
        },
        IcCard:function (callback) {   //读卡
            this.take(['ReadCard'], callback);
        },
        dispense: function(callback){   //发卡
            this.take(['dispense'], callback);
        },
        retain: function(callback){     //吞卡
            this.take(['retain'], callback);
        },
        reset: function(callback){      //复位
            this.take(['reset'], callback);
        },

    }
})();

Plugins.PDFView = (function() {

    return {
        show: function (title, file) {
            alert(111);
        }
    }

})();

/**
 *
 * 签名插件
 * @type {{}}
 */
Plugins.Signature = (function () {
    var _sign = function (params, callback) {
        var data = [params];
        JSBridge.callHandler('AresSignPlugin', data, function (rets) {
            callback && callback(rets);
        });
    };
    return {
        sign: _sign
    }
})();

/**
 *
 * 条形码插件
 * @type {{}}
 */
Plugins.barCode = (function () {
    var _scan = function (params, callback) {
        var data = [params];
        JSBridge.callHandler('AresBarCodePlugin', data, function (rets) {
            callback && callback(rets);
        });
    };
    return {
        scan: _scan
    }
})();

/**
 *
 * 二维码插件
 * @type {{}}
 */
Plugins.QRCode = (function () {
    var _scan = function (params, callback) {
        var data = [params];
        JSBridge.callHandler('AresQRCodePlugin', data, function (rets) {
            callback && callback(rets);
        });
    };
    return {
        scan: _scan
    }
})();

/**
 *
 * 补件箱弹框插件
 * @type {{}}
 */
Plugins.patchBox = (function () {
    var _alert = function (params, callback) {
        var data = [params];
        JSBridge.callHandler('AresPatchBoxPlugin', data, function (rets) {
            callback && callback(rets);
        });
    };
    return {
        alert: _alert
    }
})();

/**
 * 关闭等待层
 */
Plugins.loading = (function () {
    var _hide = function () {
        JSBridge.callHandler('AresIMate', ['closeLoading']);
    };
    return {
        hide: _hide
    }
})();

/**
 *
 * 录音插件
 * @type {{}}
 */
Plugins.record = (function () {
    var _record = function (params, callback) {
        var data = [params];
        JSBridge.callHandler('AresRecordPlugin', data, function (rets) {
            callback && callback(rets);
        });
    };
    return {
        record: _record
    }
})();

/**
 *
 * 录像插件
 * @type {{}}
 */
Plugins.video = (function () {
    var _video = function (params, callback) {
        var data = [params];
        JSBridge.callHandler('AresVideoPlugin', data, function (rets) {
            callback && callback(rets);
        });
    };
    return {
        video: _video
    }
})();

/**
 *
 * 水印插件
 * @type {{}}
 */
Plugins.phoneMark = (function () {
    var _AresNearBuilding = function (params, callback) {
        var data = [params];
        JSBridge.callHandler('AresNearBuilding', data, function (rets) {
            callback && callback(rets);
        });
    };
    return {
        AresNearBuilding: _AresNearBuilding
    }
})();

/**
 *
 * 清空水印
 * @type {{}}
 */
Plugins.ResetMark = (function () {
    var _AresResetNearBuilding = function (params, callback) {
        var data = [params];
        JSBridge.callHandler('AresResetNearBuilding', data, function (rets) {
            callback && callback(rets);
        });
    };
    return {
        AresResetNearBuilding: _AresResetNearBuilding
    }
})();


module.exports = Plugins;