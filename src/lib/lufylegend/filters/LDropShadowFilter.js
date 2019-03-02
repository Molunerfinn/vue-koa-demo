import LBitmapFilter from './LBitmapFilter';
import LGlobal from '../utils/LGlobal';
class LDropShadowFilter extends LBitmapFilter {
    constructor(distance, angle, color, blur) {
        super();
        this.type = 'LDropShadowFilter';
        this.distance = distance ? distance : 0;
        this.angle = angle ? angle : 0;
        this.shadowColor = color ? color : '#000000';
        this.shadowBlur = blur ? blur : 20;
        this.setShadowOffset();
    }
    setShadowOffset() {
        let s = this;
        let a = s.angle * Math.PI / 180;
        s.shadowOffsetX = s.distance * Math.cos(a);
        s.shadowOffsetY = s.distance * Math.sin(a);
    }
    ll_show(o, c) {
        let s = this;
        c = c || LGlobal.canvas;
        c.shadowColor = s.shadowColor;
        c.shadowBlur = s.shadowBlur;
        c.shadowOffsetX = s.shadowOffsetX;
        c.shadowOffsetY = s.shadowOffsetY;
    }
    setDistance(distance) {
        this.distance = distance;
        this.setShadowOffset();
    }
    setAngle(angle) {
        this.angle = angle;
        this.setShadowOffset();
    }
    setColor(color) {
        this.shadowColor = color;
    }
    setBlur(blur) {
        this.shadowBlur = blur;
    }
}
export default LDropShadowFilter;