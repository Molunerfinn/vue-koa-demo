import { ll } from '@/lib/lufylegend/ll'
import { GameArg, g_rem } from './GameArg'


class Lolly extends ll.LSprite {
	constructor(clubImg, y, flag ) {
		super() //  调用父类的 constructor(x, y)
    this.club = new ll.LBitmap(clubImg, 0, 0, GameArg.lollyW * g_rem, GameArg.lollyH * g_rem);

    this.addChild(this.club);

    this.x = ((16 - GameArg.lollyW) / 2) * g_rem;
    this.y = y;
    GameArg.readyLayer.addChild(this);
	}
	launch() {
    var s = this;
    s.club.visible = true;
    ll.LTweenLite.to(s, 0.1, {
      y: GameArg.launchY * g_rem,
      onComplete: function() {
        GameArg.sugarY.add(s);
      }
    });
    return s;
	}
}

export default Lolly
