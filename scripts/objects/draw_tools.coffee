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
