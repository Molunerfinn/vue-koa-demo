import LSprite from '@/lib/lufylegend/display/LSprite'
import LBitmap from '@/lib/lufylegend/display/LBitmap'
import LTweenLite from '@/lib/lufylegend/transitions/LTweenLite'

import { GameArg, g_rem } from './GameArg'

import { GameEndEvent } from '@/lib/GameEvent'


class SugarY extends LSprite {
  constructor(imgData, sugarYsize ) {
    super()
    var s = this;
    s.x = 1.375 * g_rem;
    s.y = 4 * g_rem;

    s.lollyWarp = new LSprite();
    s.addChild(s.lollyWarp);

    s.sugar = new LBitmap(imgData, 3.625 * g_rem + (6 * g_rem - sugarYsize.width) / 2, 3.625 * g_rem + (6 * g_rem - sugarYsize.height) / 2, sugarYsize.width, sugarYsize.height);
    s.addChild(s.sugar);
    s.rotatex = 6.625 * g_rem;
    s.rotatey = 6.625 * g_rem;
    GameArg.stageLayer.addChild(s);
  }

  /// 添加飞镖到标靶，并根据飞镖位置设置游戏是否成功
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
      // 游戏结束条件
      if (Math.abs(rotate - rotateList[i]) <= GameArg.minRotate) {
        console.log( "eventBus.$emit GameEndEvent.name", GameEndEvent.name)
        GameArg.eventBus.$emit( GameEndEvent.name, new GameEndEvent(lolly))

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
    LTweenLite.to(s, 7, {
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
