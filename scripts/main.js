/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
if (!("ontouchend" in document) && (location.search !== '?debug=1')) {
  window.location = 'unsupported.html';
}

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

  return bgSetup.addEventListener("touchstart", e => {
    const colorClicked = e.target.attributes['data-color'].value;
    bgSetup.style.display = 'none';
    this.canver = new Canver(canvas, colorClicked, window.devicePixelRatio);
    // @canver = new Canver canvas, colorClicked
    return this.menu = new Menu(start, menu, this.canver);
  });
};