/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Menu {
  constructor(leftPanel, rightPanel, canver) {
    this.leftPanel = leftPanel;
    this.rightPanel = rightPanel;
    this.canver = canver;
    this.initSizes();
    this.initColors();
    this.initTools();
    this.initSave();
    this.initReset();
    this.initUndoRedo();
    this.initPanelHandlers();
  }

  addInputListener(element, handler) {
    element.addEventListener("touchstart", handler);
    element.addEventListener("click", handler);
  }

  initColors() {
    this.activeColor = this.rightPanel.getElementsByClassName('color active')[0];
    const colors = this.rightPanel.getElementsByClassName('color');
    for (const colorEl of Array.from(colors)) {
      const dc = colorEl.attributes['data-color'];
      if (dc && dc.value) colorEl.style['background-color'] = dc.value;
      this.addInputListener(colorEl, e => {
        const selectedElm = e.currentTarget;
        const color = selectedElm.attributes['data-color'].value;
        this.canver.setColor(color);
        this.activeColor.className = 'color';
        selectedElm.className = 'color active';
        this.activeColor = selectedElm;
      });
    }
    const customColorInput = document.getElementById('custom-color');
    if (customColorInput) {
      customColorInput.addEventListener('input', e => {
        const color = e.target.value;
        this.canver.setColor(color);
        this.activeColor.className = 'color';
        this.activeColor = null;
      });
    }
  }

  initSizes() {
    this.activeSize = this.leftPanel.getElementsByClassName('size active')[0];
    const sizes = this.leftPanel.getElementsByClassName('size');
    Array.from(sizes).map((size) =>
      this.addInputListener(size, e => {
        const selectedElm = e.currentTarget;
        const sizeVal = selectedElm.attributes['data-size'].value;
        this.canver.setSize(sizeVal);
        this.activeSize.className = 'size';
        selectedElm.className = 'size active';
        this.activeSize = selectedElm;
      }));
  }

  initTools() {
    this.activeTool = this.leftPanel.getElementsByClassName('tool active')[0];
    this.canver.setTool(this.activeTool.attributes['data-toolname'].value);
    const tools = this.leftPanel.getElementsByClassName('tool');
    Array.from(tools).map((tool) =>
      this.addInputListener(tool, e => {
        const selectedElm = e.currentTarget;
        const toolName = selectedElm.attributes['data-toolname'].value;
        this.canver.setTool(toolName);
        this.canver.setSize(this.activeSize.attributes['data-size'].value);
        this.activeTool.className = 'tool';
        selectedElm.className = 'tool active';
        this.activeTool = selectedElm;
      }));
  }

  initReset() {
    const reset = document.getElementById('reset');
    return this.addInputListener(reset, e => {
      if (confirm('Reset all?')) {
        return window.location.reload();
      }
    });
  }

  initUndoRedo() {
    const undo = document.getElementById('undo');
    const redo = document.getElementById('redo');
    if (undo) this.addInputListener(undo, e => { e.preventDefault(); this.canver.undo(); });
    if (redo) this.addInputListener(redo, e => { e.preventDefault(); this.canver.redo(); });
  }

  initPanelHandlers() {
    const leftHandler = document.getElementById('left-handler');
    const rightHandler = document.getElementById('right-handler');
    if (leftHandler) {
      this.addInputListener(leftHandler, e => {
        e.preventDefault();
        this.leftPanel.classList.add('open');
        this.leftPanel.classList.remove('collapsed');
        if (this.canver.canvas.style.display === 'none') this.canver.show();
      });
    }
    if (rightHandler) {
      this.addInputListener(rightHandler, e => {
        e.preventDefault();
        this.rightPanel.classList.add('open');
        this.rightPanel.classList.remove('collapsed');
      });
    }
  }

  onDrawingStart() {
    this.leftPanel.classList.remove('open');
    this.leftPanel.classList.add('collapsed');
    this.rightPanel.classList.remove('open');
    this.rightPanel.classList.add('collapsed');
  }

  initSave() {
    const saverElm = document.getElementById('saving');
    const imgElement = document.getElementById('saveImage');
    Util.noScrollingOn(imgElement);
    return this.addInputListener(saverElm, e => {
      this.onDrawingStart();
      return this.canver.switchSaveMode(imgElement);
    });
  }
}
