var Menu;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Menu = (function() {
  function Menu(start, element, canver) {
    this.start = start;
    this.element = element;
    this.canver = canver;
    this.start.style.display = 'block';
    this.activeColor = this.element.getElementsByClassName('color active')[0];
    this.activeSize = this.element.getElementsByClassName('size active')[0];
    this.initColors();
    this.initSizes();
    this.initReset();
    this.element.addEventListener("touchmove", __bind(function(e) {
      return e.preventDefault();
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
        this.activeColor.className = 'color';
        selectedElm.className = 'color active';
        return this.activeColor = selectedElm;
      }, this)));
    }
    return _results;
  };
  Menu.prototype.initSizes = function() {
    var size, sizes, _i, _len, _results;
    sizes = this.element.getElementsByClassName('size');
    _results = [];
    for (_i = 0, _len = sizes.length; _i < _len; _i++) {
      size = sizes[_i];
      _results.push(size.addEventListener("touchstart", __bind(function(e) {
        var selectedElm;
        selectedElm = e.currentTarget;
        size = selectedElm.dataset['size'];
        this.canver.setSize(size);
        this.activeSize.className = 'size';
        selectedElm.className = 'size active';
        return this.activeSize = selectedElm;
      }, this)));
    }
    return _results;
  };
  Menu.prototype.initReset = function() {
    var reset;
    reset = document.getElementById('reset');
    return reset.addEventListener("touchstart", __bind(function(e) {
      if (confirm('Reset all?')) {
        return window.location.reload();
      }
    }, this));
  };
  return Menu;
})();