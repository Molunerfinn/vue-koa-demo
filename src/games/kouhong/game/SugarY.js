import { ll } from '@/lib/lufylegend/ll'
import { GameArg, g_rem } from './GameArg'




class SugarY extends ll.LSprite {
  constructor(imgData, sugarYsize ) {
    super()
    var s = this;
    s.x = 1.375 * g_rem;
    s.y = 4 * g_rem;

    s.lollyWarp = new ll.LSprite();
    s.addChild(s.lollyWarp);

    s.sugar = new ll.LBitmap(imgData, 3.625 * g_rem + (6 * g_rem - sugarYsize.width) / 2, 3.625 * g_rem + (6 * g_rem - sugarYsize.height) / 2, sugarYsize.width, sugarYsize.height);
    s.addChild(s.sugar);
    s.rotatex = 6.625 * g_rem;
    s.rotatey = 6.625 * g_rem;
    GameArg.stageLayer.addChild(s);
  }

  add(lolly, rotate) {
    var s = this,
      rotateList = GameArg.rotateList,
      gradeFlag = false;
    if (typeof rotate === 'undefined') {
      rotate = s.rotate
      gradeFlag = true;
    }
    lolly.y -= s.y;
    lolly.x -= s.x;
    lolly.rotatex = (GameArg.lollyW / 2) * g_rem;
    lolly.rotatey = -GameArg.lollyY * g_rem;
    lolly.rotate = -rotate;
    s.lollyWarp.addChild(lolly);
    for (var i = 0; i < rotateList.length; i++) {
      if (Math.abs(rotate - rotateList[i]) <= GameArg.minRotate) {
        //hg.sound.play(2);
        //hg.time.end();
        this.endGame(lolly);
        return s;
      }
    }
    if (gradeFlag) {
      //hg.grade(10);
      //hg.sound.play(1);
    }
    rotateList.push(rotate);
    return s;
  }

  rotating() {
    var s = this;
    ll.LTweenLite.to(s, 7, {
      loop: true,
      rotate: 360,
      onComplete: function() {
        s.rotate = 0;
      }
    });
    return s;
  }
}

  export default SugarY;
