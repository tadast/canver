class Menu
  constructor: (@start, @element, @canver) ->
    @start.style.display = 'block';
    @activeColor = @element.getElementsByClassName('color active')[0]
    @initColors()

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
        
        selectedElm.className = 'color active'
        @activeColor.className = 'color'
        @activeColor = selectedElm
        
    