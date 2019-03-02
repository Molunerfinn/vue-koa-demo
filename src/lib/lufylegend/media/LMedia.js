import LDisplayObject from '../display/LDisplayObject';
import LGlobal from '../utils/LGlobal';
import { UNDEFINED } from '../utils/LConstant';
import LEvent from '../events/LEvent';
import LSound from './LSound';
class LMedia extends LDisplayObject {
    constructor() {
        super();
        this.length = 0;
        this.loopIndex = 0;
        this.loopLength = 1;
        this.playing = false;
        this.oncomplete = null;
        this.onsoundcomplete = null;
        this.currentStart = 0;
        LSound.Container.add(this);
    }
	
    onload() {
        let s = this;
        if (s.data.readyState) {
            s.length = s.data.duration - (LGlobal.android ? 0.1 : 0);
            let e = new LEvent(LEvent.COMPLETE);
            e.currentTarget = s;
            e.target = s.data;
            s.dispatchEvent(e);
            return;
        }
        s.data.addEventListener('error', function(e) {
            let event = new LEvent(LEvent.ERROR);
            event.currentTarget = s;
            event.target = e.target;
            event.responseURL = e.target.src;
            s.dispatchEvent(event);
        }, false);
        s.data.addEventListener('canplaythrough', function() {
            s.onload();
        }, false);
    }
    _onended() {
        let s = this, i;
        s.dispatchEvent(LEvent.SOUND_COMPLETE);
        if (++s.loopIndex < s.loopLength) {
            i = s.loopIndex;
            s.close();
            s.play(s.currentStart, s.loopLength, s.currentTimeTo);
            s.loopIndex = i;
        } else {
            s.close();
        }
    }
    load(u) {
        let s = this;
        if (Object.prototype.toString.apply(u) === '[object HTMLAudioElement]') {
            s.data = u;
            s.onload();
            return;
        }
        let a, b, c, k, d, q = { 'mov': ['quicktime'], '3gp': ['3gpp'], 'midi': ['midi'], 'mid': ['midi'], 'ogv': ['ogg'], 'm4a': ['acc'], 'mp3': ['mpeg'], 'wav': ['wav', 'x-wav', 'wave'], 'wave': ['wav', 'x-wav', 'wave'], 'aac': ['mp4', 'aac'] };
        a = u.split(',');
        for (k = 0; k < a.length; k++) {
            b = a[k].split('.');
            d = b[b.length - 1];
            if (q[d]) {
                d = q[d];
            } else {
                d = [d];
            }
            c = d.some(function(element, index, array) {
                return s.data.canPlayType(s._type + '/' + element);
            });
            if (c) {
                s.data.src = a[k];
                s.onload();
                s.data.load();
                return;
            } else {
                console.warn('Not support ' + b[b.length - 1] + ' : ' + a[k]);
                let e = new LEvent(LEvent.COMPLETE);
                e.currentTarget = e.target = s;
                s.dispatchEvent(e);
            }
        }
        if (s.oncomplete) {
            s.oncomplete({});
        }
    }
    getCurrentTime() {
        return this.data.currentTime;
    }
    setVolume(v) {
        this.data.volume = v;
    }
    getVolume() {
        return this.data.volume;
    }
    play(c, l, to) {
        let s = this;
        if (s.length === 0) {
            return;
        }
        if (LGlobal.android) {
            LSound.Container.stopOther(this);
        }
        if (typeof c !== UNDEFINED) {
            s.data.currentTime = c;
            s.currentStart = c;
        }
        if (typeof l !== UNDEFINED) {
            s.loopLength = l;
        }
        if (typeof to !== UNDEFINED) {
            s.currentTimeTo = to > s.length ? s.length : to;
        } else {
            s.currentTimeTo = s.length;
        }
        if (s.timeout) {
            clearTimeout(s.timeout);
            delete s.timeout;
        }
        s.timeout = setTimeout(function() {
            s._onended();
        }, (s.currentTimeTo - s.data.currentTime) * 1000);
        s.data.loop = false;
        s.loopIndex = 0;
        s.playing = true;
        s.data.play();
    }
    playSegment(c, seg, l) {
        this.playTo(c, c + seg, l);
    }
    playTo(c, to, l) {
        this.play(c, l, to);
    }
    stop() {
        let s = this;
        if (!s.playing) {
            return;
        }
        if (s.timeout) {
            clearTimeout(s.timeout);
            delete s.timeout;
        }
        s.playing = false;
        s.data.pause();
    }
    close() {
        let s = this;
        if (!s.playing) {
            return;
        }
        if (s.timeout) {
            clearTimeout(s.timeout);
            delete s.timeout;
        }
        s.playing = false;
        s.data.pause();
        s.data.currentTime = 0;
        s.currentSave = 0;
    }
    ll_check() {
        let s = this;
        if (!s.playing) {
            return;
        }
        if (s.data.duration !== s._ll_duration) {
            s._ll_duration = s.data.duration;
            s.length = s.data.duration - (LGlobal.android ? 0.1 : 0);
        }
        if (s.currentTimeTo < s.data.currentTime + LSound.Container.time * 0.005) {
            s._onended();
        }
    }
    die() {
        LSound.Container.remove(this);
    }
}
export default LMedia;