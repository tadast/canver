class Menu
  constructor: (@start, @element, @canver) ->
    @start.style.display = 'block';
    @activeColor = @element.getElementsByClassName('color active')[0]
    @activeSize = @element.getElementsByClassName('size active')[0]
    @initColors()
    @initSizes()
    @initReset()

    @start.addEventListener "touchstart", (e) =>
      e.preventDefault();
      @start.style['background-color'] = @canver.switchColor()

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
            