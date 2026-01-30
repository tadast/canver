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
    this.strokes = [];
    this.redoStack = [];
    this.currentSize = 10;
    this.resizeCanvas();
    this.initInputHandlers();
    this.colorizer = new Colorizer;
    this.ctx.fillStyle = "#fa0";
    this.canvas.style.display = 'block';
    this.isMouseDown = false;
    this.render();
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

  render() {
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1;
    this.repaintBackground(this.bgColor);
    for (const stroke of this.strokes) {
      drawStroke(this.ctx, stroke);
    }
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1;
  }

  undo() {
    if (this.strokes.length === 0) return;
    this.redoStack.push(this.strokes.pop());
    this.render();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.strokes.push(this.redoStack.pop());
    this.render();
  }

  mouseEventToTouchEvent(mouseEvent) {
    const touch = {
      identifier: 'mouse',
      clientX: mouseEvent.clientX,
      clientY: mouseEvent.clientY
    };
    return {
      touches: [touch],
      changedTouches: [touch],
      preventDefault: () => mouseEvent.preventDefault()
    };
  }

  initInputHandlers() {
    const strokeOptions = () => ({
      color: this.colorizer.nextColour(),
      size: this.currentSize != null ? this.currentSize : 10
    });

    const addStrokesFromEnd = (result) => {
      if (Array.isArray(result)) {
        result.forEach(s => this.strokes.push(s));
      } else if (result) {
        this.strokes.push(result);
      }
      this.redoStack = [];
      this.render();
    };

    this.canvas.addEventListener("touchstart", e => {
      e.preventDefault();
      const opts = strokeOptions();
      this.ctx.fillStyle = opts.color;
      this.ctx.strokeStyle = opts.color;
      this.ctx.shadowColor = opts.color;
      return this.tool.start(e, opts);
    });

    this.canvas.addEventListener("touchmove", e => {
      e.preventDefault();
      const color = this.applyColor();
      return this.tool.move(e, { color });
    });

    this.canvas.addEventListener("touchend", e => {
      e.preventDefault();
      const result = this.tool.end(e);
      addStrokesFromEnd(result);
    });

    this.canvas.addEventListener("mousedown", e => {
      e.preventDefault();
      this.isMouseDown = true;
      const opts = strokeOptions();
      this.ctx.fillStyle = opts.color;
      this.ctx.strokeStyle = opts.color;
      this.ctx.shadowColor = opts.color;
      return this.tool.start(this.mouseEventToTouchEvent(e), opts);
    });

    this.canvas.addEventListener("mousemove", e => {
      if (!this.isMouseDown) return;
      e.preventDefault();
      const color = this.applyColor();
      return this.tool.move(this.mouseEventToTouchEvent(e), { color });
    });

    this.canvas.addEventListener("mouseup", e => {
      e.preventDefault();
      this.isMouseDown = false;
      const result = this.tool.end(this.mouseEventToTouchEvent(e));
      addStrokesFromEnd(result);
    });

    return this.canvas.addEventListener("mouseleave", e => {
      if (!this.isMouseDown) return;
      this.isMouseDown = false;
      const result = this.tool.end(this.mouseEventToTouchEvent(e));
      addStrokesFromEnd(result);
    });
  }

  applyColor() {
    const colour = this.colorizer.nextColour();
    this.ctx.fillStyle = colour;
    this.ctx.shadowColor = colour;
    this.ctx.strokeStyle = colour;
    return colour;
  }

  resizeCanvas() {
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    this.canvas.style.width = displayWidth + 'px';
    this.canvas.style.height = displayHeight + 'px';

    this.canvas.width = displayWidth * this.retinaMultiplier;
    this.canvas.height = displayHeight * this.retinaMultiplier;

    this.ctx.setTransform(this.retinaMultiplier, 0, 0, this.retinaMultiplier, 0, 0);

    if (this.strokes) this.render();
    return true;
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
    this.currentSize = size;
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