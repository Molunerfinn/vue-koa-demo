import HdGame from '@/lib/hdgame'
import LGlobal from '@/lib/lufylegend/utils/LGlobal'
import LWebAudio from '@/lib/lufylegend/media/LWebAudio'
import LMedia from '@/lib/lufylegend/media/LMedia'
import { UNDEFINED } from '@/lib/lufylegend/utils/LConstant';

import query from '@/lib/query'
const g_rem = window.g_rem;

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

//
const gamebar = {
  canvas:null,
  content: null
}

export function setGameTopBar(selector, hg, canvas, o ) {
    //读取 dom #gameTopBar
    //let selector = "#gameTopBar"
    let topBar = query(selector).ele();

    if (topBar == null) {
        return
    }
    query(selector).set({'display': 'none'});

    let topBarStyles = query(selector).get([ 'offsetWidth', 'offsetHeight', 'background-color', 'color'])
    let imgBoxStyles = query('.userImgBox').get([ 'border-color', 'color'])
    let gradeStyles = query('#grade').get([ 'font' ])
    let timeStyles = query('.time').get([ 'font' ])
    console.log( "setGameTopBar=", topBarStyles, imgBoxStyles, gradeStyles, timeStyles)

    let r = canvas || LGlobal.canvas;
    o = o || 1;
    let p = {};
    let l = g_rem * o;
    p.background = [[0, 0, topBarStyles.offsetWidth * o, topBarStyles.offsetHeight * o], {
        fillStyle: topBarStyles['background-color']
    }];
    if (imgBoxStyles) {
      let img = query('.userImg').ele()
        p.userImg = [0.2 * l, imgBoxStyles['border-color'], [2.1 * l, 1.75 * l, 1.25 * l, 0, 2 * Math.PI], [img, 0, 0, img.width, img.height, 0.85 * l, 0.5 * l, 2.5 * l, 2.5 * l]]
    }
    if (gradeStyles) {
        p.grade = [0, 3.9 * l, 1.7 * l, {
            font: q(gradeStyles.font),
            textAlign: "left",
            textBaseline: "middle",
            fillStyle: topBarStyles.color
        }]
    }
    if (timeStyles && hg.time.initTime !== 99999) {
        p.timeText = ["时间", 8 * l, 1 * l, {
            font: q(timeStyles.font),
            textAlign: "center",
            textBaseline: "middle",
            fillStyle: topBarStyles.color
        }];
        p.time = ["10.00", 8 * l, 2.25 * l, {
            font: q(timeStyles.font)
        }]
    }
    hg.time && hg.time.initTime !== 99999 && (hg.time.on("setTime",
    function(s) {
        p.time[0] = s
    }).targetFlag = false);
    hg.grade && (hg.grade.on("setGrade",
    function(s) {
        p.grade[0] = s
    }).target = null);
    hg.time.init();
    b(r, p);
    //
    gamebar.canvas = r;
    gamebar.content = p;

    function q(s) {
        return s.replace(/([.\d]+)(px|em|rem|pt)/g,
        function(v, t, x) {
            return (t * o) + x
        })
    }
}

export function showTopBar(){
    b(gamebar.canvas, gamebar.content)
}

function b(o, m) {
    if (!o || (typeof m.visible != "undefined" && !m.visible)) {
        return
    }
    o.save();
    Object.assign(o, m.background[1]);
    o.fillRect.apply(o, m.background[0]);
    if (m.userImg) {
        let n = m.userImg[3];
        let l = m.userImg[2];
        o.beginPath();
        o.moveTo(l[0] + l[2], l[1]);
        o.arc.apply(o, l);
        o.lineWidth = m.userImg[0];
        o.strokeStyle = m.userImg[1];
        o.stroke();
        if (n[0].width > 0 && n[0].height > 0) {
            o.save();
            o.clip();
            o.drawImage.apply(o, n);
            o.restore()
        }
    }
    h(o, m.grade);
    h(o, m.timeText);
    h(o, m.time);
    o.restore()
}
function h(m, l) {
    if (!l) {
        return
    }
    Object.assign(m, l[3]);
    m.fillText(l[0], l[1], l[2])
}
