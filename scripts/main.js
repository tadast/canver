window.onload = function() {
  var canvas;
  canvas = document.getElementById('canvas');
  return this.canver = new Canver(canvas);
};
if (options.autoResizeCanvas) {
  window.onresize = function() {
    return this.canver.resizeCanvas();
  };
}