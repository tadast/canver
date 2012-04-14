var Colorizer;
Colorizer = (function() {
  function Colorizer() {
    this.hue = 0;
    this.saturation = 0;
    this.color = '';
  }
  Colorizer.prototype.nextColour = function() {
    if (this.color === '') {
      this.hue++;
      if (this.hue > 360) {
        this.hue = 0;
      }
      return 'hsl(' + this.hue + ',100%,50%)';
    } else {
      return this.color;
    }
  };
  Colorizer.prototype.setColor = function(color) {
    return this.color = color;
  };
  return Colorizer;
})();