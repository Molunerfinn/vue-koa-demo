import LSprite from '../display/LSprite';
import LGlobal from '../utils/LGlobal';
class LoadingSample1 extends LSprite {
    constructor(step, b, c) {
        super();
        let s = this;
        s.numberList = new Array([1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1], [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1], [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1], [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1], [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]);
        s.backgroundColor = b || '#000000';
        s.color = c || '#ffffff';
        s.progress = 0;
        s.step = step ? step : LGlobal.width * 0.5 / 15;
        s.back = new LSprite();
        s.addChild(s.back);
        s.num = new LSprite();
        s.addChild(s.num);
        s.num.mask = new LSprite();
        s.screenX = (LGlobal.width - s.step * 15) / 2;
        s.screenY = (LGlobal.height - s.step * 5) / 2;
        s.num.x = s.screenX;
        s.num.y = s.screenY;
        s.setProgress(s.progress);
    }
    setProgress(value) {
        let s = this, c = LGlobal.canvas;
        value = Math.floor(value);
        let num_0 = '', num_1, num_2, i;
        let s_x = s.step;
        if (value >= 100) {
            num_0 = s.getNumber(1);
            num_1 = s.getNumber(0);
            num_2 = s.getNumber(0);
            s_x = s.step * 3;
        } else if (value >= 10) {
            num_1 = s.getNumber(Math.floor(value / 10));
            num_2 = s.getNumber(value % 10);
        } else {
            num_1 = s.getNumber(0);
            num_2 = s.getNumber(value);
        }
        s.back.graphics.clear();
        s.back.graphics.add(function() {
            c.beginPath();
            c.fillStyle = s.backgroundColor;
            c.fillRect(0, 0, LGlobal.width, LGlobal.height);
            c.closePath();
            c.fillStyle = s.color;
            if (value >= 100) {
                for (i = 0; i < num_0.length; i++) {
                    if (num_0[i] === 0) {
                        continue;
                    }
                    c.fillRect(s.screenX + Math.floor(i % 3) * s.step, s.screenY + Math.floor(i / 3) * s.step, s.step, s.step);
                }
            }
            for (i = 0; i < num_1.length; i++) {
                if (num_1[i] === 0) {
                    continue;
                }
                c.fillRect(s.screenX + s_x + Math.floor(i % 3) * s.step, s.screenY + Math.floor(i / 3) * s.step, s.step, s.step);
            }
            for (i = 0; i < num_2.length; i++) {
                if (num_2[i] === 0) {
                    continue;
                }
                c.fillRect(s.screenX + s_x + Math.floor(i % 3) * s.step + s.step * 4, s.screenY + Math.floor(i / 3) * s.step, s.step, s.step);
            }
            c.moveTo(s.screenX + s_x + s.step * 9.7, s.screenY);
            c.lineTo(s.screenX + s_x + s.step * 10.5, s.screenY);
            c.lineTo(s.screenX + s_x + s.step * 9.3, s.screenY + s.step * 5);
            c.lineTo(s.screenX + s_x + s.step * 8.5, s.screenY + s.step * 5);
            c.lineTo(s.screenX + s_x + s.step * 9.7, s.screenY);
            c.fill();
            c.moveTo(s.screenX + s_x + s.step * 8.5, s.screenY + s.step);
            c.arc(s.screenX + s_x + s.step * 8.5, s.screenY + s.step, s.step * 0.6, 0, 360 + Math.PI / 180);
            c.moveTo(s.screenX + s_x + s.step * 10.5, s.screenY + s.step * 4);
            c.arc(s.screenX + s_x + s.step * 10.5, s.screenY + s.step * 4, s.step * 0.6, 0, 360 + Math.PI / 180);
            c.fill();

        });
        s.num.mask.graphics.clear();
        s.num.mask.graphics.add(function() {
            if (value >= 100) {
                for (i = 0; i < num_0.length; i++) {
                    if (num_0[i] === 0) {
                        continue;
                    }
                    c.rect(s.screenX + Math.floor(i % 3) * s.step, s.screenY + Math.floor(i / 3) * s.step, s.step, s.step);
                }
            }
            for (let i = 0; i < num_1.length; i++) {
                if (num_1[i] === 0) {
                    continue;
                }
                c.rect(s.screenX + s_x + Math.floor(i % 3) * s.step, s.screenY + Math.floor(i / 3) * s.step, s.step, s.step);
            }
            for (let i = 0; i < num_2.length; i++) {
                if (num_2[i] === 0) {
                    continue;
                }
                c.rect(s.screenX + s_x + Math.floor(i % 3) * s.step + s.step * 4, s.screenY + Math.floor(i / 3) * s.step, s.step, s.step);
            }
        });
        c.fillStyle = LGlobal._create_loading_color();
        s.num.graphics.clear();
        s.num.graphics.drawRect(1, c.fillStyle, [0, s.step * 5 * (100 - value) * 0.01, LGlobal.width, LGlobal.height], true, c.fillStyle);
    }
    getNumber(value) {
        return this.numberList[value];
    }
}
export default LoadingSample1;
