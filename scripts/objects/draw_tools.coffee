# contains info about all available tools
class ToolRegister
  constructor: ->
    @tools = [DotTool, FingerTool, FeatherTool]

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
    true

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

# Finger tool draws like a pencil yo!
# Currently doesn't work as expected with multitouch
class FingerTool extends DrawTool
  @toolName = 'finger'

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
    true
    #@touchlog.clearFromEvent e # does not work, removes all touches, we need to remove only ended touches

class FeatherTool extends DrawTool
  @toolName = 'feather'
  init: ->
    @touchlog ||= new TouchLog
    @ctx.setLineJoin('round')
    @ctx.setLineCap('round')

  start: (e) ->
    @touchlog.logEvent e

  move: (e) ->
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