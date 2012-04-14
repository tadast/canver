var TouchLog, TouchLogEntry;
TouchLogEntry = (function() {
  function TouchLogEntry() {}
  TouchLogEntry.prototype.updateWith = function(newX, newY) {
    this.previous = this.current;
    return this.current = {
      x: newX,
      y: newY
    };
  };
  return TouchLogEntry;
})();
TouchLog = (function() {
  function TouchLog() {
    this.log = {};
  }
  TouchLog.prototype.forTouch = function(touch) {
    return this.log[touch.identifier];
  };
  TouchLog.prototype.logEvent = function(e) {
    var entry, touch, _i, _len, _ref, _results;
    _ref = e.touches;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      entry = this.findOrNew(touch.identifier);
      _results.push(entry.updateWith(touch.clientX, touch.clientY));
    }
    return _results;
  };
  TouchLog.prototype.findOrNew = function(touchId) {
    var _base;
    return (_base = this.log)[touchId] || (_base[touchId] = new TouchLogEntry);
  };
  TouchLog.prototype.clear = function(touchId) {
    return delete this.log[touchId];
  };
  TouchLog.prototype.clearFromEvent = function(event) {
    var touch, _i, _len, _ref, _results;
    _ref = event.touches;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      _results.push(this.clear(touch.identifier));
    }
    return _results;
  };
  return TouchLog;
})();