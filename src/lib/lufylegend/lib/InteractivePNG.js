import LSprite from '../display/LSprite';
import { UNDEFINED } from '../utils/LConstant';
class InteractivePNG extends LSprite {
    hitTestPoint(x, y, cd) {
        let self = this;
        let point = self.getRootCoordinate();
        point.x = x - point.x;
        point.y = y - point.y;
        if (typeof cd !== UNDEFINED) {
            point.x /= (cd.scaleX * self.scaleX);
            point.y /= (cd.scaleY * self.scaleY);
        }
        for (let i = 0, l = self.childList.length; i < l; i++) {
            let child = self.childList[0];
            if (!child.bitmapData._locked) {
                child.bitmapData.lock();
            }
            let cx = point.x - child.x;
            let cy = point.y - child.y;
            if (cx < 0 || cx > child.bitmapData.width || cy < 0 || cy > child.bitmapData.height) {
                continue;
            }
            let pixel = child.bitmapData.getPixel(point.x - child.x, point.y - child.y);
            if (pixel && (pixel[0] > 0 || pixel[1] > 0 || pixel[2] > 0 || pixel[3] > 0)) {
                return true;
            }
        }
        return false;
    }
    ismouseon(e, cd) {
        return this.hitTestPoint(e.offsetX, e.offsetY, cd);
    }
    addChild(d) {
        if (d.type !== 'LBitmap') {
            console.error('Only support LBitmap！');
            return;
        }
        /*为了保证hitTestPoint的效率，提前将bitmapData锁定*/
        d.bitmapData.lock();
        super.addChild(d);
    }
    addChildAt(d, i) {
        if (d.type !== 'LBitmap') {
            console.error('Only support LBitmap！');
            return;
        }
        /*为了保证hitTestPoint的效率，提前将bitmapData锁定*/
        d.bitmapData.lock();
        super.addChildAt(d, i);
    }
}
export default InteractivePNG;
