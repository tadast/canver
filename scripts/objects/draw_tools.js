/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// contains info about all available tools
class ToolRegister {
  constructor() {
    this.tools = [DotTool, WetFeather, PencilTool, WebTool];
  }

  // gives a tool class given a tool name
  toolFor(toolName) {
    for (let tool of Array.from(this.tools)) {
      if (tool.toolName === toolName) { return tool; }
    }
    return alert(`Tool ${toolName} not found`);
  }
}

// A base class for drawing tools
// A drawing tool must have three methods:
//   start - is called when a touch event starts
//   move  - is called when a touch moves
//   end   - is called when a touch event ends
class DrawTool {
  static initClass() {
    this.toolName = 'GenericDrawTool';
  }
  static respondsTo(name) {
    return this.toolName === name;
  }

  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.drawRadius = 10;
    this.defaultAlpha = 1.0;
    this.ctx.globalAlpha = this.defaultAlpha;
  }

  init() {
    return this.ctx.shadowBlur = 0;
  }

  setSize(size) {
    return this.drawRadius = size;
  }
}
DrawTool.initClass();

// Dot tool draws bubbles on every event
class DotTool extends DrawTool {
  static initClass() {
    this.toolName = 'dot';
  }

  init() {
    super.init();
    this.spread = 7;
    return this.ctx.shadowBlur = 2;
  }

  start(e) {
    return Array.from(e.touches).map((touch) =>
      this.draw(touch.clientX, touch.clientY));
  }

  move(e) {
    return Array.from(e.changedTouches).map((touch) =>
      this.draw(touch.clientX, touch.clientY));
  }

  end(e) {
    return true;
  }

  draw(x, y) {
    return (() => {
      const result = [];
      for (let i = 0; i <= 5; i++) {
        this.ctx.globalAlpha = Math.random();
        const xOff = this.drawRadius * this.spread * (Math.random() - 0.5);
        const yOff = this.drawRadius * this.spread * (Math.random() - 0.5);
        const radius = this.drawRadius * (Math.random() + 0.5);

        this.ctx.beginPath();
        this.ctx.arc(x + xOff, y + yOff, radius, 0, Math.PI*2, true);
        this.ctx.closePath();
        result.push(this.ctx.fill());
      }
      return result;
    })();
  }

  setSize(size) {
    return this.drawRadius = size / 2;
  }
}
DotTool.initClass();

// Feather tool uses bezier curves to smooth out user input
class PencilTool extends DrawTool {
  static initClass() {
    this.toolName = 'pencil';
  }
  init() {
    super.init();
    return this.touchlog || (this.touchlog = new TouchLog);
  }

  start(e) {
    return this.touchlog.logEvent(e);
  }

  move(e) {
    this.ctx.setLineCap('round');
    this.ctx.setLineJoin('round');
    for (let touch of Array.from(e.changedTouches)) {
      const log = this.touchlog.forTouch(touch);
      if (!log || !log.previous()) { continue; }

      this.ctx.lineWidth = this.drawRadius;
      this.ctx.beginPath();

      // move to midpoint between last and prev points so that bezier curves don't intersect
      const startX = (log.previous().x + log.current().x) / 2;
      const startY = (log.previous().y + log.current().y) / 2;
      this.ctx.moveTo(startX, startY);

      // do the same with the end point
      const endX = (log.current().x + touch.clientX) / 2;
      const endY = (log.current().y + touch.clientY) / 2;
      this.ctx.quadraticCurveTo(log.current().x, log.current().y, endX, endY);

      this.ctx.stroke();
      this.ctx.closePath();
    }
    return this.touchlog.logEvent(e);
  }

  end(e) {
    return true;
  }
}
PencilTool.initClass();

class WetFeather extends PencilTool {
  static initClass() {
    this.toolName = 'wetFeather';
  }
  init() {
    super.init();
    this.dribbleLength = 100;  // how long is a drop
    this.probability = 0.3;   // how likely is it to drip for each touch event?
    this.dropFactor = 1.3;    // how much bigger is the dropplet at the end of the line?
    return this.ctx.shadowBlur = 4;
  }

  move(e) {
    super.move(e);
    this.ctx.setLineCap('square');
    this.ctx.globalAlpha = Math.random();

    for (let touch of Array.from(e.changedTouches)) {
      this.dribble(touch);
    }

    return this.ctx.globalAlpha = this.defaultAlpha;
  }

  dribble(touch) {
    const log = this.touchlog.forTouch(touch);
    if (!log || !log.previous()) { return false; }
    if (Math.random() > this.probability) { return false; }
    this.ctx.lineWidth = this.drawRadius / ((this.ctx.globalAlpha * 2) + 1); // the thicker the more transparent
    this.ctx.beginPath();

    const startX = log.current().x;
    const startY = log.current().y;
    const dropEndY = startY + (Math.random() * (this.dribbleLength + (this.drawRadius * 4)));
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(startX, dropEndY);
    this.ctx.closePath();
    this.ctx.stroke();

    return this.dropletEnd(startX, dropEndY, this.ctx.lineWidth);
  }

  dropletEnd(x, y, width) {
    this.ctx.beginPath();
    const radius = (this.dropFactor * width) / 2;

    // Trapeze
    this.ctx.moveTo(x - (width/2), y);
    this.ctx.lineTo(x + (width/2), y);
    this.ctx.lineTo(x + radius, y + (radius*2));
    this.ctx.lineTo(x - radius, y + (radius*2));

    // half circle
    this.ctx.arc(x, y + (radius*2), radius, 0, Math.PI, false);
    this.ctx.closePath();
    return this.ctx.fill();
  }
}
WetFeather.initClass();

// Registers N last poins and when a new one is added,
// joins them with thin lines drawing web-like structures
class WebTool extends DrawTool {
  static initClass() {
    this.toolName = 'webTool';
  }

  init() {
    super.init();
    return this.touchlog || (this.touchlog = new TouchLog);
  }

  start(e) {
    return this.touchlog.logEvent(e);
  }

  move(e) {
    this.ctx.setLineCap('round');
    this.ctx.setLineJoin('round');
    for (let touch of Array.from(e.changedTouches)) {
      const log = this.touchlog.forTouch(touch);
      if (!log || !(log.length() > 1)) { continue; }
      this.ctx.lineWidth = 0.1;
      for (let coord of Array.from(log.all)) {
        this.ctx.beginPath();
        this.ctx.moveTo(touch.clientX, touch.clientY);
        this.ctx.lineTo(coord.x, coord.y);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    }

    return this.touchlog.logEvent(e);
  }

  end(e) {
    return true;
  }

  setSize(size) {
    return this.touchlog.size = size;
  }
}
WebTool.initClass(); // store more points for the lines to join to