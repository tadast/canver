class Menu
  constructor: (@element, @canver) ->
    @element.style.display = 'block';

    @element.addEventListener "touchstart", (e) =>
      e.preventDefault();
      @element.style['background-color'] = @canver.switchColor()