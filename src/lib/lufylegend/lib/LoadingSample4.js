import LSprite from '../display/LSprite';
import LGlobal from '../utils/LGlobal';
import LTextField from '../text/LTextField';
import LEvent from '../events/LEvent';
import LDropShadowFilter from '../filters/LDropShadowFilter';
class LoadingSample4 extends LSprite {
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
        for (let i = 0;i < 360;i++) {
            s.arc.graphics.drawArc(1 + i / 36, color, [0, 0, 50, (2 * Math.PI / 360) * i, (2 * Math.PI / 360) * (i + 2)]);
        }
        s.progress = 0;
        s.label = new LTextField();
        s.label.color = color;
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
        event.target.arc.rotate += 20;
    }
    setProgress(value) {
        let s = this;
        if (value > 100)value = 100;
        s.progress = value;
        s.label.text = value + '%';
        s.label.x = LGlobal.width * 0.5 - s.label.getWidth() * 0.5;
    }
}
export default LoadingSample4;