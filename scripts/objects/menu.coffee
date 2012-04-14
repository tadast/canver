class Menu
  constructor: (@start, @element, @canver) ->
    @activeColor = @element.getElementsByClassName('color active')[0]
    @activeSize = @element.getElementsByClassName('size active')[0]
    @initColors()
    @initSizes()
    @initReset()
    @initSave()

    @element.addEventListener "touchmove", (e) =>
      e.preventDefault();
    
    @initSwitch()

  initColors: ->
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
    sizes = @element.getElementsByClassName('size')
    for size in sizes
      size.addEventListener "touchstart", (e) =>
        selectedElm = e.currentTarget
        size = selectedElm.dataset['size']
        @canver.setSize size
        
        @activeSize.className = 'size'
        selectedElm.className = 'size active'
        @activeSize = selectedElm

  initReset: ->
    reset = document.getElementById('reset')
    reset.addEventListener "touchstart", (e) =>
      if confirm('Reset all?')
        window.location.reload()
  
  initSwitch: ->
    @start.style.display = 'block';
    @start.addEventListener "touchmove", (e) =>
      e.preventDefault()
    @start.addEventListener "touchstart", (e) =>
      e.preventDefault()
      if @element.className == 'hidden'
        @element.className = ''
        @start.className = 'down'
      else
        @element.className = 'hidden'
        @start.className = 'up'
      
  initSave: ->
    saverElm = document.getElementById('saving')
    saverElm.addEventListener "touchstart", (e) =>
      @canver.switchSaveMode()