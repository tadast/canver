/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Util {
  static noScrollingOn(elm) {
    elm.addEventListener("touchmove", e => e.preventDefault());
    return elm.addEventListener("mousemove", e => e.preventDefault());
  }
}