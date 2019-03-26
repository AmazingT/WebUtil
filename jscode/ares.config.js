/**
 * ares.config.js
 *
 * Ares 配置组件
 *
 *  moduleConfig -- 模块全局配置文件 {package.json} 文件中的内容
 *  $ -- jQuery
 *
 * 常用配置说明
 *
 *  debug: 是否是调试模式，依赖于 [moduleConfig] 中debug配置，
 *         true表示启用调试模式，比如一些依赖原生的组件不会其作用，
 *         如JSBridge等
 *
 *  local: 是否加载本地数据，依赖于 [moduleConfig] 中local配置，
 *         true表示加载本地数据 {data/*.json} 文件
 *
 *  ServiceType: 服务类型
 *
 *  Server: 配置服务器信息
 */

var moduleConfig = require.config(); //模块配置信息

var Config = {
    'name': moduleConfig.name,
    'appID' : moduleConfig.config.appID,
    'logger': moduleConfig.config.logger || 'console',
    'version': moduleConfig.version,
    'basepath':"/"+moduleConfig.name+"/"+moduleConfig.version+"/",
    'debug': moduleConfig.config.debug, //是否是调试模式
    'service': moduleConfig.config.service,  //请求数据的类型 http:jsonp | native:通过原生调用后管服务 | static:静态数据
    'Server':moduleConfig.config.Server,
    'ServiceEncrypt':moduleConfig.config.ServiceEncrypt
};

module.exports = Config;