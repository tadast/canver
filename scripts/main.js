var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!("ontouchend" in document)) {
  window.location = 'unsupported.html';
}
window.onload = function() {
  var bgSetup, canvas, menu;
  canvas = document.getElementById('canvas');
  bgSetup = document.getElementById('backgroundSetup');
  menu = document.getElementById('menu');
  if (!window.navigator.standalone) {
    alert('Add this app to your Home Screen for better experience.');
  }
  return bgSetup.addEventListener("touchstart", __bind(function(e) {
    var colorClicked;
    colorClicked = e.target.dataset.color;
    bgSetup.style.display = 'none';
    canvas.style.display = 'block';
    return this.canver = new Canver(canvas, menu, colorClicked);
  }, this));
};