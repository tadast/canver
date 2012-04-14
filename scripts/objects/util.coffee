class Util
  @noScrollingOn: (elm) ->
    elm.addEventListener "touchmove", (e) ->
      e.preventDefault()