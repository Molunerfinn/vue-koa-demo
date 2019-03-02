import LSprite from '../../display/LSprite';
import LGlobal from '../../utils/LGlobal';
import LMouseEvent from '../../events/LMouseEvent';
class LCheckBox extends LSprite {
    constructor(layer, layerSelect) {
        super();
        let s = this, grd;
        s.type = 'LCheckBox';
        if (!layer) {
            grd = LGlobal.canvas.createLinearGradient(0, -20, 0, 40);
            grd.addColorStop(0, '#FFFFFF');
            grd.addColorStop(1, '#CCCCCC');
            layer = new LSprite();
            layer.graphics.drawRoundRect(1, '#CCCCCC', [0, 0, 20, 20, 4], true, grd);
        } else {
            layer = layer.clone();
        }
        if (!layerSelect) {
            grd = LGlobal.canvas.createLinearGradient(0, -20, 0, 20);
            grd.addColorStop(0, '#FFFFFF');
            grd.addColorStop(1, '#008000');
            layerSelect = new LSprite();
            layerSelect.graphics.drawLine(5, grd, [4, 10, 12, 16]);
            layerSelect.graphics.drawLine(5, grd, [10, 16, 16, 4]);
        } else {
            layerSelect = layerSelect.clone();
        }
        s.layer = layer;
        s.layerSelect = layerSelect;
        s.addChild(s.layer);
        s.addChild(s.layerSelect);
        s.layerSelect.visible = s.checked = false;
        s.addEventListener(LMouseEvent.MOUSE_UP, s._onChange);
    }
    _onChange(e) {
        let s = e.clickTarget;
        s.checked = !s.checked;
        s.layerSelect.visible = s.checked;
        s.dispatchEvent(LCheckBox.ON_CHANGE);
    }
    setChecked(value) {
        let s = this;
        s.checked = value;
        s.layerSelect.visible = s.checked;
    }
    clone() {
        let s = this, a = new LCheckBox(s.layer.clone(), s.layerSelect.clone());
        a.setChecked(s.checked);
        return a;
    }
}
LCheckBox.ON_CHANGE = 'onchange';
export default LCheckBox;