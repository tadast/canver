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

  hide: ->
    @canvas.style.display = 'none'
    
  show: ->
    @canvas.style.display = 'block'

  repaintBackground: (fillStyle) ->
    fs = @ctx.fillStyle
    @ctx.fillStyle = fillStyle
    @ctx.fillRect 0, 0, @canvas.width, @canvas.height
    @ctx.fillStyle = fs

  initTouchable: ->
    @canvas.addEventListener "touchstart", (e) =>
      e.preventDefault()
      @tool.start(e)

    @canvas.addEventListener "touchmove", (e) =>
      e.preventDefault()
      @setNextColour()
      @tool.move(e)

    @canvas.addEventListener "touchend", (e) =>
      e.preventDefault()
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
    
  switchSaveMode: (imageElm) ->
    if window.navigator.standalone
      alert "iOS does not support image saving in Home Screen mode. You can make a screenshot by holding down Home and Power buttons."
    else
      alert 'Tap and hold the image to save. Click menu arrow when finished.'
      imageElm.src = @canvas.toDataURL()
      @hide()