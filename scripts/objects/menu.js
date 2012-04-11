var Menu;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Menu = (function() {
  function Menu(element, canver) {
    this.element = element;
    this.canver = canver;
    this.element.style.display = 'block';
    this.element.addEventListener("touchstart", __bind(function(e) {
      e.preventDefault();
      return this.element.style['background-color'] = this.canver.switchColor();
    }, this));
  }
  return Menu;
})();