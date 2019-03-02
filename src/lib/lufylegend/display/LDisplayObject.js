import LEventDispatcher from '../events/LEventDispatcher';
import LTransform from '../geom/LTransform';
import LMatrix from '../geom/LMatrix';
import LPoint from '../geom/LPoint';
import LRectangle from '../geom/LRectangle';
import { UNDEFINED } from '../utils/LConstant';
import ll from '../ll';
class LDisplayObject extends LEventDispatcher {
    constructor() {
        super();
        let s = this;
        s.name = 'instance' + s.objectIndex;
        s.x = 0;
        s.y = 0;
        s.width = 0;
        s.height = 0;
        s.scaleX = 1;
        s.scaleY = 1;
        s.alpha = 1;
        s.visible = true;
        s.rotate = 0;
        s.blendMode = null;
        s.filters = null;
        s.transform = new LTransform();
        s.parent = null;
        s.mask = null;
    }

    _createCanvas() {
        let s = this;
        if (!s._canvas) {
            s._canvas = document.createElement('canvas');
            s._context = s._canvas.getContext('2d');
        }
    }
    ll_show(c) {
        let s = this;
        c = c || ll.LGlobal.canvas;
        if (!s._canShow()) {
            return;
        }
        s._ll_trans = false;
        if (!ll.LGlobal.box2d && typeof s._ll_loopframe === 'function') {
            s._ll_loopframe();
        }
        c.save();
        s._showReady(c);
        if (s.blendMode) {
            c.globalCompositeOperation = s.blendMode;
        }
        if (s.filters) {
            s._ll_setFilters(c);
        }
        s._rotateReady();
        if (s.mask && s.mask.ll_show && !s._ll_cacheAsBitmap) {
            s.mask.ll_show(c);
            c.clip();
        }
        s._transformRotate(c);
        s._transformScale(c);
        s._coordinate(c);
        if (s.transform.matrix) {
            s.transform.matrix.transform(c);
        }
        if (s.alpha < 1) {
            s._ll_trans = true;
            c.globalAlpha *= s.alpha;
        }
        if (ll.LGlobal.fpsStatus) {
            ll.LGlobal.fpsStatus.display++;
            if (s._ll_trans) {
                ll.LGlobal.fpsStatus.transform++;
            }
        }
        if (s._ll_cacheAsBitmap) {
            s._ll_cacheAsBitmap._ll_show(c);
        } else {
            s._ll_show(c);
        }
        c.restore();
        if (ll.LGlobal.box2d && typeof s._ll_loopframe === 'function') {
            s._ll_loopframe();
        }
    }
    _canShow() {
        return this.visible;
    }
    _coordinate(c) {
        let s = this;
        if (s.x !== 0 || s.y !== 0) {
            s._ll_trans = true;
            c.transform(1, 0, 0, 1, s.x, s.y);
        }
    }
    _rotateReady() {}
    _showReady(c) {}
    _ll_show(c) {}
    _ll_setFilters(c) {
        let s = this, f = s.filters, i, l;
        if (!f) {
            return;
        }
        for (i = 0, l = f.length; i < l; i++) {
            f[i].ll_show(s, c);
        }
    }
    startX() {
        return 0;
    }
    startY() {
        return 0;
    }
    getWidth(maskSize) {
        return 1;
    }
    getHeight(maskSize) {
        return 1;
    }
    _transformRotate(c) {
        let s = this, rotateObj, rotateFlag;
        c = c || ll.LGlobal.canvas;
        if (s.rotate === 0) {
            return;
        }
        s._ll_trans = true;
        rotateFlag = Math.PI / 180, rotateObj = new LMatrix();
        if ((typeof s.rotatex) === UNDEFINED) {
            s.rotatex = 0;
            s.rotatey = 0;
        }
        if (s.box2dBody) {
            rotateFlag = 1;
        }
        rotateObj.a = Math.cos(s.rotate * rotateFlag);
        rotateObj.b = Math.sin(s.rotate * rotateFlag);
        rotateObj.c = -rotateObj.b;
        rotateObj.d = rotateObj.a;
        rotateObj.tx = s.x + s.rotatex;
        rotateObj.ty = s.y + s.rotatey;
        rotateObj.transform(c).setTo(1, 0, 0, 1, -rotateObj.tx, -rotateObj.ty).transform(c);
    }
    _transformScale(c) {
        let s = this, scaleObj;
        c = c || ll.LGlobal.canvas;
        if (s.scaleX === 1 && s.scaleY === 1) {
            return;
        }
        s._ll_trans = true;
        scaleObj = new LMatrix();
        if (s.scaleX !== 1) {
            scaleObj.tx = s.x;
        }
        if (s.scaleY !== 1) {
            scaleObj.ty = s.y;
        }
        scaleObj.a = s.scaleX;
        scaleObj.d = s.scaleY;
        scaleObj.transform(c).setTo(1, 0, 0, 1, -scaleObj.tx, -scaleObj.ty).transform(c);
    }
    getAbsoluteScale() {
        let s = this, sX, sY, p;
        sX = s.scaleX;
        sY = s.scaleY;
        p = s.parent;
        while (p && p !== 'root') {
            sX *= p.scaleX;
            sY *= p.scaleY;
            p = p.parent;
        }
        return { scaleX: sX, scaleY: sY };
    }
    getRootCoordinate() {
        return this.localToGlobal(new LPoint(0, 0));
    }
    localToGlobal(point) {
        let s = this, m, p;
        m = s.getRootMatrix();
        p = m.toArray([point.x, point.y, 1]);
        return new LPoint(p[0], p[1]);
    }
    globalToLocal(point) {
        let s = this, p, m;
        m = s.getLocalMatrix();
        p = m.toArray([point.x, point.y, 1]);
        return new LPoint(p[0], p[1]);
    }
    getBounds(d) {
        if (typeof d === UNDEFINED) {
            return new LRectangle(0, 0, 0, 0);
        }
        let s = this, x = 0, y = 0, w = 0, h = 0, sp, dp;
        if (s.objectIndex !== d.objectIndex) {
            sp = s.getRootCoordinate();
            dp = d.getRootCoordinate();
            x = sp.x - dp.x;
            y = sp.y - dp.y;
        }
        w = s.getWidth(true);
        h = s.getHeight(true);
        return new LRectangle(x, y, w, h);
    }
    cacheAsBitmap(value) {
        let s = this;
        if (!value) {
            s._ll_cacheAsBitmap = null;
            return;
        }
        let sx = s.x - s.startX(true), sy = s.y - s.startY(true);
        let data = s.getDataCanvas(sx, sy, s.getWidth(true), s.getHeight(true));
        let b = new ll.LBitmapData(data, 0, 0, null, null, ll.LBitmapData.DATA_CANVAS);
        let cache = new ll.LBitmap(b);
        cache.x = -sx;
        cache.y = -sy;
        s._ll_cacheAsBitmap = cache;
    }
    getDataCanvas(x, y, w, h) {
        let s = this, _x, _y;
        s._createCanvas();
        _x = s.x;
        _y = s.y;
        s.x = x || 0;
        s.y = y || 0;
        s.width = w || s.getWidth();
        s.height = h || s.getHeight();
        s._canvas.width = s.width;
        s._canvas.height = s.height;
        let mx, my;
        if (s.mask) {
            mx = s.mask.x;
            my = s.mask.y;
            s.mask.x += (s.x - _x);
            s.mask.y += (s.y - _y);
        }
        s.ll_show(s._context);
        s.x = _x;
        s.y = _y;
        if (s.mask) {
            s.mask.x = mx;
            s.mask.y = my;
        }
        return s._canvas;
    }
    getDataURL() {
        let s = this;
        let sx = s.x - s.startX(true), sy = s.y - s.startY(true);
        let r = s.getDataCanvas(sx, sy, s.getWidth(true), s.getHeight(true));
        return r.toDataURL.apply(r, arguments);
    }
    getParentByConstructor(value) {
        let parent = this.parent;
        while (typeof parent === 'object') {
            if (parent instanceof value) {
                return parent;
            }
            parent = parent.parent;
        }
        return null;
    }
    ismouseonShapes(shapes, mx, my) {
        let s = this, m, child, j, v, arg;
        if (typeof shapes === UNDEFINED) {
            shapes = s.shapes;
        }
        m = s.getRootMatrix();
        for (j = shapes.length - 1; j >= 0; j--) {
            child = shapes[j];
            arg = child.arg;
            v = s._changeShape(child.type, arg, m);
            if (child.type === ll.LShape.VERTICES) {
                if (ll.LGlobal.hitPolygon(v, mx, my)) {
                    return true;
                }
            } else if (child.type === ll.LShape.RECT) {
                if (ll.LGlobal.hitPolygon(v, mx, my)) {
                    return true;
                }
            } else if (child.type === ll.LShape.ARC) {
                if ((v[0] - mx) * (v[0] - mx) + (v[1] - my) * (v[1] - my) < v[3]) {
                    return true;
                }
            }
        }
        return false;
    }
    _changeShape(type, arg, m) {
        let v, r2, i, l, v1, v2;
        if (type === ll.LShape.VERTICES) {
            v = [];
            for (i = 0, l = arg.length; i < l; i++) {
                v[i] = m.toArray([arg[i][0], arg[i][1], 1]);
            }
        } else if (type === ll.LShape.RECT) {
            v = [[arg[0], arg[1]], [arg[0] + arg[2], arg[1]], [arg[0] + arg[2], arg[1] + arg[3]], [arg[0], arg[1] + arg[3]]];
            for (i = 0, l = v.length; i < l; i++) {
                v[i] = m.toArray([v[i][0], v[i][1], 1]);
            }
        } else if (type === ll.LShape.ARC) {
            v1 = m.toArray([arg[0], arg[1], 1]);
            v2 = m.toArray([arg[0] + arg[2], arg[1], 1]);
            r2 = (v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]);
            v = [v1[0], v1[1], Math.sqrt(r2), r2];
        }
        return v;
    }
    getRootMatrix() {
        let parent = this, m = new LMatrix();
        while (parent && parent !== 'root') {
            if (parent.scaleX !== 1 || parent.scaleY !== 1) {
                m.scale(parent.scaleX, parent.scaleY);
            }
            if (parent.rotate !== 0) {
                m.rotate(parent.rotate);
            }
            if (parent.x !== 0 || parent.y !== 0) {
                m.translate(parent.x, parent.y);
            }
            parent = parent.parent;
        }
        return m;
    }
    getLocalMatrix() {
        let parent = this, m = new LMatrix(), list = [];
        while (parent && parent !== 'root') {
            list.push(parent);
            parent = parent.parent;
        }
        for (let i = list.length - 1; i >= 0; i--) {
            parent = list[i];
            if (parent.x !== 0 || parent.y !== 0) {
                m.translate(-parent.x, -parent.y);
            }
            if (parent.rotate !== 0) {
                m.rotate(-parent.rotate);
            }
            if (parent.scaleX !== 1 || parent.scaleY !== 1) {
                m.scale(1 / parent.scaleX, 1 / parent.scaleY);
            }
        }
        return m;
    }
    remove() {
        let s = this, p = s.parent;
        if (!p || p === 'root') {
            return;
        }
        p.removeChild(s);
        s._ll_removeFromSelf = true;
    }
}
ll.LDisplayObject = LDisplayObject;
export default LDisplayObject;
