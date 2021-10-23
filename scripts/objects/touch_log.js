/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class TouchLogEntry {
  constructor(maxSize) {
    if (maxSize == null) { maxSize = 3; }
    this.maxSize = maxSize;
    this.all = []; // order: [newest....oldest]
  }

  updateWith(newX, newY) {
    const newRecord = {
      x: newX,
      y: newY
    };
    this.all.unshift(newRecord);
    if (this.length() > this.maxSize) { return this.all.pop(); }
  }

  current() {
    return this.all[0];
  }

  previous() {
    return this.all[1];
  }

  length() {
    return this.all.length;
  }

  // distance between current and previous points
  distance() {
    if (!this.previous()) { return 0; }
    const sqDis = Math.pow(this.previous().x - this.current().x, 2) + Math.pow(this.previous().y - this.current().y, 2);
    return Math.sqrt(sqDis);
  }
}

class TouchLog {
  constructor(size) {
    if (size == null) { size = 3; }
    this.size = size; // how many records should TouchLogEntry store
    this.log = {};
  }

  forTouch(touch) {
    return this.log[touch.identifier];
  }

  logEvent(e) {
    return (() => {
      const result = [];
      for (let touch of Array.from(e.touches)) {
        const entry = this.findOrNew(touch.identifier);
        result.push(entry.updateWith(touch.clientX, touch.clientY));
      }
      return result;
    })();
  }

  findOrNew(touchId) {
    return this.log[touchId] || (this.log[touchId] = new TouchLogEntry(this.size));
  }

  clear(touchId) {
    return delete this.log[touchId];
  }

  clearFromEvent(event) {
    return Array.from(event.touches).map((touch) =>
      this.clear(touch.identifier));
  }
}