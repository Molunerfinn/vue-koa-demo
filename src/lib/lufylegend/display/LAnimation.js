import LSprite from './LSprite';
import LEvent from '../events/LEvent';
import { UNDEFINED } from '../utils/LConstant';
import lufylegend from '../ll';
class LAnimation extends LSprite {
    constructor(layer, data, list) {
        super();
        this.type = 'LAnimation';
        this.rowIndex = 0;
        this.colIndex = 0;
        this._ll_stepIndex = 0;
        this._ll_stepArray = [];
        this.mode = 1;
        this.isMirror = false;
        if (Array.isArray(data)) {
            this.bitmapList = data;
        } else {
            this.bitmapList = [data];
        }
        this.bitmap = new lufylegend.LBitmap(this.bitmapList[0]);
        this.imageArray = list;
        this.addChild(this.bitmap);
        if (layer) {
            layer.addChild(this);
        }
        this.onframe();
        this.colIndex = 0;
    }

    setAction(rowIndex, colIndex, mode, isMirror) {
        let s = this, changed = false;
        if (typeof rowIndex !== UNDEFINED && rowIndex >= 0 && rowIndex < s.imageArray.length) {
            s.rowIndex = rowIndex;
            changed = true;
        }
        if (typeof colIndex !== UNDEFINED && colIndex >= 0 && colIndex < s.imageArray[rowIndex].length) {
            s.colIndex = colIndex;
            changed = true;
        }
        if (typeof mode !== UNDEFINED) {
            s.mode = mode;
            changed = true;
        }
        if (typeof isMirror !== UNDEFINED) {
            s.isMirror = isMirror;
            if (s.isMirror) {
                s.bitmap.x = s.bitmap.getWidth();
                s.bitmap.scaleX = -1 * Math.abs(s.bitmap.scaleX);
            } else {
                s.bitmap.x = 0;
                s.bitmap.scaleX = Math.abs(s.bitmap.scaleX);
            }
            changed = true;
        }
        if (changed) {
            s._ll_stepIndex = 0;
            s._send_complete = false;
        }
    }
    getAction() {
        let s = this;
        return [s.rowIndex, s.colIndex, s.mode, s.isMirror];
    }
    onframe() {
        let s = this, arr, sx = 0, stepFrame = null;
        if (s.colIndex >= s.imageArray[s.rowIndex].length) {
            s.colIndex = 0;
        }
        arr = s.imageArray[s.rowIndex][s.colIndex];
        if (s._ll_stepArray[s.rowIndex] && s._ll_stepArray[s.rowIndex][s.colIndex]) {
            stepFrame = s._ll_stepArray[s.rowIndex][s.colIndex];
        } else {
            stepFrame = 0;
        }
        if (s._ll_stepIndex === 0) {
            if (typeof arr.dataIndex === 'number' && Array.isArray(s.bitmapList) && arr.dataIndex < s.bitmapList.length) {
                s.bitmap.bitmapData = s.bitmapList[arr.dataIndex];
            }
            if (arr.script) {
                for (let i = 0; i < arr.script.length; i++) {
                    let obj = arr.script[i];
                    let l = s.ll_labelList[obj.name];
                    if (l && l.rowIndex === s.rowIndex && l.colIndex === s.colIndex && l.mode === s.mode && l.isMirror === (s.bitmap.scaleX === -1)) {
                        obj.func(s, obj.params);
                    }
                }
            }
            if (typeof arr.width !== UNDEFINED && typeof arr.height !== UNDEFINED) {
                s.bitmap.bitmapData.setProperties(arr.x, arr.y, arr.width, arr.height);
            } else {
                s.bitmap.bitmapData.setCoordinate(arr.x, arr.y);
            }
            if (typeof arr.sx !== UNDEFINED) {
                sx = arr.sx;
            }
            if (typeof arr.sy !== UNDEFINED) {
                s.bitmap.y = arr.sy;
            }
            if (typeof arr.mirror !== UNDEFINED) {
                s.bitmap.rotateCenter = false;
                s.bitmap.scaleX = arr.mirror ? -1 : 1;
            }
            s.bitmap.x = sx + (s.bitmap.scaleX === 1 ? 0 : s.bitmap.getWidth());
        }
        if (s._ll_stepIndex++ < stepFrame) {
            return;
        }
        s._ll_stepIndex = 0;
        s.colIndex += s.mode;
        if (s.colIndex >= s.imageArray[s.rowIndex].length || s.colIndex < 0) {
            s.colIndex = s.mode > 0 ? 0 : s.imageArray[s.rowIndex].length - 1;
            //TODO::
            if (s.constructor.name === 'LAnimationTimeline') {
                s._send_complete = true;
            } else {
                s.dispatchEvent(LEvent.COMPLETE);
            }
        }
    }
    clone() {
        let s = this, a = new s.constructor(null, s.bitmapList, s.imageArray.slice(0));
        a.copyProperty(s);
        a.childList.length = 0;
        a.bitmap = s.bitmap.clone();
        a.addChild(a.bitmap);
        return a;
    }
}
export default LAnimation;
