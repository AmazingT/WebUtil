/**
 * ares.device.js
 *
 * Ares 设备组件
 *
 */
var Device = (function () {

    var _androidAdapter;

    /**
     * ANDROID适配器
     * @param resolution 格式：宽_高
     * @param moduleName 模块名称
     * @private
     */
    _androidAdapter  = function (resolution,moduleName) {
        //android终端或者uc浏览器
        var isAndroid = navigator.userAgent.indexOf('Android') > 0;
        if(isAndroid){
            var fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", "a"+resolution+"_"+moduleName+".css");
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    };

    return {
        androidAdapter: _androidAdapter
    }
})();

module.exports = Device;