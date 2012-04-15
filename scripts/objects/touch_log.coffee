class TouchLogEntry
  updateWith: (newX, newY) ->
    @previous = @current
    @current =
      x: newX
      y: newY
  
  # distance between current and previous points
  distance: ->
    return 0 unless @previous
    sqDis = Math.pow(@previous.x - @current.x, 2) + Math.pow(@previous.y - @current.y, 2)
    Math.sqrt sqDis

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