import LMouseEvent from './LMouseEvent';
import { UNDEFINED } from '../utils/LConstant';
class LMouseEventContainer {
    constructor() {
        this.dispatchAllEvent = false;
        this.container = {};
        this.mouseDownContainer = [];
        this.mouseUpContainer = [];
        this.mouseMoveContainer = [];
        this.mouseOverContainer = [];
        this.mouseOutContainer = [];
        this.mouseDblContainer = [];
        this.textFieldInputContainer = [];
        this.buttonContainer = [];
    }
    pushInputBox(d) {
        let c = this.textFieldInputContainer;
        for (let i = 0, l = c.length; i < l; i++) {
            if (d.objectIndex === c[i].objectIndex) {
                return;
            }
        }
        this.textFieldInputContainer.push(d);
    }
	
    removeInputBox(d) {
        let s = this, c = s.textFieldInputContainer, i, l;
        for (i = 0, l = c.length; i < l; i++) {
            if (d.objectIndex === c[i].objectIndex) {
                s.textFieldInputContainer.splice(i, 1);
                break;
            }
        }
    }
    pushButton(d) {
        let s = this, c = s.buttonContainer, i, l;
        for (i = 0, l = c.length; i < l; i++) {
            if (d.objectIndex === c[i].objectIndex) {
                return;
            }
        }
        s.buttonContainer.push(d);
    }
    removeButton(d) {
        let s = this, c = s.buttonContainer, i, l;
        for (i = 0, l = c.length; i < l; i++) {
            if (d.objectIndex === c[i].objectIndex) {
                s.buttonContainer.splice(i, 1);
                break;
            }
        }
    }
    dispatchEventButton(e) {
        let s = this, c = s.buttonContainer, i, l;
        for (i = 0, l = c.length; i < l; i++) {
            if (typeof s.buttonContainer[i].ll_button_mode === 'function') {
                s.buttonContainer[i].ll_button_mode(e);
            }
        }
    }
    addEvent(o, list, f) {
        list.push({ container: o, listener: f });
    }
    removeEvent(o, list, f) {
        let i, l;
        for (i = 0, l = list.length; i < l; i++) {
            if (list[i].container.objectIndex === o.objectIndex && (!f || list[i].listener === f)) {
                list.splice(i, 1);
                break;
            }
        }
    }
    addMouseDownEvent(o, f) {
        let s = this;
        s.addEvent(o, s.mouseDownContainer, f);
    }
    addMouseUpEvent(o, f) {
        let s = this;
        s.addEvent(o, s.mouseUpContainer, f);
    }
    addMouseMoveEvent(o, f) {
        let s = this;
        s.addEvent(o, s.mouseMoveContainer, f);
    }
    addMouseOverEvent(o, f) {
        let s = this;
        s.addEvent(o, s.mouseOverContainer, f);
    }
    addMouseOutEvent(o, f) {
        let s = this;
        s.addEvent(o, s.mouseOutContainer, f);
    }
    addMouseDblEvent(o, f) {
        let s = this;
        s.addEvent(o, s.mouseDblContainer, f);
    }
    addMouseEvent(o, t, f) {
        let s = this;
        if (t === LMouseEvent.MOUSE_DOWN) {
            s.addMouseDownEvent(o, f);
        } else if (t === LMouseEvent.MOUSE_UP) {
            s.addMouseUpEvent(o, f);
        } else if (t === LMouseEvent.MOUSE_OVER) {
            s.addMouseOverEvent(o, f);
        } else if (t === LMouseEvent.MOUSE_OUT) {
            s.addMouseOutEvent(o, f);
        } else if (t === LMouseEvent.MOUSE_MOVE) {
            s.addMouseMoveEvent(o, f);
        } else {
            s.addMouseDblEvent(o, f);
        }
    }
    hasEventListener(o, t, f) {
        let s = this, list;
        if (t === LMouseEvent.MOUSE_DOWN) {
            list = s.mouseDownContainer;
        } else if (t === LMouseEvent.MOUSE_UP) {
            list = s.mouseUpContainer;
        } else if (t === LMouseEvent.MOUSE_OVER) {
            list = s.mouseOverContainer;
        } else if (t === LMouseEvent.MOUSE_OUT) {
            list = s.mouseOutContainer;
        } else if (t === LMouseEvent.MOUSE_MOVE) {
            list = s.mouseMoveContainer;
        } else {
            list = s.mouseDblContainer;
        }
        for (let i = 0, l = list.length; i < l; i++) {
            if (list[i].container.objectIndex === o.objectIndex && (!f || list[i].listener === f)) {
                return true;
            }
        }
        return false;
    }
    removeMouseDownEvent(o, f) {
        let s = this;
        s.removeEvent(o, s.mouseDownContainer, f);
    }
    removeMouseUpEvent(o, f) {
        let s = this;
        s.removeEvent(o, s.mouseUpContainer, f);
    }
    removeMouseMoveEvent(o, f) {
        let s = this;
        s.removeEvent(o, s.mouseMoveContainer, f);
    }
    removeMouseOverEvent(o, f) {
        let s = this;
        s.removeEvent(o, s.mouseOverContainer, f);
    }
    removeMouseOutEvent(o, f) {
        let s = this;
        s.removeEvent(o, s.mouseOutContainer, f);
    }
    removeMouseDblEvent(o, f) {
        let s = this;
        s.removeEvent(o, s.mouseDblContainer, f);
    }
    removeMouseEvent(o, t, f) {
        let s = this;
        if (t === LMouseEvent.MOUSE_DOWN) {
            s.removeMouseDownEvent(o, f);
        } else if (t === LMouseEvent.MOUSE_UP) {
            s.removeMouseUpEvent(o, f);
        } else if (t === LMouseEvent.MOUSE_OVER) {
            s.removeMouseOverEvent(o, f);
        } else if (t === LMouseEvent.MOUSE_OUT) {
            s.removeMouseOutEvent(o, f);
        } else if (t === LMouseEvent.MOUSE_MOVE) {
            s.removeMouseMoveEvent(o, f);
        } else {
            s.removeMouseDblEvent(o, f);
        }
    }
    dispatchMouseEvent(event, type) {
        let s = this;
        if (type === LMouseEvent.MOUSE_DOWN) {
            s.dispatchEvent(event, s.mouseDownContainer, LMouseEvent.MOUSE_DOWN);
            s.dispatchEvent(event, s.textFieldInputContainer);
        } else if (type === LMouseEvent.MOUSE_UP) {
            s.dispatchEvent(event, s.mouseUpContainer, LMouseEvent.MOUSE_UP);
        } else if (type === LMouseEvent.DOUBLE_CLICK) {
            s.dispatchEvent(event, s.mouseDblContainer, LMouseEvent.DOUBLE_CLICK);
        } else {
            s.dispatchEventButton(event);
            s.dispatchEvent(event, s.mouseOutContainer, LMouseEvent.MOUSE_OUT);
            s.dispatchEvent(event, s.mouseOverContainer, LMouseEvent.MOUSE_OVER);
            s.dispatchEvent(event, s.mouseMoveContainer, LMouseEvent.MOUSE_MOVE);
        }
    }
    getRootParams(s) {
        let p = s.parent, r = { x: 0, y: 0, scaleX: 1, scaleY: 1 };
        while (p && p !== 'root') {
            r.x *= p.scaleX;
            r.y *= p.scaleY;
            r.x += p.x;
            r.y += p.y;
            r.scaleX *= p.scaleX;
            r.scaleY *= p.scaleY;
            p = p.parent;
        }
        return r;
    }
    _mouseEnabled(sp) {
        if (!sp || !sp.parent) {
            return false;
        }
        if (!sp.visible || (typeof sp.mouseEnabled !== UNDEFINED && !sp.mouseEnabled)) {
            return false;
        }
        let p = sp.parent;
        while (p && p !== 'root') {
            if (!p.mouseEnabled || !p.mouseChildren || !p.visible) {
                return false;
            }
            p = p.parent;
            if (!p) {
                return false;
            }
        }
        return true;
    }
    _dispatchEvent(event, type, st, index, fromIndex, endIndex) {
        let i, o, l = st.length;
        for (i = fromIndex; i <= endIndex && i < l; i++) {
            o = st[i];
            if (o.sp.objectIndex !== index) {
                continue;
            }
            event.currentTarget = event.clickTarget = o.sp;
            if (!event.target) {
                event.target = o.sp;
            }
            event.event_type = type;
            event.selfX = (event.offsetX - o.co.x - o.sp.x) / (o.co.scaleX * o.sp.scaleX);
            event.selfY = (event.offsetY - o.co.y - o.sp.y) / (o.co.scaleY * o.sp.scaleY);
            o.listener(event, o.sp);
        }
    }
    dispatchEvent(event, list, type) {
        let self = this, sp, co, st = [], o, i, l;
        for (i = 0, l = list.length; i < l; i++) {
            sp = list[i].container || list[i];
            if (!self._mouseEnabled(sp)) {
                continue;
            }
            co = self.getRootParams(sp);
            if (!type && sp.mouseEvent) {
                sp.mouseEvent(event, LMouseEvent.MOUSE_DOWN, co);
                continue;
            }
            if (sp.ismouseon(event, co)) {
                if (type === LMouseEvent.MOUSE_OUT) {
                    continue;
                }
                if (type === LMouseEvent.MOUSE_OVER) {
                    if (sp.ll_mousein) {
                        continue;
                    }
                }
                if (type !== LMouseEvent.MOUSE_UP) {
                    sp.ll_mousein = true;
                }
                st.push({ sp: sp, co: co, listener: list[i].listener });
            } else {
                if (type !== LMouseEvent.MOUSE_OUT && type !== LMouseEvent.MOUSE_OVER) {
                    continue;
                }
                if (!sp.ll_mousein) {
                    continue;
                }
                sp.ll_mousein = false;
                st.push({ sp: sp, co: co, listener: list[i].listener });
            }
        }
        if (st.length === 0) {
            return;
        }
        if (st.length > 1) {
            st = st.sort(self._sort.bind(self));
        }
        l = st.length;
        for (i = 0; i < l; i++) {
            o = st[i];
            self._dispatchEvent(event, type, st, o.sp.objectIndex, i, self.dispatchAllEvent ? l - 1 : i);
            if (i < st.length - 1 && o.sp.objectIndex === st[i + 1].sp.objectIndex) {
                st.splice(i, 1);
                i--;
                continue;
            }
            let p;
            while (p && p !== 'root') {
                if (!p) {
                    p = o.sp.parent;
                    event.target = o.sp;
                }
                if (!p || p === 'root') {
                    break;
                }
                self._dispatchEvent(event, type, st, p.objectIndex, i + 1, l);
                event.target = p;
                p = p.parent;
            }
            if (!self.dispatchAllEvent) {
                break;
            } else {
                continue;
            }
        }
    }

    set(t, v) {
        this.container[t] = v;
    }
    _sort(a, b) {
        let s = this, o1, o2, al = s._getSort(a.sp), bl = s._getSort(b.sp), i, l1, l2;
        for (i = 0, l1 = al.length, l2 = bl.length; i < l1 && i < l2; i++) {
            o1 = al[i];
            o2 = bl[i];
            if (o1.objectIndex === o2.objectIndex) {
                continue;
            }
            return o2.parent.getChildIndex(o2) - o1.parent.getChildIndex(o1);
        }
        return bl.length - al.length;
    }
    _getSort(layer) {
        let p = layer.parent, list = [layer];
        while (p && p !== 'root') {
            list.unshift(p);
            p = p.parent;
        }
        return list;
    }
}
let container = new LMouseEventContainer();
container.set(LMouseEvent.MOUSE_DOWN, true);
container.set(LMouseEvent.MOUSE_UP, true);
container.set(LMouseEvent.MOUSE_MOVE, true);
export default container;