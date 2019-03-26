var events = require('events');

var Event = (function () {
    var eventEngin = new events.EventEmitter();

    var _on = function (type, handler) {
        eventEngin.on(type, handler);
    };
    var _emit = function(type, params) {
        eventEngin.emit(type, params);
    };
    return {
        on: _on,
        emit: _emit
    }
})();

module.exports = Event;