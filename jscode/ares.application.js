var Config = require('ares.config.js');
var Application = (function() {
    var _info = null;

    return {
        set: function(info) {
            _info = info;
            console.log(_info);
        },
        get: function() {
            return _info;
        },
        getValue: function(property) {
            if (Config.debug) {
                return Config.appID;
            }
            return _info[property];
        },
        appId: function() {
            return this.getValue('appID');
        }
    }

})();

module.exports = Application;