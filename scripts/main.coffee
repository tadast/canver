window.onload = ->
  canvas = document.getElementById('canvas');
  bgSetup = document.getElementById('backgroundSetup');
  menu = document.getElementById('menu');
  
  bgSetup.addEventListener "touchstart", (e) =>
    colorClicked = e.target.dataset.color
    bgSetup.style.display = 'none'
    canvas.style.display = 'block'
    @canver = new Canver canvas, menu, colorClicked
    
window.onresize = ->
  @canver.resizeCanvas()