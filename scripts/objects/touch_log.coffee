class TouchLogEntry
  constructor: (@maxSize = 3) ->
    @all = [] # order: [newest....oldest]

  updateWith: (newX, newY) ->
    newRecord =
      x: newX
      y: newY
    @all.unshift newRecord
    @all.pop() if @length() > @maxSize

  current: ->
    @all[0]

  previous: ->
    @all[1]

  length: ->
    @all.length

  # distance between current and previous points
  distance: ->
    return 0 unless @previous()
    sqDis = Math.pow(@previous().x - @current().x, 2) + Math.pow(@previous().y - @current().y, 2)
    Math.sqrt sqDis

class TouchLog
  constructor: (size = 3) ->
    @size = size # how many records should TouchLogEntry store
    @log = {}

  forTouch: (touch) ->
    @log[touch.identifier]

  logEvent: (e) ->
    for touch in e.touches
      entry = @findOrNew(touch.identifier)
      entry.updateWith(touch.clientX, touch.clientY)

  findOrNew: (touchId) ->
    @log[touchId] ||= new TouchLogEntry @size

  clear: (touchId) ->
    delete @log[touchId]

  clearFromEvent: (event) ->
    for touch in event.touches
      @clear touch.identifier