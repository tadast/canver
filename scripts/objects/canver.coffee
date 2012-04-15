# The main class
class Canver
  constructor: (@canvas, @bgColor) ->
    @ctx = @canvas.getContext "2d"
    @resizeCanvas()
    @initTouchable()
    @repaintBackground(@bgColor)
    @drawRadius = 10
    @colorizer = new Colorizer
    @setTool 'dot'
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
      @applyColor()
      @tool.start(e)

    @canvas.addEventListener "touchmove", (e) =>
      e.preventDefault()
      @applyColor()
      @tool.move(e)

    @canvas.addEventListener "touchend", (e) =>
      e.preventDefault()
      @tool.end(e)
      true

  applyColor: ->
    @ctx.fillStyle = @colorizer.nextColour()
    @ctx.strokeStyle = @colorizer.nextColour()

  resizeCanvas: ->
    @canvas.width = window.innerWidth
    @canvas.height = window.innerHeight

  setTool: (toolName) ->
    # TODO set the selected tool size
    @tr ||= new ToolRegister
    toolClass = @tr.toolFor toolName
    @tool = new toolClass(@canvas, @ctx)
    @tool.init()

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