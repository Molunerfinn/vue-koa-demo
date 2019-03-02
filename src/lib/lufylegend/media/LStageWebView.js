import LEventDispatcher from '../events/LEventDispatcher';
import LEvent from '../events/LEvent';
import LGlobal from '../utils/LGlobal';
class LStageWebView extends LEventDispatcher {
    constructor() {
        super();
        let s = this;
        s.display = document.createElement('div');
        s.iframe = document.createElement('iframe');
        s.display.style.position = 'absolute';
        s.display.style.marginTop = '0px';
        s.display.style.marginLeft = '0px';
        s.display.style.zIndex = LStageWebView.START_INDEX++;
        if (LGlobal.ios) {
            s.display.style.overflow = 'auto';
            s.display.style.webkitOverflowScrolling = 'touch';
        }
        s.display.appendChild(s.iframe);
        s.idAdded = false;
    }
    loadURL(u) {
        let s = this;
        s.iframe.src = u;
        s.iframe.onload = function() {
            s.dispatchEvent(LEvent.COMPLETE);
        };
    }
    show() {
        let s = this;
        if (!s.idAdded) {
            LGlobal.object.appendChild(s.display);
            s.idAdded = true;
        }
        if (s.display.style.display === 'none') {
            s.display.style.display = '';
        }
    }
    die() {
        LGlobal.object.removeChild(this.display);
        this.idAdded = false;
    }
    hide() {
        this.display.style.display = 'none';
    }
    setViewPort(r) {
        let s = this, sx = parseInt(LGlobal.canvasObj.style.width) / LGlobal.canvasObj.width, sy = parseInt(LGlobal.canvasObj.style.height) / LGlobal.canvasObj.height;
        s.display.style.marginTop = (parseInt(LGlobal.canvasObj.style.marginTop) + ((r.y * sy) >>> 0)) + 'px';
        s.display.style.marginLeft = (parseInt(LGlobal.canvasObj.style.marginLeft) + ((r.x * sx) >>> 0)) + 'px';
        s.iframe.style.width = s.display.style.width = (r.width * sx >>> 0) + 'px';
        s.iframe.style.height = s.display.style.height = (r.height * sy >>> 0) + 'px';
    }
}
LStageWebView.START_INDEX = 11;
export default LStageWebView;