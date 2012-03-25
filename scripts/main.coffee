window.onload = ->
  canvas = document.getElementById('canvas');
  bgSetup = document.getElementById('backgroundSetup');
  
  bgSetup.addEventListener "touchstart", (e) =>
    colorClicked = e.target.dataset.color
    bgSetup.style.display = 'none'
    canvas.style.display = 'block'
    @canver = new Canver canvas, colorClicked
    
window.onresize = ->
  @canver.resizeCanvas()
