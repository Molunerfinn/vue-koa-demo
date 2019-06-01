import $ from 'jquery'

var _lastGuide = null;
var _lastWrap = null;
var _stop = function(el) {
  if (el) {
    if (el.data("_guide")) {
      el.data("_guide").remove();
      el.removeData("_guide")
    }
  } else {
    if (_lastGuide) {
      _lastGuide.remove();
      _lastGuide = null;
      _lastWrap && _lastWrap.removeData("_guide")
    }
  }
};
var _play = function(el, or, scale) {
  var $wrap = $('<div class="ball-scale-multiple"><div></div><div></div><div></div></div>');
  if (el.css("position") === "static") {
    el.css("position", "relative")
  }
  if (typeof or === "object" && typeof or.x !== "undefined" && typeof or.y !== "undefined" && typeof or.w !== "undefined" && typeof or.h !== "undefined") {
    var r = Math.min(or.w, or.h) * (scale || 1);
    $wrap.children().css({
      width: r,
      height: r
    });
    $wrap.css({
      left: or.x + (or.w - r) / 2,
      top: or.y + (or.h - r) / 2
    })
  } else {
    scale = scale || 0.8;
    var elHeight = el.outerHeight();
    var elWidth = el.outerWidth();
    var elr = (or === "w" ? elWidth / 2 : (or === "h" ? elHeight / 2 : (or === "min" ? Math.min(elHeight, elWidth) / 2 : Math.max(elHeight, elWidth) / 2))) * scale;
    $wrap.css({
      left: elWidth / 2 - elr,
      top: elHeight / 2 - elr
    });
    $wrap.children().css({
      width: 2 * elr,
      height: 2 * elr
    })
  }
  el.append($wrap);
  _lastGuide = $wrap;
  el.data("_guide", $wrap);
  _lastWrap = el
}

const Guide = {
  play: _play,
  stop: _stop
}

export default Guide
