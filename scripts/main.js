var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!("ontouchend" in document || location.search === '?debug=1')) {
  window.location = 'unsupported.html';
}
window.onload = function() {
  var bgSetup, canvas, menu, start;
  canvas = document.getElementById('canvas');
  bgSetup = document.getElementById('backgroundSetup');
  start = document.getElementById('start');
  menu = document.getElementById('menu');
  Util.noScrollingOn(bgSetup);
  Util.noScrollingOn(start);
  Util.noScrollingOn(menu);
  if (!window.navigator.standalone) {
    true;
  }
  return bgSetup.addEventListener("touchstart", __bind(function(e) {
    var colorClicked;
    colorClicked = e.target.dataset.color;
    bgSetup.style.display = 'none';
    this.canver = new Canver(canvas, colorClicked, window.devicePixelRatio);
    return this.menu = new Menu(start, menu, this.canver);
  }, this));
};