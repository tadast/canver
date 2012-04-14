var Util;
Util = (function() {
  function Util() {}
  Util.noScrollingOn = function(elm) {
    return elm.addEventListener("touchmove", function(e) {
      return e.preventDefault();
    });
  };
  return Util;
})();