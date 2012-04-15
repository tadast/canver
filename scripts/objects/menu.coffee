class Menu
  constructor: (@start, @element, @canver) ->
    @initSizes()
    @initColors()
    @initTools()
    
    @initSave()
    @initReset()
    
    @initSwitch() # betveen draw and save modes

  initColors: ->
    @activeColor = @element.getElementsByClassName('color active')[0]
    colors = @element.getElementsByClassName('color')
    for color in colors
      color.style['background-color'] = color.dataset['color']
      color.addEventListener "touchstart", (e) =>
        selectedElm = e.currentTarget
        color = selectedElm.dataset['color']
        @canver.setColor color
        
        @activeColor.className = 'color'
        selectedElm.className = 'color active'
        @activeColor = selectedElm
        
  initSizes: ->
    @activeSize = @element.getElementsByClassName('size active')[0]
    sizes = @element.getElementsByClassName('size')
    for size in sizes
      size.addEventListener "touchstart", (e) =>
        selectedElm = e.currentTarget
        size = selectedElm.dataset['size']
        @canver.setSize size
        
        @activeSize.className = 'size'
        selectedElm.className = 'size active'
        @activeSize = selectedElm

  initTools: ->
    @activeTool = @element.getElementsByClassName('tool active')[0]
    tools = @element.getElementsByClassName('tool')
    for tool in tools
      tool.addEventListener "touchstart", (e) =>
        selectedElm = e.currentTarget
        toolName = selectedElm.dataset['toolname']
        @canver.setTool toolName
        
        @activeTool.className = 'tool'
        selectedElm.className = 'tool active'
        @activeTool = selectedElm


  initReset: ->
    reset = document.getElementById('reset')
    reset.addEventListener "touchstart", (e) =>
      if confirm('Reset all?')
        window.location.reload()
  
  initSwitch: ->
    @start.style.display = 'block';
    @start.addEventListener "touchstart", (e) =>
      e.preventDefault()
      @toggleHide()

  toggleHide: ->
    if @element.className == 'hidden'
      @element.className = ''
      @start.className = 'down'
      @canver.show() #that's how we come back from save mode
    else
      @element.className = 'hidden'
      @start.className = 'up'

      
  initSave: ->
    saverElm = document.getElementById('saving')
    imgElement = document.getElementById('saveImage')
    Util.noScrollingOn imgElement
    saverElm.addEventListener "touchstart", (e) =>
      @toggleHide()
      @canver.switchSaveMode(imgElement)