import BaseController from './BaseController';
import LTimer from '../../lufylegend/utils/LTimer';
import LTimerEvent from '../../lufylegend/events/LTimerEvent';
class SceneController extends BaseController {
    constructor(data) {
        super(data);
    }
    init(data) {
        super.init(data);
        this._waitExecuteFuncs = [];
    }
    nextFrameExecute(func) {
        if (!this._timer) {
            this._timer = new LTimer();
            this._timer.addEventListener(LTimerEvent.TIMER, () => {
                this._waitExecuteFuncsExecute();
            });
        }
        if (this._waitExecuteFuncs.length === 0) {
            this._timer.reset();
            this._timer.start();
        }
        this._waitExecuteFuncs.push(func);
    }
    _waitExecuteFuncsExecute() {
        if (this._waitExecuteFuncs.length === 0) {
            return;
        }
        for (let i = 0; i < this._waitExecuteFuncs.length;i++) {
            let func = this._waitExecuteFuncs[i];
            if (typeof func === 'function') {
                func();
            }
        }
        this._waitExecuteFuncs.length = 0;
    }

}
export default SceneController;