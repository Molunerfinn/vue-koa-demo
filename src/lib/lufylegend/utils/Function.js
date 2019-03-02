import ll from '../ll';
import LEvent from '../events/LEvent';
import { LANDSCAPE, PORTRAIT } from '../utils/LConstant';
if (!Array.isArray) {
    Array.isArray = function(value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    };
}
if (!String.format) {
    String.format = function(format) {
        let args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] !== 'undefined'
                ? args[number] 
                : match;
        });
    };
}
export function trace() {
    if (!ll.LGlobal.traceDebug) return;
    let t = document.getElementById('traceObject'), i;
    if (trace.arguments.length > 0 && !t) {
        let d = document.createElement('DIV');
        d.position = 0;
        d.style.position = 'absolute';
        document.body.appendChild(d);
        t = document.createElement('TEXTAREA');
        t.id = 'traceObject';
        t.style.width = (window.innerWidth * 0.5) + 'px';
        t.style.height = '200px';
        let b = document.createElement('BUTTON');
        b.style.width = (window.innerWidth * 0.25) + 'px';
        b.innerHTML = 'Hide';
        d.appendChild(b);
        LEvent.addEventListener(b, ll.LGlobal.mobile ? 'touchstart' : 'click', function(e) {
            t.style.display = (t.style.display === 'none' ? '' : 'none');
        });
        b = document.createElement('BUTTON');
        b.style.width = (window.innerWidth * 0.25) + 'px';
        b.innerHTML = 'position';
        d.appendChild(b);
        let f = function(e) {
            d.position++;
            if (d.position === 0) {
                d.style.top = '5px';
                d.style.left = '5px';
            } else if (d.position === 1) {
                d.style.top = (window.innerHeight - 20 - parseInt(t.style.height)) + 'px';
                d.style.left = '5px';
            } else if (d.position === 2) {
                d.style.top = '5px';
                d.style.left = (window.innerWidth - parseInt(t.style.width)) + 'px';
            } else {
                d.style.top = (window.innerHeight - 20 - parseInt(t.style.height)) + 'px';
                d.style.left = (window.innerWidth - parseInt(t.style.width)) + 'px';
                d.position = -1;
            }
        };
        f();
        LEvent.addEventListener(b, ll.LGlobal.mobile ? 'touchstart' : 'click', f);
        d.appendChild(document.createElement('BR'));
        d.appendChild(t);
    }
    for (i = 0; i < trace.arguments.length; i++) {
        t.value = t.value + trace.arguments[i] + '\r\n';
        t.scrollTop = t.scrollHeight;
    }
}
if (!window.console) {
    window.console = {
        log: trace,
        warn: trace
    };
}
export function addChild(o) {
    ll.LGlobal.stage.addChild(o);
}
export function removeChild(o) {
    ll.LGlobal.stage.removeChild(o);
}
export function init(s, c, w, h, f, t) {
    ll.LGlobal.speed = s;
    let _f = function() {
        if (ll.LGlobal.canTouch && ll.LGlobal.aspectRatio === LANDSCAPE && window.innerWidth < window.innerHeight) {
            ll.LGlobal.horizontalError();
        } else if (ll.LGlobal.canTouch && ll.LGlobal.aspectRatio === PORTRAIT && window.innerWidth > window.innerHeight) {
            ll.LGlobal.verticalError();
        } else {
            setTimeout(f, 100);
        }
        ll.LGlobal.startTimer = (new Date()).getTime();
    };
    let loop;
    if (typeof s === 'function') {
        loop = function() {
            s(loop);
            ll.LGlobal.onShow();
        };
        ll.LGlobal.speed = 1000 / 60;
    } else {
        let _requestAF = (function() {
            return window.requestAnimationFrame ||
   window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame ||
   window.oRequestAnimationFrame ||
   window.msRequestAnimationFrame ||
   function(callback, element) {
       window.setTimeout(callback, 1000 / 60);
   };
        })();
        ll.LGlobal._requestAFBaseTime = (new Date()).getTime();
        loop = function() {
            let now = (new Date()).getTime();
            let check = now - ll.LGlobal._requestAFBaseTime;
            if (check / s >= 1) {
                ll.LGlobal._requestAFBaseTime += s;
                ll.LGlobal.onShow();
            }
            _requestAF(loop, s);
        };
    }
    if (document.readyState === 'complete') {
        ll.LGlobal.setCanvas(c, w, h);
        _f();
        loop();
    } else {
        LEvent.addEventListener(window, 'load', function() {
            ll.LGlobal._requestAFBaseTime = (new Date()).getTime();
            ll.LGlobal.setCanvas(c, w, h);
            _f();
            loop();
        });
    }
}

export let LInit = init;
export function getTimer() {
    return (new Date()).getTime() - ll.LGlobal.startTimer;
}
export function getExtension(path) {
    let r, pattern = /([^#?]+\.)([^.#?]+)/;
    r = path.match(pattern);
    if (r.length >= 3) {
        return r[2].toLowerCase();
    }
    return null;
}