var Config = require('ares.config.js');

/**
 * JSBridge 操作组件
 * @type {{registerHandler, send, callHandler}}
 *
 * callback函数返回参数约定
 *
 * {
 *  status: '1', //1 -- 成功, 0 -- 失败
 *  message: '提示信息'
 *  data: {
 *      o1:{}
 *      o2:
 *  }
 *
 * }
 *
 */
var JSBridge = (function () {

    function checkJSBridge() {
        if (!Ares.__bridge__) {
            if (WebViewJavascriptBridge) {
                Ares.__bridge__ = WebViewJavascriptBridge;
            }
        }

        if (!Ares.__bridge__) {
            throw new Error('WebViewJavascriptBridge object error');
        }
    }

    /**
     * 注册一个名为 [handler] 的处理器，并定义用于响应的处理逻辑
     */
    var _registerHandler = function (handler, callback) {
        if (Config.debug) {
            return;
        }
        checkJSBridge();
        Ares.__bridge__.registerHandler(handler, callback);
    };

    /**
     * 发送消息给native端, 并定义回调函数
     */
    var _send = function (params, callback) {
        if (Config.debug) {
            return;
        }
        checkJSBridge();
        Ares.__bridge__.send(params, callback);
    };

    /**
     * 调用名为 [handler] 的native端处理器，并传递参数，同时设置回调处理逻辑
     */
    var _callHandler = function (handler, params, callback) {
        if (Config.debug) {
            return;
        }
        checkJSBridge();
        Ares.__bridge__.callHandler(handler, params, callback);
    };

    /**
     * onReady 确保WebViewJavascriptBridge注册完成
     */
    var _onReady = function(callback, init) {
        init = (init && typeof init == 'function') ? init : function(message, responseCallback) {};
        if (window.WebViewJavascriptBridge) {
            Ares.__bridge__ = WebViewJavascriptBridge;
            Ares.__bridge__.init(init);

            callback();
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                Ares.__bridge__ = WebViewJavascriptBridge;
                Ares.__bridge__.init(init);

                callback();
            }, false);
        }
    };

    return {
        onReady:_onReady,
        registerHandler: _registerHandler,
        send: _send,
        callHandler: _callHandler
    }
})();

module.exports = JSBridge;