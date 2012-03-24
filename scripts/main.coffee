options =
  autoResizeCanvas: true

class Molbert
  constructor: (@canvas) ->
    @ctx = @canvas.getContext "2d"
    @resizeCanvas()
    @initTouchable()
    
    @drawRadius = 10
    @ctx.fillStyle = "#8ED6FF"
    
  drawDot: (x, y) ->
    @ctx.beginPath();
    @ctx.arc x, y, @drawRadius, 0, Math.PI*2, true
    @ctx.closePath();
    @ctx.fill();
    
  initTouchable: ->
    that = this
    @canvas.addEventListener "touchstart", (e) ->
      e.preventDefault() # don't scroll yo!
      for touch in e.touches
        that.drawDot touch.clientX, touch.clientY
      true
      
    @canvas.addEventListener "touchmove", (e) ->
      e.preventDefault()
      for touch in e.changedTouches
        that.drawDot touch.clientX, touch.clientY
      
    @canvas.addEventListener "touchend", (e) ->
      true
      
  resizeCanvas: ->
    @canvas.width = window.innerWidth
    @canvas.height = window.innerHeight
    
window.onload = ->
  canvas = document.getElementById('canvas');
  @molbert = new Molbert canvas
  
if options.autoResizeCanvas
  window.onresize = ->
    @molbert.resizeCanvas()
  