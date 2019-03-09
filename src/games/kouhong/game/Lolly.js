import LSprite from '@/lib/lufylegend/display/LSprite'
import LBitmap from '@/lib/lufylegend/display/LBitmap'
import LTweenLite from '@/lib/lufylegend/transitions/LTweenLite'
import { GameArg, g_rem } from './GameArg'


class Lolly extends LSprite {
	constructor(clubImg, y, flag ) {
		super() //  调用父类的 constructor(x, y)
    this.club = new LBitmap(clubImg, 0, 0, GameArg.lollyW * g_rem, GameArg.lollyH * g_rem);

    this.addChild(this.club);

    this.x = ((16 - GameArg.lollyW) / 2) * g_rem;
    this.y = y;
    GameArg.readyLayer.addChild(this);
	}
	launch() {
    var s = this;
    s.club.visible = true;
    LTweenLite.to(s, 0.1, {
      y: GameArg.launchY * g_rem,
      onComplete: function() {
        GameArg.sugarY.add(s);
      }
    });
    return s;
	}
}

export default Lolly
