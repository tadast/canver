(function() {
  var Molbert, options;
  options = {
    autoResizeCanvas: true
  };
  Molbert = (function() {
    function Molbert(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
      this.initTouchable();
      this.drawRadius = 10;
      this.ctx.fillStyle = "#8ED6FF";
    }
    Molbert.prototype.drawDot = function(x, y) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.drawRadius, 0, Math.PI * 2, true);
      this.ctx.closePath();
      return this.ctx.fill();
    };
    Molbert.prototype.initTouchable = function() {
      var that;
      that = this;
      this.canvas.addEventListener("touchstart", function(e) {
        var touch, _i, _len, _ref;
        e.preventDefault();
        _ref = e.touches;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          touch = _ref[_i];
          that.drawDot(touch.clientX, touch.clientY);
        }
        return true;
      });
      this.canvas.addEventListener("touchmove", function(e) {
        var touch, _i, _len, _ref, _results;
        e.preventDefault();
        _ref = e.changedTouches;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          touch = _ref[_i];
          _results.push(that.drawDot(touch.clientX, touch.clientY));
        }
        return _results;
      });
      return this.canvas.addEventListener("touchend", function(e) {
        return true;
      });
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
