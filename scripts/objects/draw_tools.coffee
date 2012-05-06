# contains info about all available tools
class ToolRegister
  constructor: ->
    @tools = [DotTool, WetFeather, PencilTool]

  # gives a tool class given a tool name
  toolFor: (toolName) ->
    for tool in @tools
      return tool if tool.toolName == toolName
    alert "Tool #{toolName} not found"

# A base class for drawing tools
# A drawing tool must have three methods:
#   start - is called when a touch event starts
#   move  - is called when a touch moves
#   end   - is called when a touch event ends
class DrawTool
  @toolName = 'GenericDrawTool'
  @respondsTo: (name) ->
    @toolName == name

  constructor: (@canvas, @ctx) ->
    @drawRadius = 10

  init: ->
    @ctx.shadowBlur = 0

  setSize: (size) ->
    @drawRadius = size

# Dot tool draws bubbles on every event
class DotTool extends DrawTool
  @toolName = 'dot'

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

# Feather tool uses bezier curves to smooth out user input
class PencilTool extends DrawTool
  @toolName = 'pencil'
  init: ->
    super()
    @touchlog ||= new TouchLog

  start: (e) ->
    @touchlog.logEvent e

  move: (e) ->
    @ctx.setLineCap 'round'
    @ctx.setLineJoin 'round'
    for touch in e.changedTouches
      log = @touchlog.forTouch(touch)
      continue unless log && log.previous

      @ctx.lineWidth = @drawRadius
      @ctx.beginPath()

      # move to midpoint between last and prev points so that bezier curves don't intersect
      startX = (log.previous.x + log.current.x) / 2
      startY = (log.previous.y + log.current.y) / 2
      @ctx.moveTo startX, startY

      # do the same with the end point
      endX = (log.current.x + touch.clientX) / 2
      endY = (log.current.y + touch.clientY) / 2
      @ctx.quadraticCurveTo(log.current.x, log.current.y, endX, endY)

      @ctx.stroke()
      @ctx.closePath()
    @touchlog.logEvent e

  end: (e) ->
    true

class WetFeather extends PencilTool
  @toolName = 'wetFeather'
  init: ->
    super()
    @defaultAlpha = 1.0
    @maxDribbleLength = 120 # how long is a drop
    @probability = 0.5      # how likely is it to drip for each touch event?
    @dropFactor = 1.3       # how much bigger is the dropplet at the end of the line?
    @ctx.shadowBlur = 4

  move: (e) ->
    super e
    @ctx.setLineCap 'square'
    @ctx.globalAlpha = Math.random()

    for touch in e.changedTouches
      @dribble(touch)

    @ctx.globalAlpha = @defaultAlpha

  dribble: (touch) ->
    log = @touchlog.forTouch(touch)
    return false unless log && log.previous
    return false if Math.random() > @probability
    @ctx.lineWidth = @drawRadius / (@ctx.globalAlpha * 2 + 1) # the thicker the more transparent
    @ctx.beginPath()

    startX = log.current.x
    startY = log.current.y
    dropEndY = startY + Math.random() * @maxDribbleLength
    @ctx.moveTo startX, startY
    @ctx.lineTo startX, dropEndY
    @ctx.closePath()
    @ctx.stroke();

    @dropletEnd(startX, dropEndY, @ctx.lineWidth)

  dropletEnd: (x, y, width) ->
    @ctx.beginPath()
    radius = @dropFactor * width / 2

    # Trapeze
    @ctx.moveTo x - width/2, y
    @ctx.lineTo x + width/2, y
    @ctx.lineTo x + radius, y + radius*2
    @ctx.lineTo x - radius, y + radius*2

    # half circle
    @ctx.arc x, y + radius*2, radius, 0, Math.PI, false
    @ctx.closePath();
    @ctx.fill();
