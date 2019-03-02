import LSprite from '../../display/LSprite';
import LGlobal from '../../utils/LGlobal';
import LMouseEvent from '../../events/LMouseEvent';
class LRange extends LSprite {
    constructor() {
        super();
        let s = this, h, param;
        s.type = 'LRange';
        s.value = 0;
        if (arguments.length === 0) {
            param = { width: 200 };
        } else if (arguments.length === 1 && typeof arguments[0] === 'number') {
            param = { width: arguments[0] };
        } else if (arguments.length === 2) {
            param = { backLayer: arguments[0], selectLayer: arguments[1] };
        } else {
            throw 'LRange\'s param is wrong';
        }
        if (param['backLayer'] && param['selectLayer']) {
            let backLayer = param['backLayer'];
            s.sign = param['selectLayer'];
            h = backLayer.getHeight() > s.sign.getHeight() ? backLayer.getHeight() : s.sign.getHeight();
            backLayer.y = (h - backLayer.getHeight()) * 0.5;
            s.w = backLayer.getWidth();
            s.graphics.drawRect(0, '#FFFFFF', [-50, 0, s.w + 100, h]);
            s.addChild(backLayer);
        } else {
            s.w = param['width'];
            s.graphics.drawRect(0, '#FFFFFF', [-50, 0, s.w + 100, s.w * 0.13]);
            let grd = LGlobal.canvas.createLinearGradient(0, 0, 0, s.w * 0.13);
            grd.addColorStop(0, '#FFFFFF');
            grd.addColorStop(1, '#CCCCCC');
            s.color = grd;
            s.graphics.drawRect(1, '#CCCCCC', [0, s.w * 0.04, s.w, s.w * 0.03], true, s.color);
            s.sign = new LSprite();
            s.sign.graphics.drawVertices(1, '#CCCCCC', [[0, 0], [s.w * 0.05, 0], [s.w * 0.05, s.w * 0.1], [s.w * 0.025, s.w * 0.13], [0, s.w * 0.1]], true, s.color);
        }
        s.addChild(s.sign);
        s.sign.x = -s.sign.getWidth() * 0.5;
        s.addEventListener(LMouseEvent.MOUSE_DOWN, s._onDown);
    }
    clone() {
        let s = this, a = new LRange(s.w);
        a.copyProperty(s);
        return a;
    }
    _onDown(event) {
        let s = event.clickTarget;
        if (event.selfX < -s.sign.getWidth() * 0.5 || event.selfX > s.w + s.sign.getWidth() * 0.5) {
            return;
        }
        if (s.down) {
            return;
        }
        s.down = true;
        s.sign.x = event.selfX - s.sign.getWidth() * 0.5;
        if (s.sign.x < -s.sign.getWidth() * 0.5) {
            s.sign.x = -s.sign.getWidth() * 0.5;
        }
        if (s.sign.x > s.w - s.sign.getWidth() * 0.5) {
            s.sign.x = s.w - s.sign.getWidth() * 0.5;
        }
        s._DownX = s.sign.x;
        s._OffsetX = event.selfX;
        s._getValue();
        s.addEventListener(LMouseEvent.MOUSE_MOVE, s._onMove);
        LGlobal.stage._ll_range = s;
        LGlobal.stage.addEventListener(LMouseEvent.MOUSE_UP, s._onUp);
    }
    _getValue() {
        let s = this;
        let value = s.value;
        s.value = Math.floor((s.sign.x + s.sign.getWidth() * 0.5) * 100 / s.w);
        if (value !== s.value) {
            s.dispatchEvent(LRange.ON_CHANGE);
        }
    }
    setValue(value) {
        let s = this;
        s.sign.x = s.w * value * 0.01 - s.sign.getWidth() * 0.5;
        s._getValue();
    }
    _onMove(event) {
        let s = event.clickTarget;
        s.sign.x = s._DownX + event.selfX - s._OffsetX;
        if (s.sign.x < -s.sign.getWidth() * 0.5) {
            s.sign.x = -s.sign.getWidth() * 0.5;
        }
        if (s.sign.x > s.w - s.sign.getWidth() * 0.5) {
            s.sign.x = s.w - s.sign.getWidth() * 0.5;
        }
        s._getValue();
    }
    _onUp(event) {
        let s = LGlobal.stage._ll_range;
        s.down = false;
        s.removeEventListener(LMouseEvent.MOUSE_MOVE, s._onMove);
        LGlobal.stage.removeEventListener(LMouseEvent.MOUSE_UP, s._onUp);
    }
}
LRange.ON_CHANGE = 'onchange';
export default LRange;