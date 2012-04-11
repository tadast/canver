var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
window.onload = function() {
  var bgSetup, canvas, menu;
  if (!(__indexOf.call(document.documentElement, "ontouchstart") >= 0)) {
    return window.location = 'unsupported.html';
  } else {
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
  }
};