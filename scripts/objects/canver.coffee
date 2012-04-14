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