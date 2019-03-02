import LObject from '../utils/LObject';
import LRectangle from '../geom/LRectangle';
import { UNDEFINED } from '../utils/LConstant';
class LQuadTree extends LObject {
    constructor(rect) {
        super();
        let s = this;
        s.q1 = null;
        s.q2 = null;
        s.q3 = null;
        s.q4 = null;
        s.parent = null;
        s.data = [];
        s.rect = rect;
        s.root = s;
    }
    createChildren(deep) {
        if (deep === 0) {
            return;
        }
        let s = this;
        let hw = s.rect.width / 2, hh = s.rect.height / 2;
        s.q1 = new LQuadTree(new LRectangle(s.rect.x + hw, s.rect.y, hw, hh));
        s.q2 = new LQuadTree(new LRectangle(s.rect.x + hw, s.rect.y + hh, hw, hh));
        s.q3 = new LQuadTree(new LRectangle(s.rect.x, s.rect.y + hh, hw, hh));
        s.q4 = new LQuadTree(new LRectangle(s.rect.x, s.rect.y, hw, hh));
        s.q1.parent = s.q2.parent = s.q3.parent = s.q4.parent = s;
        s.q1.root = s.q2.root = s.q3.root = s.q4.root = s.root;
        s.q1.createChildren(deep - 1);
        s.q2.createChildren(deep - 1);
        s.q3.createChildren(deep - 1);
        s.q4.createChildren(deep - 1);
    }
    hasChildren() {
        let s = this;
        return s.q1 && s.q2 && s.q3 && s.q4;
    }
    clear() {
        let s = this;
        if (s.hasChildren()) {
            return s.q1.clear() || s.q2.clear() || s.q3.clear() || s.q4.clear();
        } else {
            s.q1 = null;
            s.q2 = null;
            s.q3 = null;
            s.q4 = null;
            s.parent = null;
            s.data = [];
            return s;
        }
    }
    add(v, x, y) {
        let s = this;
        if (!s.isIn(x, y)) {
            return null;
        }

        if (s.hasChildren()) {
            return s.q1.add(v, x, y) || s.q2.add(v, x, y) || s.q3.add(v, x, y) || s.q4.add(v, x, y);
        } else {
            s.data.push(v);
            return s;
        }
    }
    remove(v, x, y) {
        let s = this;
        if (!s.isIn(x, y)) {
            return null;
        }

        if (s.hasChildren()) {
            return s.q1.remove(v, x, y) || s.q2.remove(v, x, y) || s.q3.remove(v, x, y) || s.q4.remove(v, x, y);
        } else {
            let index = s.data.indexOf(v);
            if (index !== -1) {
                s.data.splice(index, 1);
                return s;
            } else {
                return null;
            }
        }
    }
    isIn(x, y) {
        let s = this;
        return (typeof x === UNDEFINED || (x >= s.rect.x && x < s.rect.right)) && (typeof y === UNDEFINED || (y >= s.rect.y && y < s.rect.bottom));
    }
    getDataInRect(rect) {
        let s = this;
        if (!s.rect.intersects(rect)) {
            return [];
        }

        let r = s.data.concat();
        if (s.hasChildren()) {
            r.push.apply(r, s.q1.getDataInRect(rect));
            r.push.apply(r, s.q2.getDataInRect(rect));
            r.push.apply(r, s.q3.getDataInRect(rect));
            r.push.apply(r, s.q4.getDataInRect(rect));
        }
        return r;
    }
}
export default LQuadTree;