var DotTool, DrawTool, FeatherTool, FingerTool, ToolRegister;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
ToolRegister = (function() {
  function ToolRegister() {
    this.tools = [DotTool, FingerTool, FeatherTool];
  }
  ToolRegister.prototype.toolFor = function(toolName) {
    var tool, _i, _len, _ref;
    _ref = this.tools;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tool = _ref[_i];
      if (tool.toolName === toolName) {
        return tool;
      }
    }
    return alert("Tool " + toolName + " not found");
  };
  return ToolRegister;
})();
DrawTool = (function() {
  DrawTool.toolName = 'GenericDrawTool';
  DrawTool.respondsTo = function(name) {
    return this.toolName === name;
  };
  function DrawTool(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawRadius = 10;
  }
  DrawTool.prototype.init = function() {
    return true;
  };
  DrawTool.prototype.setSize = function(size) {
    return this.drawRadius = size;
  };
  return DrawTool;
})();
DotTool = (function() {
  __extends(DotTool, DrawTool);
  function DotTool() {
    DotTool.__super__.constructor.apply(this, arguments);
  }
  DotTool.toolName = 'dot';
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
FingerTool = (function() {
  __extends(FingerTool, DrawTool);
  function FingerTool() {
    FingerTool.__super__.constructor.apply(this, arguments);
  }
  FingerTool.toolName = 'finger';
  FingerTool.prototype.init = function() {
    this.touchlog || (this.touchlog = new TouchLog);
    this.ctx.setLineJoin('round');
    return this.ctx.setLineCap('round');
  };
  FingerTool.prototype.start = function(e) {
    return this.touchlog.logEvent(e);
  };
  FingerTool.prototype.move = function(e) {
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
  FingerTool.prototype.end = function(e) {
    return true;
  };
  return FingerTool;
})();
FeatherTool = (function() {
  __extends(FeatherTool, DrawTool);
  function FeatherTool() {
    FeatherTool.__super__.constructor.apply(this, arguments);
  }
  FeatherTool.toolName = 'feather';
  FeatherTool.prototype.init = function() {
    this.touchlog || (this.touchlog = new TouchLog);
    this.ctx.setLineJoin('round');
    return this.ctx.setLineCap('round');
  };
  FeatherTool.prototype.start = function(e) {
    return this.touchlog.logEvent(e);
  };
  FeatherTool.prototype.move = function(e) {
    var distance, log, previous, touch, _i, _len, _ref, _results;
    this.touchlog.logEvent(e);
    _ref = e.changedTouches;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      log = this.touchlog.forTouch(touch);
      distance = log.distance();
      previous = log.previous;
      this.ctx.beginPath();
      this.ctx.lineWidth = distance / 40.0 * this.drawRadius;
      this.ctx.moveTo(previous.x, previous.y);
      this.ctx.lineTo(touch.clientX, touch.clientY);
      this.ctx.stroke();
      _results.push(this.ctx.closePath());
    }
    return _results;
  };
  FeatherTool.prototype.end = function(e) {
    return true;
  };
  return FeatherTool;
})();