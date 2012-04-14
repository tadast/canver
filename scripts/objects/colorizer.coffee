# Colorizer smoothly iterates through all hues
# with maximum saturation automatically.
class Colorizer
  constructor: ->
    @hue = 0
    @saturation = 0
    @color = ''

  # Returns the next colour value as a string
  nextColour: ->
    if @color == ''
      @hue++
      @hue = 0 if @hue > 360
      return 'hsl(' + @hue + ',100%,50%)';
    else
      return @color

  setColor: (color) ->
    @color = color