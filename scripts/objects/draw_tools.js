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
    this.tools = [DotTool, PencilTool, WebTool, FillTool];
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

function canvasPixelCoords(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: Math.floor((clientX - rect.left) * scaleX),
    y: Math.floor((clientY - rect.top) * scaleY)
  };
}

function colorMatch(a, b, tolerance) {
  if (tolerance == null) tolerance = 32;
  return Math.abs(a[0] - b[0]) <= tolerance &&
    Math.abs(a[1] - b[1]) <= tolerance &&
    Math.abs(a[2] - b[2]) <= tolerance &&
    Math.abs(a[3] - b[3]) <= 64;
}

function hslToRgb(h, s, l) {
  h = h % 360 / 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 255];
}

function parseFillColor(colorStr) {
  if (!colorStr || colorStr === '') return null;
  const hex = colorStr.replace(/^#/, '');
  if (hex.length === 3) {
    return [
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
      255
    ];
  }
  if (hex.length === 6) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
      255
    ];
  }
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = colorStr;
  const c = ctx.fillStyle;
  const m = c.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (m) return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10), m[4] != null ? Math.round(parseFloat(m[4]) * 255) : 255];
  return null;
}

class FillTool extends DrawTool {
  static initClass() {
    this.toolName = 'fill';
  }

  start(e, options) {
    this._pendingFillStroke = null;
    const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
    if (!touch) return;
    const { x: px, y: py } = canvasPixelCoords(this.canvas, touch.clientX, touch.clientY);
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (px < 0 || px >= w || py < 0 || py >= h) return;
    const imageData = this.ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const seedIdx = (py * w + px) * 4;
    const seedColor = [data[seedIdx], data[seedIdx + 1], data[seedIdx + 2], data[seedIdx + 3]];
    const isRainbow = options.selectedColor === '' || (options.color !== undefined && options.color === '');
    const fillColor = isRainbow ? null : parseFillColor(options.color);
    if (!isRainbow && !fillColor) return;
    const stack = [[px, py]];
    const filled = new Uint8Array(w * h);
    filled[py * w + px] = 1;
    let minX = px, maxX = px, minY = py, maxY = py;
    const rainbowPixels = isRainbow ? [] : null;
    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const idx = (y * w + x) * 4;
      if (isRainbow) {
        rainbowPixels.push([x, y]);
      } else {
        data[idx] = fillColor[0];
        data[idx + 1] = fillColor[1];
        data[idx + 2] = fillColor[2];
        data[idx + 3] = fillColor[3];
      }
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        if (filled[ny * w + nx]) continue;
        const nidx = (ny * w + nx) * 4;
        const nc = [data[nidx], data[nidx + 1], data[nidx + 2], data[nidx + 3]];
        if (!colorMatch(seedColor, nc)) continue;
        filled[ny * w + nx] = 1;
        stack.push([nx, ny]);
      }
    }
    if (isRainbow && rainbowPixels.length > 0) {
      const rw = maxX - minX + 1;
      const rh = maxY - minY + 1;
      for (const [x, y] of rainbowPixels) {
        const t = (x - minX) / rw * 0.5 + (y - minY) / rh * 0.5;
        const hue = (t * 360) % 360;
        const rgb = hslToRgb(hue, 1, 0.5);
        const idx = (y * w + x) * 4;
        data[idx] = rgb[0];
        data[idx + 1] = rgb[1];
        data[idx + 2] = rgb[2];
        data[idx + 3] = 255;
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
    const rw = maxX - minX + 1;
    const rh = maxY - minY + 1;
    const regionData = this.ctx.getImageData(minX, minY, rw, rh);
    this._pendingFillStroke = {
      tool: 'fill',
      x: minX,
      y: minY,
      width: rw,
      height: rh,
      data: new Uint8ClampedArray(regionData.data)
    };
  }

  move(e) {}

  end(e) {
    const stroke = this._pendingFillStroke;
    this._pendingFillStroke = null;
    return stroke ? [stroke] : [];
  }
}
FillTool.initClass();

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
    return;
  }

  if (stroke.tool === 'fill') {
    const imageData = ctx.createImageData(stroke.width, stroke.height);
    imageData.data.set(stroke.data);
    ctx.putImageData(imageData, stroke.x, stroke.y);
  }
}