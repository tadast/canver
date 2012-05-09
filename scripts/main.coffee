unless "ontouchend" of document || location.search == '?debug=1'
  window.location = 'unsupported.html'

window.onload = ->
  canvas = document.getElementById 'canvas'
  bgSetup = document.getElementById 'backgroundSetup'
  start = document.getElementById 'start'
  menu = document.getElementById 'menu'

  Util.noScrollingOn bgSetup
  Util.noScrollingOn start
  Util.noScrollingOn menu

  unless window.navigator.standalone
    # alert 'Add this app to your Home Screen for better experience.'
    true

  bgSetup.addEventListener "touchstart", (e) =>
    colorClicked = e.target.attributes['data-color'].value
    bgSetup.style.display = 'none'
    @canver = new Canver canvas, colorClicked, window.devicePixelRatio
    # @canver = new Canver canvas, colorClicked
    @menu = new Menu start, menu, @canver