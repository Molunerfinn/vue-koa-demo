import LEventDispatcher from '../events/LEventDispatcher';
import LSound from './LSound';
import LEvent from '../events/LEvent';
import { UNDEFINED } from '../utils/LConstant';
import LAjax from '../net/LAjax';
class LWebAudio extends LEventDispatcher {
    constructor() {
        super();
        let s = this;
        s.currentTime = 0;
        s.currentStart = 0;
        s.currentSave = 0;
        s.length = 0;
        s.loopStart = 0;
        s.loopEnd = 0;
        s.loopIndex = 0;
        s.loopLength = 1;
        s.playing = false;
        s.volume = 1;
        LSound.Container.add(s);
    }
	
    getWebAudio() {
        let data;
        if (LWebAudio.containerCount > 0) {
            data = LWebAudio.container.shift();
        } else {
            if (typeof AudioContext !== UNDEFINED) {
                try {
                    data = new AudioContext();
                } catch (e) {
                    LWebAudio.containerCount = LWebAudio.container.length;
                    data = LWebAudio.container.shift();
                }
            } else if (typeof webkitAudioContext !== UNDEFINED) {
                try {
                    data = new webkitAudioContext();
                } catch (e) {
                    LWebAudio.containerCount = LWebAudio.container.length;
                    data = LWebAudio.container.shift();
                }
            } else {
                throw 'AudioContext not supported. :(';
            }
        }
        if (!data.createGainNode) {
            data.createGainNode = data.createGain;
        }
        LWebAudio.container.push(data);
        return data;
    }
    onload(data) {
        let s = this;
        if (Object.prototype.toString.apply(data) !== '[object AudioBuffer]') {
            s.load(data);
            return;
        }
        if (!s.data) {
            s.data = s.getWebAudio();
        }
        s.buffer = data;
        s.length = s.buffer.duration;
        let e = new LEvent(LEvent.COMPLETE);
        e.currentTarget = s;
        e.target = s.buffer;
        s.dispatchEvent(e);
    }
    _onended() {
        let s = this;
        s.dispatchEvent(LEvent.SOUND_COMPLETE);
        s.close();
        if (++s.loopIndex < s.loopLength) {
            s.play(s.currentStart, undefined, s.currentTimeTo);
        }
    }
    load(u) {
        let s = this;
        if (typeof u !== 'string') {
            if (Object.prototype.toString.apply(u) === '[object AudioBuffer]') {
                s.onload(u);
            } else if (Object.prototype.toString.apply(u) === '[object ArrayBuffer]') {
                if (!s.data) {
                    s.data = s.getWebAudio();
                }
                s.data.decodeAudioData(u, s.onload.bind(s), function(error) {
                    throw 'AudioContext decodeAudioData error : ' + error.toString();
                });
            }
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
                return LWebAudio.audioTag.canPlayType(s._type + '/' + element);
            });
            if (c) {
                LAjax.responseType = LAjax.ARRAY_BUFFER;
                LAjax.progress = function(e) {
                    let event = new LEvent(LEvent.PROGRESS);
                    event.currentTarget = s;
                    event.target = e.currentTarget;
                    event.loaded = e.loaded * 0.5;
                    event.total = e.total;
                    event.responseURL = e.responseURL;
                    s.dispatchEvent(event);
                };
                LAjax.get(a[k], {}, s.onload.bind(s), function(request) {
                    let event = new LEvent(LEvent.ERROR);
                    event.currentTarget = s;
                    event.target = request;
                    event.responseURL = request.responseURL;
                    s.dispatchEvent(event);
                });
                return;
            } else {
                console.warn('Not support ' + b[b.length - 1] + ' : ' + a[k]);
                let e = new LEvent(LEvent.COMPLETE);
                e.currentTarget = e.target = s;
                s.dispatchEvent(e);
            }
        }
    }
    getCurrentTime() {
        let s = this;
        if (s.playing) {
            return s.data.currentTime - s.currentSave + s.currentTime;
        } else {
            return s.currentSave;
        }
    }
    setVolume(v) {
        let s = this;
        s.volume = v;
        if (s.playing) {
            s.volumeNode.gain.value = v;
        }
    }
    getVolume() {
        return this.volume;
    }
    play(c, l, to) {
        let s = this;
        if (s.length === 0) {
            return;
        }
        if (typeof l !== UNDEFINED) {
            s.loopIndex = 0;
            s.loopLength = l;
        }
        if (typeof c !== UNDEFINED) {
            s.currentTime = c;
            s.currentStart = c;
        }
        if (typeof to !== UNDEFINED) {
            s.currentTimeTo = to > s.length ? s.length : to;
        } else {
            s.currentTimeTo = s.length;
        }
        s.data.loop = false;
        s.playing = true;
        if (s.timeout) {
            clearTimeout(s.timeout);
            delete s.timeout;
        }
        s.timeout = setTimeout(s._onended.bind(s), (s.currentTimeTo - s.currentTime) * 1000);
        s.bufferSource = s.data.createBufferSource();
        s.bufferSource.buffer = s.buffer;
        s.volumeNode = s.data.createGainNode();
        s.volumeNode.gain.setTargetAtTime = s.volumeNode.gain.setTargetAtTime || s.volumeNode.gain.setTargetValueAtTime || s._setTargetAtTime;
        s.volumeNode.gain.setValueAtTime(s.volume, s.currentTime, 0.5);
        s.volumeNode.connect(s.data.destination);
        s.bufferSource.connect(s.volumeNode);
        s.currentSave = s.data.currentTime;
        if (s.bufferSource.start) {
            s.bufferSource.start(0, s.currentTime, s.length - s.currentTime);
        } else {
            s.bufferSource.noteGrainOn(0, s.currentTime, s.length - s.currentTime);
        }
    }
    _setTargetAtTime(target, startTime, timeConstant) {
        this.volumeNode.gain.value = target;
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
        if (s.bufferSource.stop) {
            s.bufferSource.stop(0);
        } else {
            s.bufferSource.noteOff(0);
        }
        s.currentSave = s.getCurrentTime();
        s.currentTime = s.currentSave;
        s.playing = false;
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
        if (s.bufferSource.stop) {
            s.bufferSource.stop(0);
        } else {
            s.bufferSource.noteOff(0);
        }
        s.playing = false;
        s.currentTime = 0;
        s.currentSave = 0;
    }
    ll_check() {
        let s = this;
        if (!s.playing) {
            return;
        }
        if (s.currentTimeTo < s.data.currentTime - s.currentSave + LSound.Container.time * 0.001) {
            s._onended();
        }
    }
    die() {
        LSound.Container.remove(this);
    }
}
LWebAudio.container = [];
LWebAudio.containerCount = 0;
try {
    LWebAudio.audioTag = new Audio();
} catch (e) {
    console.warn('ReferenceError: Can\'t find variable: Audio');
    LWebAudio.audioTag = { canPlayType: function() {
        return false;
    } };
}
export default LWebAudio;