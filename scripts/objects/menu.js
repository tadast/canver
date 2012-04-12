var Menu;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Menu = (function() {
  function Menu(start, element, canver) {
    this.start = start;
    this.element = element;
    this.canver = canver;
    this.start.style.display = 'block';
    this.activeColor = this.element.getElementsByClassName('color active')[0];
    this.initColors();
    this.start.addEventListener("touchstart", __bind(function(e) {
      e.preventDefault();
      return this.start.style['background-color'] = this.canver.switchColor();
    }, this));
  }
  Menu.prototype.initColors = function() {
    var color, colors, _i, _len, _results;
    colors = this.element.getElementsByClassName('color');
    _results = [];
    for (_i = 0, _len = colors.length; _i < _len; _i++) {
      color = colors[_i];
      color.style['background-color'] = color.dataset['color'];
      _results.push(color.addEventListener("touchstart", __bind(function(e) {
        var selectedElm;
        selectedElm = e.currentTarget;
        color = selectedElm.dataset['color'];
        this.canver.setColor(color);
        selectedElm.className = 'color active';
        this.activeColor.className = 'color';
        return this.activeColor = selectedElm;
      }, this)));
    }
    return _results;
  };
  return Menu;
})();