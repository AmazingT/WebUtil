var Config = require('ares.config.js');
var Session = (function() {
    var _info = null;

    var _dubugData = {
        loginName: 'shjj'
    };

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
                return _dubugData[property];
            }
            return _info[property];
        },

        loginName: function() {
            return this.getValue("loginName");
        },

        /*organId: function() {
            return this.getValue("organId");
        },*/
        organId: function() {
            return this.getValue("orgId");
        },
        loginId: function() {
            return this.getValue("loginId");
        }
    }

})();

module.exports = Session;