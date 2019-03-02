import LSprite from '../../display/LSprite';
import LGlobal from '../../utils/LGlobal';
import LMouseEvent from '../../events/LMouseEvent';
export class LRadioChild extends LSprite {
    constructor(value, layer, layerSelect) {
        super();
        let s = this, grd;
        s.type = 'LRadioChild';
        s.value = value;
		
        if (!layer) {
            grd = LGlobal.canvas.createLinearGradient(0, -20, 0, 40);
            grd.addColorStop(0, '#FFFFFF');
            grd.addColorStop(1, '#CCCCCC');
            layer = new LSprite();
            layer.graphics.drawArc(1, '#CCCCCC', [0, 0, 10, 0, 2 * Math.PI], true, grd);
        } else {
            layer = layer.clone();
        }
        if (!layerSelect) {
            grd = LGlobal.canvas.createLinearGradient(0, -20, 0, 20);
            grd.addColorStop(0, '#FFFFFF');
            grd.addColorStop(1, '#008000');
            layerSelect = new LSprite();
            layerSelect.graphics.drawArc(1, grd, [0, 0, 5, 0, 2 * Math.PI], true, grd);
        } else {
            layerSelect = layerSelect.clone();
        }
        s.layer = layer;
        s.layerSelect = layerSelect;
        s.addChild(s.layer);
        s.addChild(s.layerSelect);
        s.layerSelect.visible = false;
        s.checked = false;
        s.addEventListener(LMouseEvent.MOUSE_UP, s._onChange);
    }
    clone() {
        let s = this,
            a = new LRadioChild(s.value, s.layer, s.layerSelect);
        a.copyProperty(s);
        return a;
    }
    _onChange(e) {
        let s = e.clickTarget;
        s.parent.setValue(s.value);
    }
    setChecked(v) {
        this.layerSelect.visible = this.checked = v;
    }
}
export class LRadio extends LSprite {
    constructor() {
        super();
        this.type = 'LRadio';
        this.value = null;
    }
    setChildRadio(value, x, y, layer, layerSelect) {
        let s = this;
        let child = new LRadioChild(value, layer, layerSelect);
        child.x = x;
        child.y = y;
        s.addChild(child);
        return child;
    }
    push(value) {
        this.addChild(value);
    }
    setValue(value) {
        let s = this, child, k;
        let saveValue = s.value;
        for (k in s.childList) {
            child = s.childList[k];
            if (child.setChecked) {
                child.setChecked(false);
            }
            if (child.value === value) {
                s.value = value;
                child.setChecked(true);
            }
        }
        if (saveValue !== s.value) {
            s.dispatchEvent(LRadio.ON_CHANGE);
        }
    }
    clone() {
        let s = this, a = new LRadio(), child, k;
        for (k in s.childList) {
            child = s.childList[k].clone();
            a.push(child);
        }
        a.setValue(s.value);
        return a;
    }
}
LRadio.ON_CHANGE = 'onchange';