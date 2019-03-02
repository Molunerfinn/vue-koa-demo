import LDisplayObject from './LDisplayObject';
import LMouseEventContainer from '../events/LMouseEventContainer';
import LMouseEvent from '../events/LMouseEvent';
class LInteractiveObject extends LDisplayObject {
    constructor() {
        super();
        this.type = 'LInteractiveObject';
        this.mouseEnabled = true;
        this.mouseList = [];
    }
    addEventListener(type, listener) {
        let s = this;
        if (type.indexOf('mouse') >= 0 || type.indexOf('touch') >= 0 || type === LMouseEvent.DOUBLE_CLICK) {
            if (LMouseEventContainer.container[type] || ((type === LMouseEvent.MOUSE_OVER || type === LMouseEvent.MOUSE_OUT) && LMouseEventContainer.container[LMouseEvent.MOUSE_MOVE])) {
                LMouseEventContainer.addMouseEvent(s, type, listener);
                return;
            }
            s.mouseList.push({
                listener: listener,
                type: type
            });
        } else {
            s._eventList.push({
                listener: listener,
                type: type
            });
        }
    }
    removeEventListener(type, listener) {
        let s = this, i, length;
        if (type.indexOf('mouse') >= 0 || type.indexOf('touch') >= 0 || type === LMouseEvent.DOUBLE_CLICK) {
            if (LMouseEventContainer.container[type] || ((type === LMouseEvent.MOUSE_OVER || type === LMouseEvent.MOUSE_OUT) && LMouseEventContainer.container[LMouseEvent.MOUSE_MOVE])) {
                LMouseEventContainer.removeMouseEvent(s, type, listener);
                return;
            }
            length = s.mouseList.length;
            for (i = 0; i < length; i++) {
                if (!s.mouseList[i]) {
                    continue;
                }
                if (type === s.mouseList[i].type && s.mouseList[i].listener === listener) {
                    s.mouseList.splice(i, 1);
                    return;
                }
            }
        } else {
            return super.removeEventListener(type, listener);
        }
    }
    removeAllEventListener() {
        let s = this;
        s.mouseList.length = 0;
        s._eventList.length = 0;
        if (LMouseEventContainer.container[LMouseEvent.MOUSE_DOWN]) {
            LMouseEventContainer.removeMouseEvent(s, LMouseEvent.MOUSE_DOWN);
        }
        if (LMouseEventContainer.container[LMouseEvent.MOUSE_UP]) {
            LMouseEventContainer.removeMouseEvent(s, LMouseEvent.MOUSE_UP);
        }
        if (LMouseEventContainer.container[LMouseEvent.MOUSE_MOVE]) {
            LMouseEventContainer.removeMouseEvent(s, LMouseEvent.MOUSE_MOVE);
            LMouseEventContainer.removeMouseEvent(s, LMouseEvent.MOUSE_OVER);
            LMouseEventContainer.removeMouseEvent(s, LMouseEvent.MOUSE_OUT);
        }
    }
    hasEventListener(type, listener) {
        let s = this, i, length;
        if (LMouseEventContainer.container[type]) {
            return LMouseEventContainer.hasEventListener(s, type, listener);
        }
        if (type.indexOf('mouse') >= 0 || type.indexOf('touch') >= 0 || type === LMouseEvent.DOUBLE_CLICK) {
            length = s.mouseList.length;
            for (i = 0; i < length; i++) {
                if (!s.mouseList[i]) {
                    continue;
                }
                if (type === s.mouseList[i].type && (!listener || s.mouseList[i].listener === listener)) {
                    return true;
                }
            }
        } else {
            return super.hasEventListener(type, listener);
        }
        return false;
    }
}
export default LInteractiveObject;