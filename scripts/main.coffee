unless "ontouchend" of document
  window.location = 'unsupported.html'

window.onload = ->
  canvas = document.getElementById 'canvas'
  bgSetup = document.getElementById 'backgroundSetup'
  menu = document.getElementById 'menu'

  unless window.navigator.standalone
    alert 'Add this app to your Home Screen for better experience.'

  bgSetup.addEventListener "touchstart", (e) =>
    colorClicked = e.target.dataset.color
    bgSetup.style.display = 'none'
    canvas.style.display = 'block'
    @canver = new Canver canvas, menu, colorClicked