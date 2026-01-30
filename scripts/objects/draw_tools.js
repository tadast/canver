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
    this.tools = [DotTool, PencilTool, WebTool];
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

  start(e, options) {
    if (options) {
      this._strokeColor = options.color;
      this._strokeSize = options.size;
      this._strokeDots = [];
    }
    return Array.from(e.touches).map((touch) =>
      this.draw(touch.clientX, touch.clientY));
  }

  move(e) {
    return Array.from(e.changedTouches).map((touch) =>
      this.draw(touch.clientX, touch.clientY));
  }

  end(e) {
    if (!this._strokeDots || this._strokeDots.length === 0) { return []; }
    const stroke = { tool: 'dot', color: this._strokeColor, size: this._strokeSize, dots: this._strokeDots };
    this._strokeDots = [];
    return [stroke];
  }

  draw(x, y) {
    for (let i = 0; i <= 5; i++) {
      const alpha = Math.random();
      const xOff = this.drawRadius * this.spread * (Math.random() - 0.5);
      const yOff = this.drawRadius * this.spread * (Math.random() - 0.5);
      const radius = this.drawRadius * (Math.random() + 0.5);
      const cx = x + xOff;
      const cy = y + yOff;
      if (this._strokeDots) { this._strokeDots.push({ cx, cy, radius, alpha, color: this.ctx.fillStyle }); }
      this.ctx.globalAlpha = alpha;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI*2, true);
      this.ctx.closePath();
      this.ctx.fill();
    }
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

  start(e, options) {
    if (options) {
      this._strokeColor = options.color;
      this._strokeSize = options.size;
      this._pointsByTouchId = {};
    }
    this.touchlog.logEvent(e);
    for (let touch of Array.from(e.touches)) {
      const pt = { x: touch.clientX, y: touch.clientY };
      if (options && options.color) pt.color = options.color;
      this._pointsByTouchId[touch.identifier] = [pt];
    }
  }

  move(e, options) {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    for (let touch of Array.from(e.changedTouches)) {
      const log = this.touchlog.forTouch(touch);
      if (!log || !log.previous()) { continue; }

      this.ctx.lineWidth = this.drawRadius;
      this.ctx.beginPath();

      const startX = (log.previous().x + log.current().x) / 2;
      const startY = (log.previous().y + log.current().y) / 2;
      this.ctx.moveTo(startX, startY);

      const endX = (log.current().x + touch.clientX) / 2;
      const endY = (log.current().y + touch.clientY) / 2;
      this.ctx.quadraticCurveTo(log.current().x, log.current().y, endX, endY);

      this.ctx.stroke();
      this.ctx.closePath();

      const pts = this._pointsByTouchId[touch.identifier];
      if (pts) {
        const pt = { x: touch.clientX, y: touch.clientY };
        if (options && options.color) pt.color = options.color;
        pts.push(pt);
      }
    }
    return this.touchlog.logEvent(e);
  }

  end(e) {
    const strokes = [];
    for (let touch of Array.from(e.changedTouches)) {
      const points = this._pointsByTouchId && this._pointsByTouchId[touch.identifier];
      this.touchlog.clear(touch.identifier);
      if (this._pointsByTouchId) delete this._pointsByTouchId[touch.identifier];
      if (!points || points.length < 2) { continue; }
      strokes.push({ tool: 'pencil', color: this._strokeColor, size: this._strokeSize, points });
    }
    return strokes;
  }
}
PencilTool.initClass();

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

  start(e, options) {
    if (options) {
      this._strokeColor = options.color;
      this._strokeSize = options.size;
      this._pointsByTouchId = {};
    }
    this.touchlog.logEvent(e);
    for (let touch of Array.from(e.touches)) {
      const pt = { x: touch.clientX, y: touch.clientY };
      if (options && options.color) pt.color = options.color;
      this._pointsByTouchId[touch.identifier] = [pt];
    }
  }

  move(e, options) {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
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
      const pts = this._pointsByTouchId[touch.identifier];
      if (pts) {
        const pt = { x: touch.clientX, y: touch.clientY };
        if (options && options.color) pt.color = options.color;
        pts.push(pt);
      }
    }

    return this.touchlog.logEvent(e);
  }

  end(e) {
    const strokes = [];
    for (let touch of Array.from(e.changedTouches)) {
      const points = this._pointsByTouchId && this._pointsByTouchId[touch.identifier];
      this.touchlog.clear(touch.identifier);
      if (this._pointsByTouchId) delete this._pointsByTouchId[touch.identifier];
      if (!points || points.length < 2) { continue; }
      strokes.push({ tool: 'webTool', color: this._strokeColor, size: this._strokeSize, points });
    }
    return strokes;
  }

  setSize(size) {
    return this.touchlog.size = size;
  }
}
WebTool.initClass();

function drawStroke(ctx, stroke) {
  ctx.fillStyle = stroke.color;
  ctx.strokeStyle = stroke.color;
  ctx.shadowColor = stroke.color;
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  if (stroke.tool === 'dot') {
    ctx.shadowBlur = 2;
    for (let d of stroke.dots) {
      ctx.fillStyle = d.color || stroke.color;
      ctx.strokeStyle = d.color || stroke.color;
      ctx.shadowColor = d.color || stroke.color;
      ctx.globalAlpha = d.alpha;
      ctx.beginPath();
      ctx.arc(d.cx, d.cy, d.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    return;
  }

  if (stroke.tool === 'pencil') {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = stroke.size;
    const pts = stroke.points;
    if (pts.length < 2) { return; }
    for (let i = 1; i < pts.length; i++) {
      const segColor = pts[i].color || stroke.color;
      ctx.strokeStyle = segColor;
      ctx.shadowColor = segColor;
      const startX = i > 1 ? (pts[i - 2].x + pts[i - 1].x) / 2 : pts[0].x;
      const startY = i > 1 ? (pts[i - 2].y + pts[i - 1].y) / 2 : pts[0].y;
      const endX = (pts[i - 1].x + pts[i].x) / 2;
      const endY = (pts[i - 1].y + pts[i].y) / 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, endX, endY);
      ctx.stroke();
      ctx.closePath();
    }
    return;
  }

  if (stroke.tool === 'webTool') {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 0.1;
    const pts = stroke.points;
    const size = stroke.size;
    for (let i = 1; i < pts.length; i++) {
      const segColor = pts[i].color || stroke.color;
      ctx.strokeStyle = segColor;
      ctx.shadowColor = segColor;
      for (let j = 0; j < Math.min(i, size); j++) {
        const coord = pts[i - 1 - j];
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(coord.x, coord.y);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
}