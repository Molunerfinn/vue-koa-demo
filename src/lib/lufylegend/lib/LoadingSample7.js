import LSprite from '../display/LSprite';
import LGlobal from '../utils/LGlobal';
import LTweenLite from '../transitions/LTweenLite';
class LoadingSample7 extends LSprite {
    constructor(w, h, color) {
        super();
        let self = this;
        self.progress = 0;
        self.step = 0;
	
        self.holeW = w || 10;
        self.holeH = h || 30;
        self.holeAmount = 10;
        self.holesx = 8;
        self.loadingBarWidth = self.holeW * self.holeAmount + self.holesx * (self.holeAmount - 1);
        self.loadingBarHeight = self.holeH;
		
        self.progressColor = color || '#2187e7';
		
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
        let amount = self.holeAmount, sx = self.holeW + self.holesx, h = self.holeH;
		
        for (let i = 0; i < amount; i++) {
            let holeObj = new LSprite();
            holeObj.x = i * sx;
            holeObj.graphics.drawRect(1, '#333', [1, 1, self.holeW, self.holeH], false);
            holeObj.graphics.drawRect(1, '#111', [0, 0, self.holeW, self.holeH], true, '#000');
            self.holeLayer.addChild(holeObj);
			
            let grd = LGlobal.canvas.createLinearGradient(0, -h, 0, h);
            grd.addColorStop(0, 'white');
            grd.addColorStop(1, self.progressColor);
			
            let progressObj = new LSprite();
            progressObj.alpha = 0;
            progressObj.x = i * sx;
            progressObj.graphics.drawRect(0, '', [0, 0, self.holeW, self.holeH], true, grd);
            self.progressLayer.addChild(progressObj);
        }
    }
    setProgress(value) {
        let self = this;
		
        self.progress = value / 100;
		
        if (Math.floor(self.progress / 0.1) > self.step) {
            let n = Math.ceil(self.progress / 0.1);
            if (n > 10)n = 10;
            for (let i = 0; i < n; i++) {
                let sc = self.progressLayer.childList;
                if (sc[i].alpha > 0) continue;
                let o = self.progressLayer.childList[i];
                LTweenLite.to(o, 1, {
                    alpha: 1
                });
            }
			
            self.step ++;
        }
    }
}
export default LoadingSample7;