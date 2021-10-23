/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// The main class
class Canver {
  constructor(canvas, bgColor, retinaMultiplier) {
    this.canvas = canvas;
    this.bgColor = bgColor;
    if (retinaMultiplier == null) { retinaMultiplier = 1; }
    this.retinaMultiplier = retinaMultiplier;
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    this.initTouchable();
    this.repaintBackground(this.bgColor);
    this.colorizer = new Colorizer;
    this.ctx.fillStyle = "#fa0";
    this.canvas.style.display = 'block';
  }

  hide() {
    return this.canvas.style.display = 'none';
  }

  show() {
    return this.canvas.style.display = 'block';
  }

  repaintBackground(fillStyle) {
    const fs = this.ctx.fillStyle;
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return this.ctx.fillStyle = fs;
  }

  initTouchable() {
    this.canvas.addEventListener("touchstart", e => {
      e.preventDefault();
      this.applyColor();
      return this.tool.start(e);
    });

    this.canvas.addEventListener("touchmove", e => {
      e.preventDefault();
      this.applyColor();
      return this.tool.move(e);
    });

    return this.canvas.addEventListener("touchend", e => {
      e.preventDefault();
      this.tool.end(e);
      return true;
    });
  }

  applyColor() {
    const colour = this.colorizer.nextColour();
    this.ctx.fillStyle = colour;
    this.ctx.shadowColor = colour;
    return this.ctx.strokeStyle = colour;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth * this.retinaMultiplier;
    return this.canvas.height = window.innerHeight * this.retinaMultiplier;
  }

  setTool(toolName) {
    // TODO set the selected tool size
    if (!this.tr) { this.tr = new ToolRegister; }
    const toolClass = this.tr.toolFor(toolName);
    this.tool = new toolClass(this.canvas, this.ctx);
    return this.tool.init();
  }

  setColor(color) {
    return this.colorizer.setColor(color);
  }

  setSize(size) {
    return this.tool.setSize(size);
  }

  switchSaveMode(imageElm) {
    if (window.navigator.standalone) {
      return alert("iOS does not support image saving in Home Screen mode. You can make a screenshot by holding down Home and Power buttons.");
    } else {
      alert('Tap and hold the image to save. Click menu arrow when finished.');
      imageElm.src = this.canvas.toDataURL();
      return this.hide();
    }
  }
}