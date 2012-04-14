var Canver;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
    this.canvas.style.display = 'block';
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
  Canver.prototype.setColor = function(color) {
    return this.colorizer.setColor(color);
  };
  Canver.prototype.setSize = function(size) {
    return this.tool.setSize(size);
  };
  return Canver;
})();