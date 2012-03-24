(function() {
  var Colorizer, DotTool, DrawTool, Molbert, PencilTool, options;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  options = {
    autoResizeCanvas: true
  };
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
  DrawTool = (function() {
    function DrawTool(canvas, ctx) {
      this.canvas = canvas;
      this.ctx = ctx;
      this.drawRadius = 10;
    }
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
    PencilTool.prototype.start = function(e) {
      var firstTouch;
      firstTouch = e.touches[0];
      return this.ctx.moveTo(firstTouch.clientX, firstTouch.clientY);
    };
    PencilTool.prototype.move = function(e) {
      var touch, _i, _len, _ref;
      _ref = e.changedTouches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        this.ctx.lineTo(touch.clientX, touch.clientY);
      }
      return this.ctx.stroke();
    };
    PencilTool.prototype.end = function(e) {
      return this.ctx.stroke();
    };
    PencilTool.prototype.draw = function(x, y) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.drawRadius, 0, Math.PI * 2, true);
      this.ctx.closePath();
      return this.ctx.fill();
    };
    return PencilTool;
  })();
  Molbert = (function() {
    function Molbert(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
      this.initTouchable();
      this.drawRadius = 10;
      this.ctx.fillStyle = "#fff";
      this.colorizer = new Colorizer;
      this.tool = new DotTool(this.canvas, this.ctx);
    }
    Molbert.prototype.initTouchable = function() {
      var that;
      that = this;
      this.canvas.addEventListener("touchstart", function(e) {
        e.preventDefault();
        return that.tool.start(e);
      });
      this.canvas.addEventListener("touchmove", function(e) {
        e.preventDefault();
        that.setNextColour();
        return that.tool.move(e);
      });
      return this.canvas.addEventListener("touchend", function(e) {
        that.tool.end(e);
        return true;
      });
    };
    Molbert.prototype.setNextColour = function() {
      this.ctx.fillStyle = this.colorizer.nextColour();
      return this.ctx.strokeStyle = this.colorizer.nextColour();
    };
    Molbert.prototype.resizeCanvas = function() {
      this.canvas.width = window.innerWidth;
      return this.canvas.height = window.innerHeight;
    };
    return Molbert;
  })();
  window.onload = function() {
    var canvas;
    canvas = document.getElementById('canvas');
    return this.molbert = new Molbert(canvas);
  };
  if (options.autoResizeCanvas) {
    window.onresize = function() {
      return this.molbert.resizeCanvas();
    };
  }
}).call(this);
