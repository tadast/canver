/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

window.onload = function() {
  const canvas = document.getElementById('canvas');
  const bgSetup = document.getElementById('backgroundSetup');
  const leftPanel = document.getElementById('left-panel');
  const rightPanel = document.getElementById('right-panel');

  Util.noScrollingOn(bgSetup);
  Util.noScrollingOn(leftPanel);
  Util.noScrollingOn(rightPanel);

  if (!window.navigator.standalone) {
    true;
  }

  const initApp = (e) => {
    const colorClicked = e.target.attributes['data-color'].value;
    document.body.style.backgroundColor = colorClicked;
    bgSetup.style.display = 'none';
    this.canver = new Canver(canvas, colorClicked, window.devicePixelRatio);
    this.menu = new Menu(leftPanel, rightPanel, this.canver);
    leftPanel.classList.remove('before-bg');
    rightPanel.classList.remove('before-bg');

    const collapsePanelsOnDraw = () => this.menu.onDrawingStart();
    canvas.addEventListener('touchstart', collapsePanelsOnDraw, { passive: true });
    canvas.addEventListener('mousedown', collapsePanelsOnDraw);
  };

  bgSetup.addEventListener("touchstart", initApp);
  bgSetup.addEventListener("click", initApp);
};