options =
  autoResizeCanvas: true

# Colorizer smoothly iterates through all hues
# with maximum saturation automatically.
class Colorizer
  constructor: ->
    @hue = 0
    @saturation = 0

  # Returns the next colour value as a string
  nextColour: ->
    @hue++
    @hue = 0 if @hue > 360
    fs = 'hsl(' + @hue + ',100%,50%)';



# A base class for drawing tools
# A drawing tool must have three methods:
#   start - is called when a touch event starts
#   move  - is called when a touch moves
#   end   - is called when a touch event ends
class DrawTool
  constructor: (@canvas, @ctx) ->
    @drawRadius = 10

# Dot tool draws bubbles on every event
class DotTool extends DrawTool
  start: (e) ->
    for touch in e.touches
      @draw touch.clientX, touch.clientY

  move: (e) ->
    for touch in e.changedTouches
      @draw touch.clientX, touch.clientY

  end: (e) ->
    true

  draw: (x, y) ->
    @ctx.beginPath();
    @ctx.arc x, y, @drawRadius, 0, Math.PI*2, true
    @ctx.closePath();
    @ctx.fill();

# Pencil tool draws like a pencil yo!
# Currently doesn't work as expected with multitouch
class PencilTool extends DrawTool
  start: (e) ->
    firstTouch = e.touches[0]
    @ctx.moveTo firstTouch.clientX, firstTouch.clientY

  move: (e) ->
    for touch in e.changedTouches
      @ctx.lineTo touch.clientX, touch.clientY
    @ctx.stroke();

  end: (e) ->
    @ctx.stroke();

  draw: (x, y) ->
    @ctx.beginPath();
    @ctx.arc x, y, @drawRadius, 0, Math.PI*2, true
    @ctx.closePath();
    @ctx.fill();

# The main class
class Canver
  constructor: (@canvas) ->
    @ctx = @canvas.getContext "2d"
    @resizeCanvas()
    @initTouchable()

    @drawRadius = 10
    @ctx.fillStyle = "#fff"
    @colorizer = new Colorizer
    @tool = new DotTool @canvas, @ctx
    # @tool = new PencilTool @canvas, @ctx


  initTouchable: ->
    @canvas.addEventListener "touchstart", (e) =>
      e.preventDefault() # don't scroll yo!
      @tool.start(e)

    @canvas.addEventListener "touchmove", (e) =>
      e.preventDefault()
      @setNextColour()
      @tool.move(e)

    @canvas.addEventListener "touchend", (e) =>
      @tool.end(e)
      true

  setNextColour: ->
    @ctx.fillStyle = @colorizer.nextColour()
    @ctx.strokeStyle = @colorizer.nextColour()

  resizeCanvas: ->
    @canvas.width = window.innerWidth
    @canvas.height = window.innerHeight

window.onload = ->
  canvas = document.getElementById('canvas');
  @canver = new Canver canvas

if options.autoResizeCanvas
  window.onresize = ->
    @canver.resizeCanvas()
