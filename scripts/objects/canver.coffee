# Colorizer smoothly iterates through all hues
# with maximum saturation automatically.
class Colorizer
  constructor: ->
    @hue = 0
    @saturation = 0
    @color = ''

  # Returns the next colour value as a string
  nextColour: ->
    if @color == ''
      @hue++
      @hue = 0 if @hue > 360
      return 'hsl(' + @hue + ',100%,50%)';
    else
      return @color

  setColor: (color) ->
    @color = color

class TouchLogEntry
  updateWith: (newX, newY) ->
    @previous = @current
    @current =
      x: newX
      y: newY

class TouchLog
  constructor: ->
    @log = {}

  forTouch: (touch) ->
    @log[touch.identifier]

  logEvent: (e) ->
    for touch in e.touches
      entry = @findOrNew(touch.identifier)
      entry.updateWith(touch.clientX, touch.clientY)

  findOrNew: (touchId) ->
    @log[touchId] ||= new TouchLogEntry

  clear: (touchId) ->
    delete @log[touchId]

  clearFromEvent: (event) ->
    for touch in event.touches
      @clear touch.identifier

# A base class for drawing tools
# A drawing tool must have three methods:
#   start - is called when a touch event starts
#   move  - is called when a touch moves
#   end   - is called when a touch event ends
class DrawTool
  constructor: (@canvas, @ctx) ->
    @drawRadius = 10

  setSize: (size) ->
    @drawRadius = size

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
  init: ->
    @touchlog ||= new TouchLog
    @ctx.setLineJoin('round')
    @ctx.setLineCap('round')

  start: (e) ->
    @touchlog.logEvent e

  move: (e) ->
    @touchlog.logEvent e
    for touch in e.changedTouches # migth be buggy, because logger does not know when to use changed vs all touches
      previous = @touchlog.forTouch(touch).previous
      @ctx.beginPath()
      @ctx.lineWidth = @drawRadius
      @ctx.moveTo previous.x, previous.y
      @ctx.lineTo touch.clientX, touch.clientY
      @ctx.stroke();
      @ctx.closePath()

  end: (e) ->
    #@touchlog.clearFromEvent e # does not work, removes all touches, we need to remove only ended touches

# The main class
class Canver
  constructor: (@canvas, @bgColor) ->
    @ctx = @canvas.getContext "2d"
    @resizeCanvas()
    @initTouchable()
    @repaintBackground(@bgColor)
    @drawRadius = 10
    @colorizer = new Colorizer
    # @tool = new DotTool @canvas, @ctx
    @tool = new PencilTool(@canvas, @ctx)
    @tool.init()
    @ctx.fillStyle = "#fa0"
    @canvas.style.display = 'block'

  repaintBackground: (fillStyle) ->
    fs = @ctx.fillStyle
    @ctx.fillStyle = fillStyle
    @ctx.fillRect 0, 0, @canvas.width, @canvas.height
    @ctx.fillStyle = fs

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

  setColor: (color) ->
    @colorizer.setColor color
    
  setSize: (size) ->
    @tool.setSize size