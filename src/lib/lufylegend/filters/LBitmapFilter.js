import LObject from '../utils/LObject';
import LGlobal from '../utils/LGlobal';
import LBitmap from '../display/LBitmap';
import LRectangle from '../geom/LRectangle';
import LPoint from '../geom/LPoint';
class LBitmapFilter extends LObject {
    constructor() {
        super();
        this.type = 'LBitmapFilter';
    }
    ll_show(displayObject, c) {
        let s = this;
        if (s.cacheMaking) {
            return;
        }
        c = c || LGlobal.canvas;
        let d = displayObject, bitmapData;
        if (d instanceof LBitmap) {
            bitmapData = d.bitmapData;
        } else {
            if (!d._ll_cacheAsBitmap) {
                s.cacheMaking = true;
                d.cacheAsBitmap(true);
                s.cacheMaking = false;
            }
            bitmapData = d._ll_cacheAsBitmap.bitmapData;
        }
        if (s.bitmapDataIndex === bitmapData.objectIndex) {
            return;
        }
        s.bitmapDataIndex = bitmapData.objectIndex;
        bitmapData.applyFilter(bitmapData, new LRectangle(0, 0, bitmapData.width, bitmapData.height), new LPoint(0, 0), s, c);
    }
}
export default LBitmapFilter;