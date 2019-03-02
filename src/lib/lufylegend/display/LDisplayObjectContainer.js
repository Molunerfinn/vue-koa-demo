import LInteractiveObject from './LInteractiveObject';
import ll from '../ll';
class LDisplayObjectContainer extends LInteractiveObject {
    constructor() {
        super();
        this.childList = [];
        this.numChildren = 0;
        this.mouseChildren = true;
    }
    addChild(d) {
        let s = this, t;
        if (d.parent) {
            t = ll.LGlobal.destroy;
            ll.LGlobal.destroy = false;
            d.parent.removeChild(d);
            ll.LGlobal.destroy = t;
        }
        d.parent = s;
        s.childList.push(d);
        s.numChildren = s.childList.length;
        s._ll_removeFromSelf = false;
        return d;
    }
    addChildAt(d, i) {
        let s = this, t;
        if (i < 0 || i > s.childList.length) {
            return;
        }
        if (typeof d.remove === 'function') {
            t = ll.LGlobal.destroy;
            ll.LGlobal.destroy = false;
            d.remove();
            ll.LGlobal.destroy = t;
        }
        d.parent = s;
        s.childList.splice(i, 0, d);
        s.numChildren = s.childList.length;
        s._ll_removeFromSelf = false;
        return d;
    }
    removeChild(d) {
        let s = this, c = s.childList, i, l;
        for (i = 0, l = c.length; i < l; i++) {
            if (d.objectIndex === c[i].objectIndex) {
                LDisplayObjectContainer.destroy(d);
                s.childList.splice(i, 1);
                break;
            }
        }
        s.numChildren = s.childList.length;
        delete d.parent;
        ll.LTweenLite.removeTarget(d);
    }
    getChildAt(i) {
        let s = this, c = s.childList;
        if (c.length === 0 || c.length <= i) {
            return null;
        }
        return c[i];
    }
    getChildByName(n) {
        let s = this, c = s.childList, i, l;
        for (i = 0, l = c.length; i < l; i++) {
            if (!c[i]) {
                continue;
            }
            if (c[i].name === n) {
                return c[i];
            }
        }
        return null;
    }
    removeChildAt(i) {
        let s = this, c = s.childList, d;
        if (c.length <= i || i < 0) {
            return;
        }
        d = c[i];
        LDisplayObjectContainer.destroy(d);
        s.childList.splice(i, 1);
        delete d.parent;
        ll.LTweenLite.removeTarget(d);
        s.numChildren = s.childList.length;
        return d;
    }
    getChildIndex(child) {
        if (!child) {
            return -1;
        }
        let s = this, c = s.childList, i, l = c.length;
        for (i = 0; i < l; i++) {
            if (c[i].objectIndex === child.objectIndex) {
                return i;
            }
        }
        return -1;
    }
    setChildIndex(child, index) {
        let s = this, c = s.childList, i, l = c.length;
        if (child.parent === 'root' || child.parent.objectIndex !== s.objectIndex || index < 0 || index >= l) {
            return -1;
        }
        for (i = 0; i < l; i++) {
            if (c[i].objectIndex === child.objectIndex) {
                break;
            }
        }
        s.childList.splice(i, 1);
        s.childList.splice(index, 0, child);
        return index;
    }
    resize() {
        let s = this;
        s.width = s.getWidth();
        s.height = s.getHeight();
    }
    removeAllChild() {
        let s = this, c = s.childList, i, l;
        for (i = 0, l = c.length; i < l; i++) {
            let d = c[i];
            LDisplayObjectContainer.destroy(d);
            delete d.parent;
            ll.LTweenLite.removeTarget(d);
        }
        s.childList.length = 0;
        s.width = 0;
        s.height = 0;
        s.numChildren = 0;
    }
}

LDisplayObjectContainer.destroy = function(d) {
    if (!ll.LGlobal.destroy) {
        return;
    }
    if (d.die) {
        d.die();
    }
    if (d.removeAllChild) {
        d.removeAllChild();
    }
};
export default LDisplayObjectContainer;