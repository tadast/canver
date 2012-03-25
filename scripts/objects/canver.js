var Canver, Colorizer, DotTool, DrawTool, PencilTool, TouchLog, TouchLogEntry;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Colorizer = (function() {
  function Colorizer() {
    this.hue = 0;
    this.saturation = 0;
  }
  Colorizer.prototype.nextColour = function() {
    var fs;
    this.hue++;
    if (this.hue > 360) {
      this.hue = 0;
    }
    return fs = 'hsl(' + this.hue + ',100%,50%)';
  };
  return Colorizer;
})();
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
DrawTool = (function() {
  function DrawTool(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawRadius = 10;
  }
  DrawTool.prototype.setRadius = function(radius) {
    return this.drawRadius = radius;
  };
  return DrawTool;
})();
DotTool = (function() {
  __extends(DotTool, DrawTool);
  function DotTool() {
    DotTool.__super__.constructor.apply(this, arguments);
  }
  DotTool.prototype.start = function(e) {
    var touch, _i, _len, _ref, _results;
    _ref = e.touches;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      _results.push(this.draw(touch.clientX, touch.clientY));
    }
    return _results;
  };
  DotTool.prototype.move = function(e) {
    var touch, _i, _len, _ref, _results;
    _ref = e.changedTouches;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      _results.push(this.draw(touch.clientX, touch.clientY));
    }
    return _results;
  };
  DotTool.prototype.end = function(e) {
    return true;
  };
  DotTool.prototype.draw = function(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.drawRadius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    return this.ctx.fill();
  };
  return DotTool;
})();
PencilTool = (function() {
  __extends(PencilTool, DrawTool);
  function PencilTool() {
    PencilTool.__super__.constructor.apply(this, arguments);
  }
  PencilTool.prototype.init = function() {
    this.touchlog || (this.touchlog = new TouchLog);
    this.ctx.setLineJoin('round');
    return this.ctx.setLineCap('round');
  };
  PencilTool.prototype.start = function(e) {
    return this.touchlog.logEvent(e);
  };
  PencilTool.prototype.move = function(e) {
    var previous, touch, _i, _len, _ref, _results;
    this.touchlog.logEvent(e);
    _ref = e.changedTouches;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      previous = this.touchlog.forTouch(touch).previous;
      this.ctx.beginPath();
      this.ctx.lineWidth = this.drawRadius;
      this.ctx.moveTo(previous.x, previous.y);
      this.ctx.lineTo(touch.clientX, touch.clientY);
      this.ctx.stroke();
      _results.push(this.ctx.closePath());
    }
    return _results;
  };
  PencilTool.prototype.end = function(e) {};
  return PencilTool;
})();
Canver = (function() {
  function Canver(canvas, bgColor) {
    this.canvas = canvas;
    this.bgColor = bgColor;
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    this.initTouchable();
    this.repaintBackground(this.bgColor);
    this.drawRadius = 10;
    this.colorizer = new Colorizer;
    this.tool = new PencilTool(this.canvas, this.ctx);
    this.tool.init();
    this.ctx.fillStyle = "#fa0";
  }
  Canver.prototype.repaintBackground = function(fillStyle) {
    var fs;
    fs = this.ctx.fillStyle;
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return this.ctx.fillStyle = fs;
  };
  Canver.prototype.initTouchable = function() {
    this.canvas.addEventListener("touchstart", __bind(function(e) {
      e.preventDefault();
      return this.tool.start(e);
    }, this));
    this.canvas.addEventListener("touchmove", __bind(function(e) {
      e.preventDefault();
      this.setNextColour();
      return this.tool.move(e);
    }, this));
    return this.canvas.addEventListener("touchend", __bind(function(e) {
      this.tool.end(e);
      return true;
    }, this));
  };
  Canver.prototype.setNextColour = function() {
    this.ctx.fillStyle = this.colorizer.nextColour();
    return this.ctx.strokeStyle = this.colorizer.nextColour();
  };
  Canver.prototype.resizeCanvas = function() {
    this.canvas.width = window.innerWidth;
    return this.canvas.height = window.innerHeight;
  };
  return Canver;
})();