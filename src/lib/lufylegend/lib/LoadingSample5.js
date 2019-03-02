import LSprite from '../display/LSprite';
import LGlobal from '../utils/LGlobal';
import LTextField from '../text/LTextField';
import LEvent from '../events/LEvent';
import LDropShadowFilter from '../filters/LDropShadowFilter';
class LoadingSample5 extends LSprite {
    constructor(height, background, color) {
        super();
        let s = this;
        s.backgroundColor = background || '#000000';
        s.graphics.drawRect(1, s.backgroundColor, [0, 0, LGlobal.width, LGlobal.height], true, s.backgroundColor);
        color = color || '#FFFFFF';
        s.arc = new LSprite();
        s.arc.x = LGlobal.width * 0.5;
        s.arc.y = LGlobal.height * 0.5;
        s.addChild(s.arc);
        let r = 50;
        for (let i = 0;i < 360;i += 30) {
            let child = new LSprite();
            child.graphics.drawArc(0, color, [r, 0, 7, 0, 2 * Math.PI], true, color);
            child.rotate = i;
            child.alpha = 0.1 + i / 360;
            s.arc.addChild(child);
        }
        s.index = 0;
        s.max = 3;
        s.progress = 0;
        s.label = new LTextField();
        s.label.color = '#FFFFFF';
        s.label.weight = 'bolder';
        s.label.size = 18;
        s.label.x = LGlobal.width * 0.5;
        s.label.y = LGlobal.height * 0.5 - s.label.getHeight() * 0.5;
        s.addChild(s.label);
        let shadow = new LDropShadowFilter(0, 0, '#FFFFFF', 30);
        s.arc.filters = [shadow];
        s.addEventListener(LEvent.ENTER_FRAME, s.onframe);
        s.setProgress(s.progress);
    }
    onframe(event) {
        let s = event.target;
        if (s.index++ < s.max) return;
        s.index = 0;
        s.arc.rotate += 30;
    }
    setProgress(value) {
        let s = this;
        if (value > 100)value = 100;
        s.progress = value;
        s.label.text = value + '%';
        s.label.x = LGlobal.width * 0.5 - s.label.getWidth() * 0.5;
    }
}
export default LoadingSample5;