import HdGame from '@/lib/hdgame'
import LGlobal from '@/lib/lufylegend/utils/LGlobal'
import LWebAudio from '@/lib/lufylegend/media/LWebAudio'
import LMedia from '@/lib/lufylegend/media/LMedia'
import LSound from '@/lib/lufylegend/media/LSound'
import { UNDEFINED } from '@/lib/lufylegend/utils/LConstant';
import lufylegend from '@/lib/lufylegend/ll';

// gameTopBar{
//  outerWidth, outerHeight backgroundColor color,
//  userImgBox: {borderColor},
//  userImg: {width, height, imgdata},
//  timeBox:{ font },
//  time:{ font },
//  grade:{ font}
//  }
export class LWebAudio2 extends LWebAudio {
  constructor() {
    super()
    HdGame.initCallBack(this, ["complete", "sound_complete"])
  }

  onload( data ){
    if (Object.prototype.toString.apply(data) !== '[object AudioBuffer]') {
      super.onload(data)
    }else{
      super.onload(data)
      this.fire("complete")
    }
  }
  _onended(){
    this.fire("sound_complete");
    super._onended()
  }
  play(c, l, to) {
    let s = this;
    if (s.length === 0) {
        return;
    }
    if (l === "loop") {
        s.loopIndex = 0;
        s.loopLength = 99999
    } else {
      if (typeof l !== UNDEFINED) {
          s.loopIndex = 0;
          s.loopLength = l;
      }
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
    s.volumeNode.gain.value = s.volume;
    s.volumeNode.connect(s.data.destination);
    s.bufferSource.connect(s.volumeNode);
    s.currentSave = s.data.currentTime;
    if (s.bufferSource.start) {
        s.bufferSource.start(0, s.currentTime, s.length - s.currentTime);
    } else {
        s.bufferSource.noteGrainOn(0, s.currentTime, s.length - s.currentTime);
    }
  }
}

export class LMedia2 extends LMedia {
  constructor() {
    super()
    HdGame.initCallBack(this, ["complete" ])
  }
  onload() {

    let s = this;
    if (s.data.readyState) {
        s.length = s.data.duration - (LGlobal.android ? 0.1 : 0);

        s.fire("complete");
        s.data.removeEventListener("canplaythrough", s._canplaythrough, false);
        s.data.removeEventListener("canplay", s._canplaythrough, false);
        s.data.removeEventListener("loadedmetadata", s._canplaythrough, false);
        return
    }
    s._canplaythrough = function() {
        s.onload()
    };
    s.data.addEventListener("canplaythrough", s._canplaythrough, false);
    s.data.addEventListener("canplay", s._canplaythrough, false);
    s.data.addEventListener("loadedmetadata", s._canplaythrough, false)

    // s.data.addEventListener('error', function(e) {
    //     let event = new LEvent(LEvent.ERROR);
    //     event.currentTarget = s;
    //     event.target = e.target;
    //     event.responseURL = e.target.src;
    //     s.dispatchEvent(event);
    // }, false);

  }
  _onended(){
    this.fire("sound_complete");
    super._onended()
  }
  play(c, l, to) {
      let s = this;
      if (typeof c != UNDEFINED) {
          s.data.currentTime = c
      }
      if (typeof l != UNDEFINED) {
          s.data.loop = l
      }
      s.data.play()
  }

}

export class LSound2 extends LSound{
    constructor(u) {
        super()
        this.type = 'LSound2';
        this._type = 'audio';
        if (LSound.webAudioEnabled && lufylegend.LGlobal.webAudio) {
            this._media = new LWebAudio2();
        } else {
            this._media = new LMedia2();
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

LSound2.TYPE_SOUND = 'sound';
LSound2.webAudioEnabled = false;

LSound2.Container = {
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

(function() {
    lufylegend.LGlobal.childList.push(LSound2.Container);

    LWebAudio2._context = null;
    let protocol = location.protocol;
    if (protocol === 'http:' || protocol === 'https:') {
        if (typeof AudioContext !== UNDEFINED) {
            try {
                LWebAudio2._context = new AudioContext();
            } catch (e) {
            //
            }
        } else if (typeof webkitAudioContext !== UNDEFINED) {
            try {
                LWebAudio2._context = new webkitAudioContext();
            } catch (e) {
            //
            }
        }
        if (LWebAudio2._context) {
            LWebAudio2.container.push(LWebAudio2._context);
            LSound2.webAudioEnabled = true;
        }
    }
})();
