var Config = require('ares.config.js');
var Notification = require('ares.notification.js');
var Plugins = require('ares.plugins.js');

var $ = require('jquery');

/**
 远程服务获取类库
 */
var Service = (function () {
    var get, _getUrl, _ajax, _ajaxId;

    /**
     * @method _ajax
     * @param url
     * @param data
     * @param type
     * @param success
     * @param fail
     * @param showLoading
     * @returns {*}
     * @private
     */
    _ajax = function (url, data, type, success, fail, showLoading) {
        var dataType = 'json';
        if ('jsonp' == type) {
            type = 'GET';
            dataType = 'jsonp';
        }

        _ajaxId = $.ajax({
            url: url,
            type: type,
            data: data,
            dataType: dataType,
            contentType: "application/json; charset=utf-8",
            timeout: Config.Server.timeOut * 1000,
            beforeSend: function () {
                if (showLoading && Config.service === "http") {
                    Notification.loading.show();
                }
            }
        }).always(function (data, textStatus, jqXHR) { // 不论成功与否都会执行
            if (showLoading) {
                Notification.loading.hide();
            }
        }).done(function (data) { // 请求成功时执行，异常时不会执行。
            console.log(url, data);
                //Session 超时
                
                if (data.STATUS === '005') {//session超时
                    //调用插件,退出到登陆页面
                    if (!Config.debug) {
                        //Notification.alert.show(data.MSG);
                        //Ares.Plugins.ToNativeView.toLoginPage('LoginPage', "nativeDispatcher", 'SESSION超时，请重新登录');
                    } else {
                        alert("请求超时！")
                    }
                    return;
                }

                //
                // if(data.STATUS === "-2"){ // 用户卡登录超时
                //     Notification.alert.show(data.MSG, function() {
                //         Ares.JSBridge.callHandler("AresGoBack");
                //     });
                // }
                
                if (data.STATUS === "1") {
                    success && success(data);
                } else {
                    fail && fail(data);
                    Notification.alert.show(data.MSG || "交易失败");
                }
            })
            .fail(function () { // 请求失败
                if (fail) {
                    fail();
                }
                Notification.alert.show('请求接口失败');
                return false;
            })
        ;
    };
    /**
     * 加载远程数据.
     *
     * @param {string} api 配置的api别名
     * @param {json} data  传输的数据
     * @param {function} success 成功后的回调
     * @param {function} fail 成功后的回调
     * @param {string} type 请求类型
     * @param {boolean} showLoading 自动显示背景
     */
    get = function (api, data, success, fail, type, showLoading) {
        var url;
        type = type || Config.service;
        if (typeof showLoading == 'undefined') {
            showLoading = true;
        }
        switch (type) {
            case "http":
                url = _getUrl(api);
                return _ajax(url, data, 'jsonp', success, fail, showLoading);
            case "static":
                url = Config.basepath + "mockData/" + api + ".json";
                return _ajax(url, data, 'GET', success, fail, showLoading);
            case "native":
                url = api + ".do";
                if (showLoading) {
                    Notification.loading.show();
                }
                return Plugins.HttpRequest.form('POST', url, data, function (rets) {
                    //alert(rets);
                    //alert(JSON.stringify(rets));
                    if (showLoading) {
                        Notification.loading.hide();
                    }
                    if (rets.STATUS === "1") {
                        success && success(rets);
                    }else if (rets.STATUS === "0") {
                        Notification.loading.hide();

                        if(fail){
                            fail(rets);
                        } else{
                            Notification.alert.show(rets.MSG || "交易失败");
                        }
                    }else if(rets.STATUS === "-1"){
                        Notification.loading.hide();
                        Notification.alert.show(rets.MSG || "网络连接失败. 请重试");
                    }else if(rets.STATUS === "-2"){ // 用户卡登录超时
                        Notification.alert.show(rets.MSG, '系统提示', function() {
                            Ares.JSBridge.callHandler("AresGoBack");
                        });
                    }else{
                        Notification.loading.hide();
                        rets.MSG && Notification.alert.show(rets.MSG);
                    }

                }, Config.ServiceEncrypt);
            default:
                break;
        }
    };
    /**
     * 通过api获取服务器的地址
     * @param api
     */
    _getUrl = function (api) {
        var url, defaultProtocol, serverIp, serverPort, serverContext;
        //TODO 如果是在客户端,通过插件取服务器配置地址
        defaultProtocol = Config.Server.defaultProtocol;
        serverIp = Config.Server.serverIp;
        serverPort = Config.Server.serverPort;
        serverContext = Config.Server.serverContext;

        url = defaultProtocol + '://' + serverIp + ':' + serverPort + "/" + (serverContext ? serverContext + "/" : "") + api + ".do";
        return url;
    };


    var post = function (api, data, success, fail, type, showLoading) {
        var url;
        type = type || Config.service;
        if (typeof showLoading == 'undefined') {
            showLoading = true;
        }
        switch (type) {
            case "http":
                url = _getUrl(api);
                return _ajax(url, data, 'POST', success, fail, showLoading);
            case "static":
                url = "data/" + api + ".json";
                return _ajax(url, data, 'POST', success, fail, showLoading);
                break;
            case "native":
                url = api + ".do";
                if (showLoading) {
                    Notification.loading.show();
                }
                return Plugins.HttpRequest.form('POST', url, data, function (rets) {
                    if (showLoading) {
                        Notification.loading.hide();
                    }
                    success && success(rets);
                }, Config.ServiceEncrypt);
                break;
            default:
                break;
        }
    };

    return {
        type: {
            http: 'http',
            static: 'static',
            native: 'native'
        },
        get: get,
        post: post
    };
})();

module.exports = Service;