import LObject from '../utils/LObject';
import { UNDEFINED } from '../utils/LConstant';
import LEasing from '../transitions/LEasing';
import LPoint from '../geom/LPoint';
import ll from '../ll';
class LTweenLiteChild extends LObject {
    constructor($target, $duration, $vars) {
        super();
        this.type = 'LTweenLiteChild';
        this.toNew = [];
        this.init($target, $duration, $vars);
    }
    init($target, $duration, $vars) {
        let s = this, k = null;
        if (typeof $vars['tweenTimeline'] === UNDEFINED) {
            $vars['tweenTimeline'] = LTweenLite.TYPE_FRAME;
        }
        s.target = $target;
        if (!s.target.objectIndex) {
            s.target.objectIndex = ++ll.LGlobal.objectIndex;
        }
        s.duration = $duration || 0.001;
        s.vars = $vars;
        s.delay = s.vars.delay || 0;
        if (s.vars['tweenTimeline'] === LTweenLite.TYPE_TIMER) {
            s.currentTime = (new Date()).getTime() / 1000;
            s.initTime = s.currentTime;
            s.startTime = s.initTime + s.delay;
        } else {
            s.currentTime = 0;
            s.duration *= 1000;
            s.currentTime -= s.delay * 1000;
            s.initTime = (new Date()).getTime() - s.currentTime
        }
        s.combinedTimeScale = s.vars.timeScale || 1;
        s.active = s.duration === 0 && s.delay === 0;
        s.varsto = {};
        s.varsfrom = {};
        s.varsDiff = {};
        s.varsListIndex = {};
        s.varsListCurr = {};
        s.varsListTo = {};
        s.varsListLength = {};
        s.stop = false;
        if (typeof(s.vars.ease) !== 'function') {
            s.vars.ease = LEasing.None.easeIn;
        }
        s.ease = s.vars.ease;
        delete s.vars.ease;
        if (typeof s.vars.onComplete === 'function') {
            s.onComplete = s.vars.onComplete;
            delete s.vars.onComplete;
        } else {
            s.onComplete = null;
        }
        if (typeof s.vars.onUpdate === 'function') {
            s.onUpdate = s.vars.onUpdate;
            delete s.vars.onUpdate;
        } else {
            s.onUpdate = null;
        }
        if (typeof s.vars.onStart === 'function') {
            s.onStart = s.vars.onStart;
            delete s.vars.onStart;
        } else {
            s.onStart = null;
        }
        for (k in s.vars) {
            if (k === 'coordinate' && Array.isArray(s.vars[k])) {
                let diff = 0, curr = { x: s.target.x, y: s.target.y };
                for (let i = 0, l = s.vars[k].length; i < l; i++) {
                    let p = s.vars[k][i];
                    diff += LPoint.distance(p, curr);
                    curr = p;
                }
                s.varsListIndex[k] = 0;
                s.varsListCurr[k] = 0;
                s.varsListTo[k] = diff;
                s.varsto[k] = s.vars[k];
                s.varsfrom[k] = { x: s.target.x, y: s.target.y };
                continue;
            } else if (typeof s.vars[k] !== 'number') {
                continue;
            }
            s.varsto[k] = s.vars[k];
            s.varsfrom[k] = s.target[k];
            s.varsDiff[k] = s.vars[k] - s.target[k];
        }
    }
    pause() {
        this.stop = true;
    }
    resume() {
        this.stop = false;
    }
    tween() {
        let s = this, tweentype, etime;
        let type_timer = (s.vars['tweenTimeline'] === LTweenLite.TYPE_TIMER);
        if (type_timer) {
            let time = (new Date()).getTime() / 1000;
            etime = time - s.startTime;
            if (etime < 0) {
                return;
            }
        } else {
            if (s.stop) {
                return;
            }
            // lufylegend 凡客定制
            if (ll.LGlobal.speed) {
                s.currentTime += ll.LGlobal.speed
            } else {
                s.currentTime = ((new Date()).getTime() - s.initTime)
            }
            if (this._end) {
                s.currentTime = s.duration
            }
            //s.currentTime += ll.LGlobal.speed;
            if (s.currentTime < 0) {
                return;
            }
        }
        for (let k in s.varsto) {
            if (typeof s.varsListTo[k] !== UNDEFINED) {
                let curr = s.ease(type_timer ? etime : s.currentTime, 0, s.varsListTo[k], s.duration);
                if (curr > s.varsListTo[k]) {
                    curr = s.varsListTo[k];
                }
                let c = s.varsListIndex[k] > 0 ? s.vars[k][s.varsListIndex[k] - 1] : s.varsfrom[k];
                let v = s.vars[k][s.varsListIndex[k]];
                let d = LPoint.distance(c, v);
                while (s.varsListCurr[k] + d < curr) {
                    s.varsListCurr[k] += d;
                    c = v;
                    s.varsListIndex[k]++;
                    v = s.vars[k][s.varsListIndex[k]];
                    d = LPoint.distance(c, v);
                }
                s.target.x = c.x;
                s.target.y = c.y;
                if (d !== 0 && v.x - c.x !== 0) {
                    s.target.x += (v.x - c.x) * (curr - s.varsListCurr[k]) / d;
                }
                if (d !== 0 && v.y - c.y !== 0) {
                    s.target.y += (v.y - c.y) * (curr - s.varsListCurr[k]) / d;
                }
                continue;
            }
            s.target[k] = s.ease(type_timer ? etime : s.currentTime, s.varsfrom[k], s.varsDiff[k], s.duration);
        }
        if (s.onStart) {
            s._dispatchEvent(s.onStart);
            delete s.onStart;
        }
        let e;
        if (type_timer) {
            e = (etime >= s.duration);
        } else {
            e = (s.currentTime >= s.duration);
        }
        if (e) {
            for (tweentype in s.varsto) {
                if (typeof s.varsListTo[tweentype] !== UNDEFINED) {
                    let p = s.varsto[tweentype][s.vars[tweentype].length - 1];
                    s.target.x = p.x;
                    s.target.y = p.y;
                    continue;
                }
                s.target[tweentype] = s.varsto[tweentype];
            }
            if (s.onComplete) {
              s._dispatchEvent(s.onComplete);
              //s._dispatchEvent(s.onComplete, true);
            }
            return true;
        } else if (s.onUpdate) {
            s._dispatchEvent(s.onUpdate);
        }
        return false;
    }
    _dispatchEvent(f, wait) {
        let s = this;
        let event = {};
        let fun = () => {
            event.target = s.target;
            event.currentTarget = s;
            f(event);
        };
        if (wait) {
            setTimeout(() => {
                fun();
            }, 1);
        } else {
            fun();
        }
    }
    to($target, $duration, $vars, $data) {
        let s = this;
        s.toNew.push({ target: $target, duration: $duration, vars: $vars, data: $data });
        return s;
    }
    keep() {
        let s = this, t, vs, k, d;
        if (s.toNew.length > 0) {
            t = s.toNew.shift();
            if (t.vars.loop) {
                s.loop = true;
            }
            if (s.loop) {
                d = {};
                vs = {};
                for (k in t.vars) {
                    vs[k] = t.vars[k];
                    if (typeof t.target[k] === UNDEFINED || t.vars.playStyle !== LTweenLite.PlayStyle.Init) {
                        continue;
                    }
                    if (t.data) {
                        t.target[k] = t.data[k];
                        continue;
                    }
                    d[k] = t.target[k];
                }
                if (!t.data) {
                    t.data = d;
                }
                s.to(t.target, t.duration, vs, t.data);
            }
            s.init(t.target, t.duration, t.vars);
            return true;
        }
        return false;
    }
}
class LTweenLite extends LObject {
    constructor() {
        super();
        this.type = 'LTweenLite';
        this.tweens = [];
    }
    count() {
        return this.tweens.length;
    }
    ll_show() {
        let s = this;
        let i, length = s.tweens.length, t;
        for (i = 0; i < length; i++) {
            t = s.tweens[i];
            if (t && t.tween && t.tween()) {
                s.tweens.splice(i, 1);
                i--;
                length = s.tweens.length;
                if (t.keep()) {
                    s.add(t);
                }
            }
        }
    }
    to($target, $duration, $vars) {
        if (!$target) {
            return;
        }
        let s = this;
        let tween = new LTweenLiteChild({}, 0, {});
        s.tweens.push(tween);
        tween.to($target, $duration, $vars);
        return tween;
    }
    add(tween) {
        this.tweens.push(tween);
    }
    remove(tween) {
        let s = this;
        if (typeof tween === UNDEFINED) {
            return;
        }
        for (let i = 0, l = s.tweens.length; i < l; i++) {
            if (tween.objectIndex === s.tweens[i].objectIndex) {
                s.tweens.splice(i, 1);
                break;
            }
        }
    }
    removeTarget(target) {
        let s = this;
        for (let i = 0, l = s.tweens.length; i < l; i++) {
            if (target.objectIndex === s.tweens[i].target.objectIndex) {
                s.tweens.splice(i, 1);
                break;
            }
        }
    }
    removeAll() {
        this.tweens.splice(0, this.tweens.length);
    }
    pauseAll() {
        for (let i = 0, l = this.tweens.length; i < l; i++) {
            this.tweens[i].pause();
        }
    }
    resumeAll() {
        for (let i = 0, l = this.tweens.length; i < l; i++) {
            this.tweens[i].resume();
        }
    }
}
LTweenLite.PlayStyle = {
    None: 'none',
    Init: 'init'
};
LTweenLite.TYPE_FRAME = 'type_frame';
LTweenLite.TYPE_TIMER = 'type_timer';
ll.LTweenLiteTimeline = new LTweenLite();
ll.LGlobal.childList.push(ll.LTweenLiteTimeline);
let tween = new LTweenLite();
tween.TYPE_FRAME = LTweenLite.TYPE_FRAME;
tween.TYPE_TIMER = LTweenLite.TYPE_TIMER;
tween.PlayStyle = LTweenLite.PlayStyle;
ll.LGlobal.childList.push(tween);
ll.LTweenLite = tween;
export default tween;
