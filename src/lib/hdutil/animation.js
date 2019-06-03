let t = window.requestAnimationFrame
let n = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;
["webkit", "moz", "o", "ms"].forEach( function(r,i) {
    if (t) return ! 1;
    t = window[r + "RequestAnimationFrame"],
    n = window[r + "CancelAnimationFrame"] || window[r + "CancelRequestAnimationFrame"]
})

t = t || function(e) {
    return window.setTimeout(e, 1e3 / 60, (new Date).getTime())
}
n = n || clearTimeout

export function requestAnimFrame(e) {
    return t(e)
}
export function cancelAnimFrame(e) {
    return n(e)
}
