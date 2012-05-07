var TouchLog, TouchLogEntry;
TouchLogEntry = (function() {
  function TouchLogEntry(maxSize) {
    this.maxSize = maxSize != null ? maxSize : 3;
    this.all = [];
  }
  TouchLogEntry.prototype.updateWith = function(newX, newY) {
    var newRecord;
    newRecord = {
      x: newX,
      y: newY
    };
    this.all.unshift(newRecord);
    if (this.length() > this.maxSize) {
      return this.all.pop();
    }
  };
  TouchLogEntry.prototype.current = function() {
    return this.all[0];
  };
  TouchLogEntry.prototype.previous = function() {
    return this.all[1];
  };
  TouchLogEntry.prototype.length = function() {
    return this.all.length;
  };
  TouchLogEntry.prototype.distance = function() {
    var sqDis;
    if (!this.previous()) {
      return 0;
    }
    sqDis = Math.pow(this.previous().x - this.current().x, 2) + Math.pow(this.previous().y - this.current().y, 2);
    return Math.sqrt(sqDis);
  };
  return TouchLogEntry;
})();
TouchLog = (function() {
  function TouchLog(size) {
    if (size == null) {
      size = 3;
    }
    this.size = size;
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
    return (_base = this.log)[touchId] || (_base[touchId] = new TouchLogEntry(this.size));
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