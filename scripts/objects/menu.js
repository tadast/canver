/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Menu {
  constructor(start, element, canver) {
    this.start = start;
    this.element = element;
    this.canver = canver;
    this.initSizes();
    this.initColors();
    this.initTools();

    this.initSave();
    this.initReset();

    this.initSwitch(); // betveen draw and save modes
  }

  initColors() {
    this.activeColor = this.element.getElementsByClassName('color active')[0];
    const colors = this.element.getElementsByClassName('color');
    return (() => {
      const result = [];
      for (var color of Array.from(colors)) {
        color.style['background-color'] = color.attributes['data-color'].value;
        result.push(color.addEventListener("touchstart", e => {
          const selectedElm = e.currentTarget;
          color = selectedElm.attributes['data-color'].value;
          this.canver.setColor(color);

          this.activeColor.className = 'color';
          selectedElm.className = 'color active';
          return this.activeColor = selectedElm;
        }));
      }
      return result;
    })();
  }

  initSizes() {
    this.activeSize = this.element.getElementsByClassName('size active')[0];
    const sizes = this.element.getElementsByClassName('size');
    return Array.from(sizes).map((size) =>
      size.addEventListener("touchstart", e => {
        const selectedElm = e.currentTarget;
        size = selectedElm.attributes['data-size'].value;
        this.canver.setSize(size);

        this.activeSize.className = 'size';
        selectedElm.className = 'size active';
        return this.activeSize = selectedElm;
      }));
  }

  initTools() {
    this.activeTool = this.element.getElementsByClassName('tool active')[0];
    this.canver.setTool(this.activeTool.attributes['data-toolname'].value);
    const tools = this.element.getElementsByClassName('tool');
    return Array.from(tools).map((tool) =>
      tool.addEventListener("touchstart", e => {
        const selectedElm = e.currentTarget;
        const toolName = selectedElm.attributes['data-toolname'].value;
        this.canver.setTool(toolName);
        this.canver.setSize(this.activeSize.attributes['data-size'].value);

        this.activeTool.className = 'tool';
        selectedElm.className = 'tool active';
        return this.activeTool = selectedElm;
      }));
  }


  initReset() {
    const reset = document.getElementById('reset');
    return reset.addEventListener("touchstart", e => {
      if (confirm('Reset all?')) {
        return window.location.reload();
      }
    });
  }

  initSwitch() {
    this.start.style.display = 'block';
    return this.start.addEventListener("touchstart", e => {
      e.preventDefault();
      return this.toggleHide();
    });
  }

  toggleHide() {
    if (this.element.className === 'hidden') {
      this.element.className = '';
      this.start.className = 'down';
      return this.canver.show(); //that's how we come back from save mode
    } else {
      this.element.className = 'hidden';
      return this.start.className = 'up';
    }
  }


  initSave() {
    const saverElm = document.getElementById('saving');
    const imgElement = document.getElementById('saveImage');
    Util.noScrollingOn(imgElement);
    return saverElm.addEventListener("touchstart", e => {
      this.toggleHide();
      return this.canver.switchSaveMode(imgElement);
    });
  }
}