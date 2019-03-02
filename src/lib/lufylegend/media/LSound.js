import LWebAudio from './LWebAudio';
import LMedia from './LMedia';
import lufylegend from '../ll';
import { UNDEFINED } from '../utils/LConstant';
class LSound {
    constructor(u) {
        this.type = 'LSound';
        this._type = 'audio';
        if (LSound.webAudioEnabled && lufylegend.LGlobal.webAudio) {
            this._media = new LWebAudio();
        } else {
            this._media = new LMedia();
            try {
                this._media.data = new Audio();
            } catch (e) {
                console.warn('ReferenceError: Can\'t find variable: Audio');
                this._media.data = {};
            }
            this._media.data.loop = false;
            this._media.data.autoplay = false;
        }
        if (u) {
            this.load(u);
        }
    }
}
LSound.TYPE_SOUND = 'sound';
LSound.webAudioEnabled = false;

LSound.Container = {
    ll_save: 0,
    time: 0,
    list: [],
    ll_show: function() {
        let c = LSound.Container;
        let t = (new Date()).getTime();
        c.time = t - (c.ll_save ? c.ll_save : t);
        c.ll_save = t;
        let l = c.list;
        for (let i = l.length - 1; i >= 0; i--) {
            if (l[i]) {
                l[i].ll_check();
            }
        }
    },
    add: function(obj) {
        if (LSound.Container.list.indexOf(obj) >= 0) {
            return;
        } 
        LSound.Container.list.push(obj);
    },
    remove: function(obj) {
        let l = LSound.Container.list;
        for (let i = l.length - 1; i >= 0; i--) {
            if (l[i].objectIndex === obj.objectIndex) {
                l.splice(i, 1);
                break;
            }
        }
    },
    stopOther: function(obj) {
        let l = LSound.Container.list;
        for (let i = l.length - 1; i >= 0; i--) {
            if (l[i].objectIndex !== obj.objectIndex) {
                l[i].stop();
            }
        }
    }
};
setTimeout(() => {
    lufylegend.LGlobal.childList.push(LSound.Container);

    LWebAudio._context = null;
    let protocol = location.protocol;
    if (protocol === 'http:' || protocol === 'https:') {
        if (typeof AudioContext !== UNDEFINED) {
            try {
                LWebAudio._context = new AudioContext();
            } catch (e) {
            //
            }
        } else if (typeof webkitAudioContext !== UNDEFINED) {
            try {
                LWebAudio._context = new webkitAudioContext();
            } catch (e) {
            //
            }
        }
        if (LWebAudio._context) {
            LWebAudio.container.push(LWebAudio._context);
            LSound.webAudioEnabled = true;
        }
    }
});

export default LSound;