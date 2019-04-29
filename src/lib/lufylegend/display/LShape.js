
import LInteractiveObject from './LInteractiveObject';
import ll from '../ll';
class LShape extends LInteractiveObject {
    constructor() {
        super();
        this.type = 'LShape';
        this.graphics = new ll.LGraphics();
        this.graphics.parent = this;
    }

    _ll_show(c) {
        let s = this;
        s.graphics.ll_show(c);
    }
    getWidth(maskSize) {
        let s = this, mx, mw,
            left = s.graphics.startX(), right = left + s.graphics.getWidth();
        if (maskSize && s.mask) {
            mx = s.mask._startX ? s.mask._startX() : s.mask.startX();
            mw = s.mask.getWidth();
            if (left < mx) {
                left = mx;
            }
            if (right > mx + mw) {
                right = mx + mw;
            }
        }
        s.ll_left = s.x + left;
        s.ll_right = s.x + right;
        return (right - left) * s.scaleX;
    }
    getHeight(maskSize) {
        let s = this, my, mh,
            top = s.graphics.startY(), bottom = top + s.graphics.getHeight();
        if (maskSize && s.mask) {
            my = s.mask._startY ? s.mask._startY() : s.mask.startY();
            mh = s.mask.getHeight();
            if (top < my) {
                top = my;
            }
            if (bottom > my + mh) {
                bottom = my + mh;
            }
        }
        s.ll_top = s.y + top;
        s.ll_bottom = s.y + bottom;
        return (bottom - top) * s.scaleY;
    }
    _startX() {
        let s = this;
        s.getWidth();
        return s.ll_left;
    }
    startX() {
        let s = this;
        return s._startX() * s.scaleX;
    }
    _startY() {
        let s = this;
        s.getHeight();
        return s.ll_top;
    }
    startY() {
        let s = this;
        return s._startY() * s.scaleY;
    }
    clone() {
        let s = this, a = new LShape();
        a.copyProperty(s);
        a.graphics = s.graphics.clone();
        a.graphics.parent = a;
        return a;
    }
    ismouseon(e, cd) {
        let s = this, i = false, sc;
        if (!s.visible || !e) {
            return false;
        }
        if (s.mask) {
            if (!s.mask.parent) {
                s.mask.parent = s.parent;
            }
            if (!s.mask.ismouseon(e, cd)) {
                return false;
            }
        }
        sc = { x: s.x * cd.scaleX + cd.x, y: s.y * cd.scaleY + cd.y, scaleX: cd.scaleX * s.scaleX, scaleY: cd.scaleY * s.scaleY };
        if (s.graphics) {
            i = s.graphics.ismouseon(e, sc);
        }
        return i;
    }
    die() {
        let s = this;
        s.graphics.clear();
        //super.die();
    }

}

LShape.POINT = 'point';
LShape.LINE = 'line';
LShape.ARC = 'arc';
LShape.RECT = 'rect';
LShape.VERTICES = 'vertices';
ll.LShape = LShape;
export default LShape;
