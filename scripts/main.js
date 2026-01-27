/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

window.onload = function() {
  const canvas = document.getElementById('canvas');
  const bgSetup = document.getElementById('backgroundSetup');
  const start = document.getElementById('start');
  const menu = document.getElementById('menu');

  Util.noScrollingOn(bgSetup);
  Util.noScrollingOn(start);
  Util.noScrollingOn(menu);

  if (!window.navigator.standalone) {
    // alert 'Add this app to your Home Screen for better experience.'
    true;
  }

  const initApp = (e) => {
    const colorClicked = e.target.attributes['data-color'].value;
    document.body.style.backgroundColor = colorClicked;
    bgSetup.style.display = 'none';
    this.canver = new Canver(canvas, colorClicked, window.devicePixelRatio);
    return this.menu = new Menu(start, menu, this.canver);
  };

  bgSetup.addEventListener("touchstart", initApp);
  bgSetup.addEventListener("click", initApp);
};