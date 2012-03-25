var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
window.onload = function() {
  var bgSetup, canvas;
  canvas = document.getElementById('canvas');
  bgSetup = document.getElementById('backgroundSetup');
  return bgSetup.addEventListener("touchstart", __bind(function(e) {
    var colorClicked;
    colorClicked = e.target.dataset.color;
    bgSetup.style.display = 'none';
    canvas.style.display = 'block';
    return this.canver = new Canver(canvas, colorClicked);
  }, this));
};
window.onresize = function() {
  return this.canver.resizeCanvas();
};