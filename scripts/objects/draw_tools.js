var DotTool, DrawTool, PencilTool, ToolRegister, WebTool, WetFeather;
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
    this.tools = [DotTool, WetFeather, PencilTool, WebTool];
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
    this.defaultAlpha = 1.0;
    this.ctx.globalAlpha = this.defaultAlpha;
  }
  DrawTool.prototype.init = function() {
    return this.ctx.shadowBlur = 0;
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
  DotTool.prototype.init = function() {
    DotTool.__super__.init.call(this);
    this.spread = 7;
    return this.ctx.shadowBlur = 2;
  };
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
    var i, radius, xOff, yOff, _results;
    _results = [];
    for (i = 0; i <= 5; i++) {
      this.ctx.globalAlpha = Math.random();
      xOff = this.drawRadius * this.spread * (Math.random() - 0.5);
      yOff = this.drawRadius * this.spread * (Math.random() - 0.5);
      radius = this.drawRadius * (Math.random() + 0.5);
      this.ctx.beginPath();
      this.ctx.arc(x + xOff, y + yOff, radius, 0, Math.PI * 2, true);
      this.ctx.closePath();
      _results.push(this.ctx.fill());
    }
    return _results;
  };
  DotTool.prototype.setSize = function(size) {
    return this.drawRadius = size / 2;
  };
  return DotTool;
})();
PencilTool = (function() {
  __extends(PencilTool, DrawTool);
  function PencilTool() {
    PencilTool.__super__.constructor.apply(this, arguments);
  }
  PencilTool.toolName = 'pencil';
  PencilTool.prototype.init = function() {
    PencilTool.__super__.init.call(this);
    return this.touchlog || (this.touchlog = new TouchLog);
  };
  PencilTool.prototype.start = function(e) {
    return this.touchlog.logEvent(e);
  };
  PencilTool.prototype.move = function(e) {
    var endX, endY, log, startX, startY, touch, _i, _len, _ref;
    this.ctx.setLineCap('round');
    this.ctx.setLineJoin('round');
    _ref = e.changedTouches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      log = this.touchlog.forTouch(touch);
      if (!(log && log.previous())) {
        continue;
      }
      this.ctx.lineWidth = this.drawRadius;
      this.ctx.beginPath();
      startX = (log.previous().x + log.current().x) / 2;
      startY = (log.previous().y + log.current().y) / 2;
      this.ctx.moveTo(startX, startY);
      endX = (log.current().x + touch.clientX) / 2;
      endY = (log.current().y + touch.clientY) / 2;
      this.ctx.quadraticCurveTo(log.current().x, log.current().y, endX, endY);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    return this.touchlog.logEvent(e);
  };
  PencilTool.prototype.end = function(e) {
    return true;
  };
  return PencilTool;
})();
WetFeather = (function() {
  __extends(WetFeather, PencilTool);
  function WetFeather() {
    WetFeather.__super__.constructor.apply(this, arguments);
  }
  WetFeather.toolName = 'wetFeather';
  WetFeather.prototype.init = function() {
    WetFeather.__super__.init.call(this);
    this.dribbleLength = 100;
    this.probability = 0.3;
    this.dropFactor = 1.3;
    return this.ctx.shadowBlur = 4;
  };
  WetFeather.prototype.move = function(e) {
    var touch, _i, _len, _ref;
    WetFeather.__super__.move.call(this, e);
    this.ctx.setLineCap('square');
    this.ctx.globalAlpha = Math.random();
    _ref = e.changedTouches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      this.dribble(touch);
    }
    return this.ctx.globalAlpha = this.defaultAlpha;
  };
  WetFeather.prototype.dribble = function(touch) {
    var dropEndY, log, startX, startY;
    log = this.touchlog.forTouch(touch);
    if (!(log && log.previous())) {
      return false;
    }
    if (Math.random() > this.probability) {
      return false;
    }
    this.ctx.lineWidth = this.drawRadius / (this.ctx.globalAlpha * 2 + 1);
    this.ctx.beginPath();
    startX = log.current().x;
    startY = log.current().y;
    dropEndY = startY + Math.random() * (this.dribbleLength + this.drawRadius * 4);
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(startX, dropEndY);
    this.ctx.closePath();
    this.ctx.stroke();
    return this.dropletEnd(startX, dropEndY, this.ctx.lineWidth);
  };
  WetFeather.prototype.dropletEnd = function(x, y, width) {
    var radius;
    this.ctx.beginPath();
    radius = this.dropFactor * width / 2;
    this.ctx.moveTo(x - width / 2, y);
    this.ctx.lineTo(x + width / 2, y);
    this.ctx.lineTo(x + radius, y + radius * 2);
    this.ctx.lineTo(x - radius, y + radius * 2);
    this.ctx.arc(x, y + radius * 2, radius, 0, Math.PI, false);
    this.ctx.closePath();
    return this.ctx.fill();
  };
  return WetFeather;
})();
WebTool = (function() {
  __extends(WebTool, DrawTool);
  function WebTool() {
    WebTool.__super__.constructor.apply(this, arguments);
  }
  WebTool.toolName = 'webTool';
  WebTool.prototype.init = function() {
    WebTool.__super__.init.call(this);
    return this.touchlog || (this.touchlog = new TouchLog);
  };
  WebTool.prototype.start = function(e) {
    return this.touchlog.logEvent(e);
  };
  WebTool.prototype.move = function(e) {
    var coord, log, touch, _i, _j, _len, _len2, _ref, _ref2;
    this.ctx.setLineCap('round');
    this.ctx.setLineJoin('round');
    _ref = e.changedTouches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      log = this.touchlog.forTouch(touch);
      if (!(log && log.length() > 1)) {
        continue;
      }
      this.ctx.lineWidth = 0.1;
      _ref2 = log.all;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        coord = _ref2[_j];
        this.ctx.beginPath();
        this.ctx.moveTo(touch.clientX, touch.clientY);
        this.ctx.lineTo(coord.x, coord.y);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    }
    return this.touchlog.logEvent(e);
  };
  WebTool.prototype.end = function(e) {
    return true;
  };
  WebTool.prototype.setSize = function(size) {
    return this.touchlog.size = size;
  };
  return WebTool;
})();