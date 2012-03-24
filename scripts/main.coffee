options =
  autoResizeCanvas: true

class Molbert
  constructor: (@canvas) ->
    @resizeCanvas()
    
  resizeCanvas: ->
    @canvas.width = window.innerWidth
    @canvas.height = window.innerHeight
    
window.onload = ->
  canvas = document.getElementById('canvas');
  @molbert = new Molbert canvas
  
if options.autoResizeCanvas
  window.onresize = ->
    @molbert.resizeCanvas()
  