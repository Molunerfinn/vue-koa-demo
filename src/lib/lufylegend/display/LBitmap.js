import LDisplayObject from './LDisplayObject';
import LShape from './LShape'
import ll from '../ll';
class LBitmap extends LDisplayObject {
    // 扩展，添加, x, y, width, height
    constructor(bitmapdata, x, y, width, height) {
        super();
        this.type = 'LBitmap';
        this.rotateCenter = true;
        this.bitmapData = bitmapdata;
        if (this.bitmapData) {
          this.width = width || this.bitmapData.width;
          this.height = height || this.bitmapData.height;
          this.x = x || 0;
          this.y = y || 0;
          //  this.width = this.bitmapData.width;
          //  this.height = this.bitmapData.height;
        }
    }

    _canShow() {
        return (this.visible && this.bitmapData);
    }
    _rotateReady() {
        let s = this;
        if (s.rotate !== 0 && s.rotateCenter) {
            s.rotatex = s.getWidth() * 0.5;
            s.rotatey = s.getHeight() * 0.5;
        } else {
            s.rotatex = s.rotatey = 0;
        }
    }
    _coordinate(c) {}
    _ll_show(c) {
        this.ll_draw(c);
    }
    ll_draw(c) {
        let s = this;
        if (ll.LGlobal.fpsStatus) {
            ll.LGlobal.fpsStatus.bitmapData++;
        }
        c.drawImage(s.bitmapData.image,
            s.bitmapData.x,
            s.bitmapData.y,
            s.bitmapData.width,
            s.bitmapData.height,
            s.x,
            s.y,
            s.width, // 使用bitmap.width 实现缩放
            s.height // 使用bitmap.height 实现缩放
        );
    }
    clone() {
        let s = this, a = new LBitmap(s.bitmapData.clone());
        a.copyProperty(s);
        a.rotateCenter = s.rotateCenter;
        return a;
    }
    ismouseon(e, cood) {
        let s = this;
        if (!e) {
            return false;
        }
        if (!s.visible || !s.bitmapData) {
            return false;
        }
        if (s.mask) {
            if (!s.mask.parent) {
                s.mask.parent = s.parent;
            }
            if (!s.mask.ismouseon(e, cood)) {
                return false;
            }
        }
        return s.ismouseonShapes([{ type: LShape.RECT, arg: [0, 0, s.bitmapData.width, s.bitmapData.height] }], e.offsetX, e.offsetY);
    }
    getWidth(maskSize) {
        let s = this, w, mx, mw;
        w = s.bitmapData ? s.bitmapData.width * (s.scaleX > 0 ? s.scaleX : -s.scaleX) : 0;
        if (maskSize && s.mask) {
            mx = s.mask._startX ? s.mask._startX() : s.mask.startX();
            if (mx > w) {
                return 0;
            }
            mw = s.mask.getWidth();
            if (mx + mw > w) {
                return w - mx;
            } else {
                return mw;
            }
        }
        return w;
    }
    getHeight(maskSize) {
        let s = this, h, my, mh;
        h = s.bitmapData ? s.bitmapData.height * (s.scaleY > 0 ? s.scaleY : -s.scaleY) : 0;
        if (maskSize && s.mask) {
            my = s.mask._startY ? s.mask._startY() : s.mask.startY();
            if (my > h) {
                return 0;
            }
            mh = s.mask.getHeight();
            if (my + mh > h) {
                return h - my;
            } else {
                return mh;
            }
        }
        return h;
    }
    startX() {
        return this.x;
    }
    startY() {
        return this.y;
    }
    die() {}
}
ll.LBitmap = LBitmap;
export default LBitmap;
