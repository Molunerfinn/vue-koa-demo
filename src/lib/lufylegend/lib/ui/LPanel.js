import LSprite from '../../display/LSprite';
import LShape from '../../display/LShape';
import LBitmapData from '../../display/LBitmapData';
import LBitmap from '../../display/LBitmap';
import { UNDEFINED } from '../../utils/LConstant';
class LPanel extends LSprite {
    constructor(bitmapData, w, h, x1, x2, y1, y2, overlapping) {
        super();
        let s = this;
        s.type = 'LPanel';
        if (typeof overlapping === UNDEFINED) {
            overlapping = 0;
        }
        self.overlapping = overlapping;
        if (typeof bitmapData === 'string') {
            let d = new LShape();
            if (typeof w === UNDEFINED) {
                w = 20;
            }
            if (typeof h === UNDEFINED) {
                h = 20;
            }
            d.graphics.drawRoundRect(1, '#000000', [0, 0, w, h, w < 10 ? w * 0.5 : 5], true, bitmapData);
            bitmapData = new LBitmapData(null, 0, 0, w, h, LBitmapData.DATA_CANVAS);
            bitmapData.draw(d);
        }
        s.x1 = x1 ? x1 : bitmapData.width * 0.4;
        s.x2 = x2 ? x2 : bitmapData.width * 0.6;
        s.y1 = y1 ? y1 : bitmapData.height * 0.4;
        s.y2 = y2 ? y2 : bitmapData.height * 0.6;
        s.bitmapData = bitmapData;
        let ltData = new LBitmapData(bitmapData.image, bitmapData.x, bitmapData.y, s.x1, s.y1);
        let mtData = new LBitmapData(bitmapData.image, bitmapData.x + s.x1, bitmapData.y, s.x2 - s.x1, s.y1);
        let rtData = new LBitmapData(bitmapData.image, bitmapData.x + s.x2, bitmapData.y, bitmapData.width - s.x2, s.y1);
        let lmData = new LBitmapData(bitmapData.image, bitmapData.x, bitmapData.y + s.y1, s.x1, s.y2 - s.y1);
        let mmData = new LBitmapData(bitmapData.image, bitmapData.x + s.x1, bitmapData.y + s.y1, s.x2 - s.x1, s.y2 - s.y1);
        let rmData = new LBitmapData(bitmapData.image, bitmapData.x + s.x2, bitmapData.y + s.y1, bitmapData.width - s.x2, s.y2 - s.y1);
        let lbData = new LBitmapData(bitmapData.image, bitmapData.x, bitmapData.y + s.y2, s.x1, bitmapData.height - s.y2);
        let mbData = new LBitmapData(bitmapData.image, bitmapData.x + s.x1, bitmapData.y + s.y2, s.x2 - s.x1, bitmapData.height - s.y2);
        let rbData = new LBitmapData(bitmapData.image, bitmapData.x + s.x2, bitmapData.y + s.y2, bitmapData.width - s.x2, bitmapData.height - s.y2);
        s.ltBitmap = new LBitmap(ltData);
        s.addChild(s.ltBitmap);
        s.mtBitmap = new LBitmap(mtData);
        s.mtBitmap.x = s.x1 - overlapping;
        s.addChild(s.mtBitmap);
        s.rtBitmap = new LBitmap(rtData);
        s.addChild(s.rtBitmap);
		
        s.lmBitmap = new LBitmap(lmData);
        s.lmBitmap.y = s.y1 - overlapping;
        s.addChild(s.lmBitmap);
        s.mmBitmap = new LBitmap(mmData);
        s.mmBitmap.x = s.x1 - overlapping;
        s.mmBitmap.y = s.y1 - overlapping;
        s.addChild(s.mmBitmap);
        s.rmBitmap = new LBitmap(rmData);
        s.rmBitmap.y = s.y1 - overlapping;
        s.addChild(s.rmBitmap);
		
        s.lbBitmap = new LBitmap(lbData);
        s.addChild(s.lbBitmap);
        s.mbBitmap = new LBitmap(mbData);
        s.mbBitmap.x = s.x1 - overlapping;
        s.addChild(s.mbBitmap);
        s.rbBitmap = new LBitmap(rbData);
        s.addChild(s.rbBitmap);
		
        s.resize(w, h);
    }
    resize(w, h) {
        let s = this;
        s._ll_w = w;
        s._ll_h = h;
        s.rtBitmap.x = s.rmBitmap.x = s.rbBitmap.x = w - (s.bitmapData.width - s.x2);
        s.lbBitmap.y = s.mbBitmap.y = s.rbBitmap.y = h - (s.bitmapData.height - s.y2);
        s.lmBitmap.scaleY = s.mmBitmap.scaleY = s.rmBitmap.scaleY = (h - s.y1 - (s.bitmapData.height - s.y2) + self.overlapping * 2) / (s.y2 - s.y1);
        s.mtBitmap.scaleX = s.mmBitmap.scaleX = s.mbBitmap.scaleX = (w - s.x1 - (s.bitmapData.width - s.x2) + self.overlapping * 2) / (s.x2 - s.x1);
    }
    getSize() {
        return { width: this._ll_w, height: this._ll_h };
    }
    clone() {
        let panel = new LPanel(this.bitmapData.clone(), this._ll_w, this._ll_h, this.x1, this.x2, this.y1, this.y2, this.overlapping);
        panel.copyProperty(this);
        return panel;
    }
}
export default LPanel;
