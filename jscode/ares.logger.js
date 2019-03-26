var Config = require('ares.config.js');

var Logger = (function () {
    var ctx = Config.logger;
    var Context = {
        "console": {
            log : function(message) {
                console.log(message);
            }
        },
        "alert": {
            log : function(message) {
                alert(message);
            }
        },
        "server": {

        }
    };

    function LoggerLevel(value, name) {
        this.value = value;
        this.name = name;
    }

    var log = function(level, message, e) {
        var tag = level.name;
        try {
            Context[ctx].log(tag + ": " + JSON.stringify(message));
        } catch (e1) {
            try {
                Context[ctx].log(tag + ": " + message.toString());
            } catch (e2) {
                Context[ctx].log(tag + ": " + message);
            }
        }

        if (message && typeof message == 'object') {
            Context[ctx].log(message);
        }

        if (e) {
            Context[ctx].log(e.toString);
        }
    };

    return {
        TRACE: new LoggerLevel(1, 'TRACE'),
        DEBUG: new LoggerLevel(2, 'DEBUG'),
        INFO: new LoggerLevel(3, 'INFO'),
        WARN: new LoggerLevel(4, 'WARN'),
        ERROR: new LoggerLevel(5, 'ERROR'),

        level: new LoggerLevel(3, 'INFO'), //default level is INFO

        setLevel: function(level) {
            if (!level) {
                throw Error('argument level required');
            }
            if(level.constructor != LoggerLevel) {
                throw Error('argument level must a instanceof LoggerLevel');
            }
            this.level = level;

            return this;
        },
        enable: function(level) {
            if (!level) {
                return false;
            }
            if(level.constructor != LoggerLevel) {
                return false;
            }
            return this.level.value >= level.value;
        },

        isTraceable: function() {
            return this.enable(this.TRACE);
        },
        isDebugable: function() {
            return this.enable(this.DEBUG);
        },
        isInfoable: function() {
            return this.enable(this.INFO);
        },
        isWarnable: function() {
            return this.enable(this.WARN);
        },
        isErrorable: function() {
            return this.enable(this.ERROR);
        },
        trace: function(message) {
            if (!this.isTraceable()) {
                return;
            }

            log(this.TRACE, message);
        },
        debug: function(message) {
            if (!this.isDebugable()) {
                return;
            }
            log.call(this, this.DEBUG, message);
        },
        info: function(message) {
            if (!this.isInfoable()) {
                return;
            }

            log.call(this, this.INFO, message);
        },
        warn: function(message, e) {
            if (!this.isWarnable()) {
                return;
            }


            log.call(this, this.WARN, message, e);
        },
        error: function(message, e) {
            if (!this.isErrorable()) {
                return;
            }

            log.call(this, this.ERROR, message, e);
        }
    }

})();

module.exports = Logger;