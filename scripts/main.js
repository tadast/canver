(function() {
  var Molbert, options;
  options = {
    autoResizeCanvas: true
  };
  Molbert = (function() {
    function Molbert(canvas) {
      this.canvas = canvas;
      this.resizeCanvas();
    }
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
