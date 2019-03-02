import LAnimation from './LAnimation';
import LEvent from '../events/LEvent';
import { UNDEFINED } from '../utils/LConstant';
class LAnimationTimeline extends LAnimation {
    constructor(data, list) {
        super(null, data, list);
        let s = this;
        s.type = 'LAnimationTimeline';
        s.speed = 0;
        s._speedIndex = 0;
        s.ll_labelList = {};
        for (let i = 0, sublist, j, child; i < list.length; i++) {
            sublist = list[i];
            for (j = 0; j < sublist.length; j++) {
                child = sublist[j];
                if (child.label) {
                    s.setLabel(child.label, i, j, 1, child.isMirror ? true : false);
                }
            }
        }
        s.addEventListener(LEvent.ENTER_FRAME, s._ll_onframe);
    }

    clone() {
        let s = this, k, o, a = new s.constructor(s.bitmapList, s.imageArray.slice(0));
        a.copyProperty(s);
        a.childList.length = 0;
        a.bitmap = s.bitmap.clone();
        a.addChild(a.bitmap);
        for (k in s.ll_labelList) {
            o = s.ll_labelList[k];
            a.ll_labelList[k] = {
                rowIndex: o.rowIndex,
                colIndex: o.colIndex,
                mode: o.mode,
                isMirror: o.isMirror
            };
        }
        return a;
    }
    setFrameSpeedAt(rowIndex, colIndex, speed) {
        let s = this;
        if (!s._ll_stepArray[rowIndex]) {
            s._ll_stepArray[rowIndex] = [];
        }
        s._ll_stepArray[rowIndex][colIndex] = speed;
    }
    _ll_onframe(event) {
        let self = event.target;
        if (self._ll_stop) {
            return;
        }
        if (self._speedIndex++ < self.speed) {
            return;
        }
        if (self._send_complete) {
            self.dispatchEvent(LEvent.COMPLETE);
            self._send_complete = false;
            if (self._ll_stop) {
                return;
            }
        }
        self._speedIndex = 0;
        self.onframe();
    }
    setLabel(name, _rowIndex, _colIndex, _mode, _isMirror) {
        this.ll_labelList[name] = {
            rowIndex: _rowIndex,
            colIndex: _colIndex,
            mode: (typeof _mode === UNDEFINED ? 1 : _mode),
            isMirror: (typeof _isMirror === UNDEFINED ? false : _isMirror)
        };
    }
    play() {
        this._ll_stop = false;
    }
    stop() {
        this._ll_stop = true;
    }
    gotoAndPlay(name) {
        let s = this, l = s.ll_labelList[name];
        s.setAction(l.rowIndex, l.colIndex, l.mode, l.isMirror);
        s.play();
        s.onframe();
    }
    gotoAndStop(name) {
        let s = this, l = s.ll_labelList[name];
        s.setAction(l.rowIndex, l.colIndex, l.mode, l.isMirror);
        s.stop();
        s.onframe();
    }
    addFrameScript(name, func, params) {
        let l = this.ll_labelList[name];
        let arr = this.imageArray[l.rowIndex][l.colIndex];
        if (!arr.script) {
            arr.script = [];
        }
        arr.script.push({ func: func, params: params, name: name });
    }
    removeFrameScript(name) {
        let l = this.ll_labelList[name], obj, script, i;
        script = this.imageArray[l.rowIndex][l.colIndex].script;
        if (!script) {
            return;
        }
        for (i = 0; i < script.length; i++) {
            obj = script[i];
            if (obj.name === name) {
                script.splice(i, 1);
                break;
            }
        }
    }
}

export default LAnimationTimeline;
