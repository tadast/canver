/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Colorizer smoothly iterates through all hues
// with maximum saturation automatically.
class Colorizer {
  constructor() {
    this.hue = 0;
    this.saturation = 0;
    this.color = '';
  }

  // Returns the next colour value as a string
  nextColour() {
    if (this.color === '') {
      this.hue++;
      if (this.hue > 360) { this.hue = 0; }
      return 'hsl(' + this.hue + ',100%,50%)';
    } else {
      return this.color;
    }
  }

  setColor(color) {
    return this.color = color;
  }
}