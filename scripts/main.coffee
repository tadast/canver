window.onload = ->
  canvas = document.getElementById('canvas');
  @canver = new Canver canvas

if options.autoResizeCanvas
  window.onresize = ->
    @canver.resizeCanvas()
