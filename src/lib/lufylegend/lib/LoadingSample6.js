import LSprite from '../display/LSprite';
import LGlobal from '../utils/LGlobal';
import LDropShadowFilter from '../filters/LDropShadowFilter';
import LTweenLite from '../transitions/LTweenLite';
class LoadingSample6 extends LSprite {
    constructor(r, color, filterColor) {
        super();
        let self = this;
        self.progress = 0;
        self.step = 0;
	
        self.holeR = r || 10;
        self.holeAmount = 5;
        self.holesx = 20;
        self.loadingBarWidth = self.holeR * 2 * self.holeAmount + self.holesx * (self.holeAmount - 1);
        self.loadingBarHeight = self.holeR * 2;
		
        self.progressColor = color || '#2187e7';
        self.filterColor = filterColor || '#00c6ff';
		
        self.backLayer = new LSprite();
        self.backLayer.graphics.drawRect(0, '', [0, 0, LGlobal.width, LGlobal.height], true, '#161616');
        self.addChild(self.backLayer);
		
        self.holeLayer = new LSprite();
        self.holeLayer.x = (LGlobal.width - self.loadingBarWidth) * 0.5;
        self.holeLayer.y = (LGlobal.height - self.loadingBarHeight) * 0.5;
        self.addChild(self.holeLayer);
		
        self.progressLayer = new LSprite();
        self.progressLayer.x = (LGlobal.width - self.loadingBarWidth) * 0.5;
        self.progressLayer.y = (LGlobal.height - self.loadingBarHeight) * 0.5;
        self.addChild(self.progressLayer);
		
        self._addHole();
    }
    _addHole() {
        let self = this;
        let amount = self.holeAmount, sx = self.holeR * 2 + self.holesx, r = self.holeR;
		
        for (let i = 0; i < amount; i++) {
            let holeObj = new LSprite();
            holeObj.x = i * sx;
            holeObj.graphics.drawArc(1, '#111', [0, 0, r, 0, 2 * Math.PI], true, '#000');
            holeObj.graphics.drawArc(1, '#333', [0, 0, r, 1.7 * Math.PI, 0.7 * Math.PI], false);
            self.holeLayer.addChild(holeObj);
        }
    }
    setProgress(value) {
        let self = this;
		
        let sx = self.holeR * 2 + self.holesx, r = self.holeR;
        self.progress = value / 100;
	
        let tweenList = new Array();
		
        while (Math.floor(self.progress / 0.2) > self.step) {
            let cw = r * 2;
            let ch = cw;
			
            let grd = LGlobal.canvas.createLinearGradient(0, -ch * 2, 0, ch);
            grd.addColorStop(0, 'white');
            grd.addColorStop(1, self.progressColor);
		
            let po = new LSprite();
            po.x = self.step * sx;
            po.scaleX = 0;
            po.scaleY = 0;
            po.graphics.drawArc(0, '', [0, 0, r, 0, 2 * Math.PI], true, grd);
            self.progressLayer.addChild(po);
	
            tweenList.push(po);
			
            self.step ++;
        }
	
        let completeFunc = function(o) {
            let circleObj = new LSprite();
            circleObj.alpha = 0.9;
            circleObj.x = o.x;
            circleObj.graphics.drawArc(1, self.filterColor, [0, 0, r, 0, 2 * Math.PI], false);
            self.progressLayer.addChild(circleObj);
			
            let shadow = new LDropShadowFilter(0, 5, self.filterColor, 10);
            circleObj.filters = [shadow];
			
            LTweenLite.to(circleObj, 0.5, {
                scaleX: 1.7,
                scaleY: 1.7,
                alpha: 0,
                onComplete: function(s) {
                    s.parent.removeChild(s);
                }
            });
        };
	
        for (let i = 0; i < tweenList.length; i++) {
            let o = tweenList[i];
            LTweenLite.to(o, 1, {
                scaleX: 1,
                scaleY: 1,
                onComplete: completeFunc
            });
        }
    }
}
export default LoadingSample6;