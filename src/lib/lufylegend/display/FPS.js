
import ll from '../ll';
import LSprite from './LSprite';
import LEvent from '../events/LEvent';
class FPS extends LSprite {
    constructor() {
        super();
        if (!ll.LGlobal.fpsStatus) {
            ll.LGlobal.fpsStatus = {
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                e: 0,
                bitmapData: 0,
                display: 0,
                transform: 0,
                graphics: 0,
                text: 0,
                reset: function() {
                    this.a = this.bitmapData;
                    this.b = this.display - 1;
                    this.c = this.transform - 1;
                    this.d = this.graphics - 1;
                    this.e = this.text - 5;
                    this.bitmapData = 0;
                    this.display = 0;
                    this.transform = 0;
                    this.graphics = 0;
                    this.text = 0;
                }
            };
        }
        this.fps = [];
        this.back = new ll.LShape();
        this.back.alpha = 0.5;
        this.addChild(this.back);
        for (let i = 0;i < 5;i++) {
            let f = new ll.LTextField();
            f.color = '#ffffff';
            f.y = i * 20;
            this.addChild(f);
            this.fps.push(f);
        }
        this.fpsCount = 0;
        this.fpsTime = (new Date()).getTime();
        this.addEventListener(LEvent.ENTER_FRAME, this.showFPS);
        this.super();
    }
    showFPS(e) {
        let s = e.currentTarget, t, f;
        s.fpsCount++;
        t = (new Date()).getTime();
        if (t - s.fpsTime < 1000) return;
        s.fps[0].text = 'FPS : ' + Math.round(s.fpsCount * 10000 / (t - s.fpsTime)) / 10;
        f = ll.LGlobal.fpsStatus;
        s.fps[1].text = 'DisplayObject : ' + f.c + '/' + f.b; 
        s.fps[2].text = 'Draw image : ' + f.a; 
        s.fps[3].text = 'Draw graphics : ' + f.d; 
        s.fps[4].text = 'Draw text : ' + f.e; 
        s.fpsTime = t;
        s.fpsCount = 0;
        s.back.graphics.clear();
        s.back.graphics.drawRect(0, '#000000', [0, 0, s.fps[1].getWidth(), 100], true, '#000000');
    }
    die() {
        ll.LGlobal.fpsStatus = null;
        this.super();
    }
}
ll.FPS = FPS;
export default FPS;