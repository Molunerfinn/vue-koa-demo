import LDisplayObjectContainer from './LDisplayObjectContainer';
import { UNDEFINED, OS_PC } from '../utils/LConstant';
import { addChild } from '../utils/Function';
import LGraphics from './LGraphics';
import LPoint from '../geom/LPoint';
import LEvent from '../events/LEvent';
import LMouseEvent from '../events/LMouseEvent';
import lufylegend from '../ll';
class LSprite extends LDisplayObjectContainer {
  // stageRequired 是凡客添加的参数。
    constructor(stageRequired) {
        super();
        let s = this;
        s.type = 'LSprite';
        s.rotatex;
        s.rotatey;
        s.graphics = new LGraphics();
        s.graphics.parent = s;
        s.box2dBody = null;
        s.shapes = new Array();
        s.useCursor = null;
        if( stageRequired ){
          //添加对象到舞台
          addChild( s )
        }
    }

    setRotate(angle) {
        let s = this;
        if (s.box2dBody) {
            s.box2dBody.SetAngle(angle);
        } else {
            s.rotate = angle;
        }
    }
    _rotateReady() {
        let s = this;
        if (s.box2dBody) {
            if ((typeof s.rotatex) === UNDEFINED) {
                s.getRotateXY();
            }
            s.x = s.box2dBody.GetPosition().x * lufylegend.LGlobal.box2d.drawScale - s.parent.x - s.rotatex;
            s.y = s.box2dBody.GetPosition().y * lufylegend.LGlobal.box2d.drawScale - s.parent.y - s.rotatey;
            s.rotate = s.box2dBody.GetAngle();
        }
    }
    _ll_show(c) {
        let s = this;
        s.graphics.ll_show(c);
        lufylegend.LGlobal.show(s.childList, c);
        s._ll_debugShape(c);
    }
    startDrag(touchPointID) {
        let s = this;
        if (s.ll_dragStart) {
            return;
        }
        s.ll_touchPointID = touchPointID;
        s.ll_dragGlobalPoint = s.parent.localToGlobal(new LPoint(s.x, s.y));
        s.ll_dragMX = lufylegend.LGlobal.offsetX;
        s.ll_dragMY = lufylegend.LGlobal.offsetY;
        s.ll_dragStart = true;
        lufylegend.LGlobal.dragList.push(s);
    }
    stopDrag() {
        let s = this, i, l;
        for (i = 0, l = lufylegend.LGlobal.dragList.length; i < l; i++) {
            if (s.objectIndex === lufylegend.LGlobal.dragList[i].objectIndex) {
                s.ll_dragStart = false;
                lufylegend.LGlobal.dragList.splice(i, 1);
                break;
            }
        }
    }
    getRotateXY(w, h) {
        let s = this;
        if (!w || !h) {
            w = s.getWidth();
            h = s.getHeight();
        }
        s.rotatex = w / 2;
        s.rotatey = h / 2;
    }
    getWidth(maskSize) {
        let s = this, i, l, o, a, b, mx, mw,
            left = s.graphics.startX(), right = left + s.graphics.getWidth();
        for (i = 0, l = s.childList.length; i < l; i++) {
            o = s.childList[i];
            if (typeof o.visible === UNDEFINED || !o.visible) {
                continue;
            }
            a = o.x;
            if (typeof o._startX === 'function') {
                a = o._startX(maskSize);
            }
            b = a + o.getWidth(maskSize);
            if (a < left) {
                left = a;
            }
            if (b > right) {
                right = b;
            }
        }
        if (maskSize && s.mask) {
            mx = s.mask._startX ? s.mask._startX() : s.mask.startX();
            mw = s.mask.getWidth();
            if (left < mx) {
                left = mx;
            }
            if (right > mx + mw) {
                right = mx + mw;
            }
            s.ll_left = left;
            s.ll_right = right;
        } else {
            s.ll_left = s.x + left;
            s.ll_right = s.x + right;
        }
        return (right - left) * s.scaleX;
    }
    getHeight(maskSize) {
        let s = this, i, l, o, a, b, my, mh,
            top = s.graphics.startY(), bottom = top + s.graphics.getHeight();
        for (i = 0, l = s.childList.length; i < l; i++) {
            o = s.childList[i];
            if (typeof o.visible === UNDEFINED || !o.visible) {
                continue;
            }
            a = o.y;
            if (typeof o._startY === 'function') {
                a = o._startY(maskSize);
            }
            b = a + o.getHeight(maskSize);
            if (a < top) {
                top = a;
            }
            if (b > bottom) {
                bottom = b;
            }
        }
        if (maskSize && s.mask) {
            my = s.mask._startY ? s.mask._startY() : s.mask.startY();
            mh = s.mask.getHeight();
            if (top < my) {
                top = my;
            }
            if (bottom > my + mh) {
                bottom = my + mh;
            }
            s.ll_top = top;
            s.ll_bottom = bottom;
        } else {
            s.ll_top = s.y + top;
            s.ll_bottom = s.y + bottom;
        }
        return (bottom - top) * s.scaleY;
    }
    _startX(maskSize) {
        let s = this;
        s.getWidth(maskSize);
        return s.ll_left;
    }
    startX(maskSize) {
        let s = this;
        return s._startX(maskSize) * s.scaleX;
    }
    _startY(maskSize) {
        let s = this;
        s.getHeight(maskSize);
        return s.ll_top;
    }
    startY(maskSize) {
        let s = this;
        return s._startY(maskSize) * s.scaleY;
    }
    _ll_loopframe() {
        this.dispatchEvent(LEvent.ENTER_FRAME);
    }
    clone() {
        let s = this, a = new LSprite(), c, o, i, l;
        a.copyProperty(s);
        a.graphics = s.graphics.clone();
        a.graphics.parent = a;
        a.childList.length = 0;
        for (i = 0, l = s.childList.length; i < l; i++) {
            c = s.childList[i];
            if (c.clone) {
                o = c.clone();
                o.parent = a;
                a.childList.push(o);
            }
        }
        return a;
    }
    _mevent(type) {
        let s = this, k;
        for (k = 0; k < s.mouseList.length; k++) {
            let o = s.mouseList[k];
            if (o.type === type) {
                return true;
            }
        }
        return false;
    }
    ll_dispatchMouseEvent(type, e, cd, ox, oy) {
        let s = this, k;
        if (!s.mouseEnabled) {
            return;
        }
        for (k = 0; k < s.mouseList.length; k++) {
            let o = s.mouseList[k];
            if (o.type === type) {
                e.selfX = (ox - (s.x * cd.scaleX + cd.x)) / (cd.scaleX * s.scaleX);
                e.selfY = (oy - (s.y * cd.scaleY + cd.y)) / (cd.scaleY * s.scaleY);
                e.currentTarget = e.clickTarget = s;
                if (!e.target) {
                    e.target = s;
                }
                o.listener(e, s);
            }
        }
    }
    ll_mouseout(e, type, cd, ox, oy) {
        let s = this;
        if (type === LMouseEvent.MOUSE_MOVE && s.ll_mousein) {
            s.ll_mousein = false;
            if (s._mevent(LMouseEvent.MOUSE_OUT)) {
                s.ll_dispatchMouseEvent(LMouseEvent.MOUSE_OUT, e, cd, ox, oy);
            }
            if (s.mouseChildren) {
                for (let k = s.childList.length - 1; k >= 0; k--) {
                    if (s.childList[k].mouseEvent && s.childList[k].ll_mouseout) {
                        s.childList[k].ll_mouseout(e, type, cd, ox, oy);
                    }
                }
            }
        }
    }
    mouseEvent(e, type, cd) {
        if (!e) {
            return false;
        }
        let s = this, i, k, ox = e.offsetX, oy = e.offsetY, on, mc;
        if (!s.visible) {
            return false;
        }
        if (!cd) {
            cd = { x: 0, y: 0, scaleX: 1, scaleY: 1 };
        }
        on = s.ismouseon(e, cd);
        if (on) {
            if (lufylegend.LGlobal.os === OS_PC && s.useCursor && type === LMouseEvent.MOUSE_MOVE) {
                lufylegend.LGlobal.cursor = s.useCursor;
            }
            if (type === LMouseEvent.MOUSE_MOVE && !s.ll_mousein) {
                s.ll_mousein = true;
                if (s._mevent(LMouseEvent.MOUSE_OVER)) {
                    s.ll_dispatchMouseEvent(LMouseEvent.MOUSE_OVER, e, cd, ox, oy);
                }
            }
            if (s.mouseChildren) {
                mc = { x: s.x * cd.scaleX + cd.x, y: s.y * cd.scaleY + cd.y, scaleX: cd.scaleX * s.scaleX, scaleY: cd.scaleY * s.scaleY };
                for (k = s.childList.length - 1; k >= 0; k--) {
                    if (s.childList[k].mouseEvent) {
                        i = s.childList[k].mouseEvent(e, type, mc);
                        if (i) {
                            e.target = s.childList[k];
                            if (type !== LMouseEvent.MOUSE_MOVE) {
                                break;
                            }
                        }
                    }
                }
                if (s._mevent(type)) {
                    s.ll_dispatchMouseEvent(type, e, cd, ox, oy);
                }
            }
            return true;
        } else {
            s.ll_mouseout(e, type, cd, ox, oy);
        }
        return false;
    }
    hitTestPoint(x, y) {
        let s = this, shapes = s.shapes;
        if (!shapes || shapes.length === 0) {
            s.getWidth();
            s.getHeight();
            shapes = [{ 'type': lufylegend.LShape.RECT, 'arg': [s.ll_left - s.x, s.ll_top - s.y, s.ll_right - s.ll_left, s.ll_bottom - s.ll_top] }];
        }
        return s.ismouseonShapes(shapes, x, y);
    }
    hitTestObject(obj) {
        let s = this, shapes = s.shapes, shapes1 = obj.shapes, m, m1, j, child, j1, child1, vo1, v1;
        if (!shapes || shapes.length === 0) {
            s.getWidth();
            s.getHeight();
            shapes = [{ 'type': lufylegend.LShape.RECT, 'arg': [s.ll_left - s.x, s.ll_top - s.y, s.ll_right - s.ll_left, s.ll_bottom - s.ll_top] }];
        }
        if (!shapes1 || shapes1.length === 0) {
            obj.getWidth();
            obj.getHeight();
            shapes1 = [{ 'type': lufylegend.LShape.RECT, 'arg': [obj.ll_left - obj.x, obj.ll_top - obj.y, obj.ll_right - obj.ll_left, obj.ll_bottom - obj.ll_top] }];
        }
        m = s.getRootMatrix();
        m1 = obj.getRootMatrix();
        for (j = shapes.length - 1; j >= 0; j--) {
            child = shapes[j];
            v1 = s._changeShape(child.type, child.arg, m);
            for (j1 = shapes1.length - 1; j1 >= 0; j1--) {
                child1 = shapes1[j1];
                vo1 = obj._changeShape(child1.type, child1.arg, m1);
                if (child.type === lufylegend.LShape.VERTICES || child.type === lufylegend.LShape.RECT) {
                    if (child1.type === lufylegend.LShape.VERTICES || child1.type === lufylegend.LShape.RECT) {
                        if (lufylegend.LGlobal.hitTestPolygon(v1, vo1)) {
                            return true;
                        }
                    } else if (child1.type === lufylegend.LShape.ARC) {
                        if (lufylegend.LGlobal.hitTestPolygonArc(v1, vo1)) {
                            return true;
                        }
                    }
                } else {
                    if (child1.type === lufylegend.LShape.VERTICES || child1.type === lufylegend.LShape.RECT) {
                        if (lufylegend.LGlobal.hitTestPolygonArc(vo1, v1)) {
                            return true;
                        }
                    } else if (child1.type === lufylegend.LShape.ARC) {
                        if (Math.sqrt((v1[0] - vo1[0]) * (v1[0] - vo1[0]) + (v1[1] - vo1[1]) * (v1[1] - vo1[1])) < v1[2] + vo1[2]) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    addShape(type, arg) {
        let s = this;
        if (type === lufylegend.LShape.VERTICES && arg.length < 3) {
            return;
        }
        s.shapes.push({ 'type': type, 'arg': arg });
        return s.shapes;
    }
    addShapes(shapes) {
        let s = this;
        if (s.shapes.length === 0) {
            s.shapes = shapes;
        } else {
            s.shapes = s.shapes.concat(shapes);
        }
    }
    clearShape() {
        this.shapes = [];
    }
    _ll_debugShape(c) {
        let s = this, i, l, child, arg, j, ll;
        if (!lufylegend.LGlobal || !lufylegend.LGlobal.traceDebug || !s.shapes || s.shapes.length === 0) {
            return;
        }
        for (i = 0, l = s.shapes.length; i < l; i++) {
            child = s.shapes[i];
            c = c || lufylegend.LGlobal.canvas;
            arg = child.arg;
            c.beginPath();
            if (child.type === lufylegend.LShape.RECT) {
                c.rect(arg[0], arg[1], arg[2], arg[3]);
            } else if (child.type === lufylegend.LShape.ARC) {
                c.arc(arg[0], arg[1], arg[2], 0, 2 * Math.PI);
            } else if (child.type === lufylegend.LShape.VERTICES) {
                c.moveTo(arg[0][0], arg[0][1]);
                for (j = 1, ll = arg.length; j < ll; j++) {
                    c.lineTo(arg[j][0], arg[j][1]);
                }
                c.lineTo(arg[0][0], arg[0][1]);
            }
            c.closePath();
            c.strokeStyle = '#00FF00';
            c.stroke();
        }
    }
    ismouseon(e, cd) {
        let s = this;
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
        if (s.shapes && s.shapes.length > 0) {
            return s.ismouseonShapes(s.shapes, e.offsetX, e.offsetY);
        }
        let k, i = false, l = s.childList, sc = { x: s.x * cd.scaleX + cd.x, y: s.y * cd.scaleY + cd.y, scaleX: cd.scaleX * s.scaleX, scaleY: cd.scaleY * s.scaleY };
        for (k = l.length - 1; k >= 0; k--) {
            if (l[k].ismouseon) {
                i = l[k].ismouseon(e, sc);
            }
            if (i) {
                e.target = s.childList[k];
                break;
            }
        }
        if (!i) {
            i = s.graphics.ismouseon(e, sc);
        }
        return i;
    }
    die() {
        let s = this, i, c, l;
        s.graphics.clear();
        s.removeAllEventListener();
        s.stopDrag();
        if (s.box2dBody) {
            s.clearBody();
        }
        for (i = 0, c = s.childList, l = c.length; i < l; i++) {
            if (c[i].die) {
                c[i].die();
            }
        }
    }
    setBodyMouseJoint(value) {
        let s = this;
        if (!s.box2dBody) {
            return;
        }
        s.box2dBody.mouseJoint = value;
    }
    clearBody(value) {
        let s = this;
        if (!s.box2dBody) {
            return;
        }
        lufylegend.LGlobal.box2d.removeList.push(s.box2dBody);
        s.box2dBody = null;
    }
    addBodyCircle(radius, cx, cy, type, density, friction, restitution) {
        let s = this;
        s.rotatex = radius;
        s.rotatey = radius;
        s.box2dBody = lufylegend.LGlobal.box2d.addCircle(radius / lufylegend.LGlobal.box2d.drawScale, (s.x + cx) / lufylegend.LGlobal.box2d.drawScale, (s.y + cy) / lufylegend.LGlobal.box2d.drawScale, (type === 1) ? lufylegend.LGlobal.box2d.b2Body.b2_dynamicBody : lufylegend.LGlobal.box2d.b2Body.b2_staticBody, !density ? 0.5 : density, !friction ? 0.4 : friction, !restitution ? 0.8 : restitution);
        s.box2dBody.SetUserData(s);
    }
    addBodyPolygon(w, h, type, density, friction, restitution) {
        let s = this;
        s.rotatex = w / 2;
        s.rotatey = h / 2;
        s.box2dBody = lufylegend.LGlobal.box2d.addPolygon(w * 0.5 / lufylegend.LGlobal.box2d.drawScale, h * 0.5 / lufylegend.LGlobal.box2d.drawScale, s.x / lufylegend.LGlobal.box2d.drawScale, s.y / lufylegend.LGlobal.box2d.drawScale, (type === 1) ? lufylegend.LGlobal.box2d.b2Body.b2_dynamicBody : lufylegend.LGlobal.box2d.b2Body.b2_staticBody, !density ? 0.5 : density, !friction ? 0.4 : friction, !restitution ? 0.8 : restitution);
        s.box2dBody.SetUserData(s);
    }
    addBodyVertices(vertices, cx, cy, type, density, friction, restitution) {
        let s = this;
        s.rotatex = 0;
        s.rotatey = 0;
        s.box2dBody = lufylegend.LGlobal.box2d.addVertices(vertices, (type === 1) ? lufylegend.LGlobal.box2d.b2Body.b2_dynamicBody : lufylegend.LGlobal.box2d.b2Body.b2_staticBody, density, friction, restitution);
        s.box2dBody.SetUserData(s);
        s.box2dBody.SetPosition(new lufylegend.LGlobal.box2d.b2Vec2((s.x + cx) / lufylegend.LGlobal.box2d.drawScale, (s.y + cy) / lufylegend.LGlobal.box2d.drawScale));
    }
}
lufylegend.LSprite = LSprite;
export default LSprite;
