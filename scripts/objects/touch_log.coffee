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