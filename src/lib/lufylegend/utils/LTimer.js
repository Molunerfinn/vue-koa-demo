import ll from '../ll';
import LEventDispatcher from '../events/LEventDispatcher';
import LTimerEvent from '../events/LTimerEvent';
class LTimer extends LEventDispatcher {
    constructor(delay, repeat) {
        super();
        let s = this;
        s.type = 'LTimer';
        s.delay = delay;
        s.repeatCount = repeat ? repeat : Number.MAX_VALUE;
        s.running = false;
        s.currentCount = 0;
        s.reset();
        LTimer.TimerManager.add(s);
    }
    start() {
        this.running = true;
    }
    stop() {
        this.running = false;
    }
    reset() {
        let s = this;
        s.currentTime = 0;
        s.currentCount = 0;
        s.stop();
    }
    destroy() {
        LTimer.TimerManager.remove(this);
    }
    ll_show() {
        let s = this;
        if (!s.running || s.currentCount >= s.repeatCount) {
            return;
        }
        s.currentTime += ll.LGlobal.speed;
        if (s.currentTime < s.delay) {
            return;
        }
        s.currentTime = 0;
        s.currentCount++;
        s.dispatchEvent(LTimerEvent.TIMER);
        if (s.currentCount >= s.repeatCount) {
            s.dispatchEvent(LTimerEvent.TIMER_COMPLETE);
        }
    }
}
LTimer.TimerManager = (function() {
    function TimerManager() {
        this.childList = [];
    }
    TimerManager.prototype = {
        ll_show: function() {
            let s = this, d;
            for (let i = 0;i < s.childList.length;i++) {
                d = s.childList[i];
                if (d) {
                    d.ll_show();
                }
            }
        },
        add: function(child) {
            this.childList.push(child);
        },
        remove: function(d) {
            let s = this, c = s.childList, i, l;
            for (i = 0, l = c.length; i < l; i++) {
                if (d.objectIndex === c[i].objectIndex) {
                    s.childList.splice(i, 1);
                    break;
                }
            }
        }
    };
    return new TimerManager();
})();
ll.LGlobal.childList.push(LTimer.TimerManager);
export default LTimer;