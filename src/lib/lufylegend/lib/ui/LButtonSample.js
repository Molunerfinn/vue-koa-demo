import LButton from '../../display/LButton';
import LSprite from '../../display/LSprite';
import LTextField from '../../text/LTextField';
import LDropShadowFilter from '../../filters/LDropShadowFilter';
import LEvent from '../../events/LEvent';
import LGlobal from '../../utils/LGlobal';
export class LButtonSample1 extends LButton {
    constructor(name, size, font, color) {
        size = size || 16;
        color = color || '#FFFFFF';
        font = font || 'Arial';
        let btn_up = new LSprite();
        btn_up.shadow = new LSprite();
        btn_up.back = new LSprite();
        btn_up.addChild(btn_up.shadow);
        btn_up.addChild(btn_up.back);
        let labelText = new LTextField();
        labelText.color = color;
        labelText.font = font;
        labelText.size = size;
        labelText.x = size * 0.5;
        labelText.y = size * 0.5;
        labelText.text = name;
        s.labelText = labelText;
        btn_up.back.addChild(labelText);
        let shadow = new LDropShadowFilter(4, 45, '#000000', 10);
        btn_up.shadow.filters = [shadow];
        let btn_down = new LSprite();
        btn_down.x = btn_down.y = 1;
        labelText = labelText.clone();
        btn_down.addChild(labelText);
        let btn_disable = btn_down.clone();
        btn_disable.alpha = 0.5;
        super(btn_up, btn_down, null, btn_disable);
        let s = this;
        s.backgroundColor = '#000000';
        s.type = 'LButtonSample1';
        s.baseWidth = s.width = labelText.getWidth() + size;
        s.baseHeight = s.height = 2.2 * size;
        s.backgroundSet = null;
        s.widthSet = null;
        s.heightSet = null;
        s.xSet = null;
        s.ySet = null;
        s.addEventListener(LEvent.ENTER_FRAME, s._onDraw);
    }
	
    clone() {
        let s = this, name = s.labelText.text, size = s.labelText.size, font = s.labelText.font, color = s.labelText.color,
            a = new LButtonSample1(name, size, font, color);
        a.backgroundColor = s.backgroundColor;
        a.x = s.x;
        a.y = s.y;
        return a;
    }
    setLabel(text) {
        let s = this;
        s.bitmap_over.getChildAt(0).text = s.bitmap_up.back.getChildAt(0).text = text;
        s.baseWidth = s.width = s.bitmap_up.back.getChildAt(0).getWidth() + s.bitmap_up.back.getChildAt(0).size;
        s.backgroundSet = null;
    }
    _onDraw(s) {
        let co = s.getRootCoordinate(), labelText;
        if (s.backgroundSet === s.backgroundColor && s.widthSet === s.width && s.heightSet === s.height && s.xSet === co.x && s.ySet === co.y) {
            return;
        }
        s.backgroundSet = s.backgroundColor;
        s.widthSet = s.width > s.baseWidth ? s.width : s.baseWidth;
        s.heightSet = s.height > s.baseHeight ? s.height : s.baseHeight;
        s.width = s.widthSet;
        s.height = s.heightSet;
        s.xSet = co.x;
        s.ySet = co.y;
        labelText = s.bitmap_up.back.getChildAt(0);
        labelText.x = (s.width - s.baseWidth + labelText.size) * 0.5;
        labelText.y = (s.height - s.baseHeight + labelText.size) * 0.5;
        labelText = s.bitmap_over.getChildAt(0);
        labelText.x = (s.width - s.baseWidth + labelText.size) * 0.5;
        labelText.y = (s.height - s.baseHeight + labelText.size) * 0.5;
        let grd = LGlobal.canvas.createLinearGradient(0, -s.height * 0.5, 0, s.height * 2);
        grd.addColorStop(0, '#FFFFFF');
        grd.addColorStop(1, s.backgroundColor);
        let grd2 = LGlobal.canvas.createLinearGradient(0, -s.height, 0, s.height * 2);
        grd2.addColorStop(0, '#FFFFFF');
        grd2.addColorStop(1, s.backgroundColor);
        s.bitmap_up.back.graphics.clear();
        s.bitmap_over.graphics.clear();
        s.bitmap_up.shadow.graphics.clear();
        s.bitmap_up.shadow.graphics.drawRoundRect(0, '#000000', [1, 1, s.widthSet - 2, s.heightSet - 2, s.heightSet * 0.1], true, '#000000');
        s.bitmap_up.back.graphics.drawRect(1, s.backgroundColor, [0, 0, s.widthSet, s.heightSet], true, grd);
        s.bitmap_up.back.graphics.drawRect(0, s.backgroundColor, [1, s.heightSet * 0.5, s.widthSet - 2, s.heightSet * 0.5 - 1], true, grd2);
        s.bitmap_over.graphics.drawRect(1, s.backgroundColor, [0, 0, s.widthSet, s.heightSet], true, grd);
        s.bitmap_over.graphics.drawRect(0, s.backgroundColor, [1, s.heightSet * 0.5, s.widthSet - 2, s.heightSet * 0.5 - 1], true, grd2);
        s.disableState.graphics.drawRect(1, s.backgroundColor, [0, 0, s.widthSet, s.heightSet], true, grd);
        s.disableState.graphics.drawRect(0, s.backgroundColor, [1, s.heightSet * 0.5, s.widthSet - 2, s.heightSet * 0.5 - 1], true, grd2);
    }
}

export class LButtonSample2 extends LButtonSample1 {
    constructor(name, size, font, color) {
        super(name, size, font, color);
        this.type = 'LButtonSample2';
    }
    clone() {
        let s = this, name = s.labelText.text, size = s.labelText.size, font = s.labelText.font, color = s.labelText.color,
            a = new LButtonSample2(name, size, font, color);
        a.backgroundColor = s.backgroundColor;
        a.x = s.x;
        a.y = s.y;
        return a;
    }
    _onDraw(s) {
        let co = s.getRootCoordinate(), labelText;
        if (s.backgroundSet === s.backgroundColor && s.widthSet === s.width && s.heightSet === s.height && s.xSet === co.x && s.ySet === co.y) {
            return;
        }
        s.backgroundSet = s.backgroundColor;
        s.widthSet = s.width > s.baseWidth ? s.width : s.baseWidth;
        s.heightSet = s.height > s.baseHeight ? s.height : s.baseHeight;
        s.width = s.widthSet;
        s.height = s.heightSet;
        s.xSet = co.x;
        s.ySet = co.y;
        labelText = s.bitmap_up.back.getChildAt(0);
        labelText.x = (s.width - s.baseWidth + labelText.size) * 0.5;
        labelText.y = (s.height - s.baseHeight + labelText.size) * 0.5;
        labelText = s.bitmap_over.getChildAt(0);
        labelText.x = (s.width - s.baseWidth + labelText.size) * 0.5;
        labelText.y = (s.height - s.baseHeight + labelText.size) * 0.5;
        let grd = LGlobal.canvas.createLinearGradient(0, -s.height * 0.5, 0, s.height * 2);
        grd.addColorStop(0, '#FFFFFF');
        grd.addColorStop(1, s.backgroundColor);
        let grd2 = LGlobal.canvas.createLinearGradient(0, -s.height, 0, s.height * 2);
        grd2.addColorStop(0, '#FFFFFF');
        grd2.addColorStop(1, s.backgroundColor);
        s.bitmap_up.back.graphics.clear();
        s.bitmap_over.graphics.clear();
        s.bitmap_up.shadow.graphics.clear();
        s.bitmap_up.back.graphics.drawRoundRect(1, s.backgroundColor, [0, 0, s.width, s.height, s.height * 0.1], true, grd);
        s.bitmap_up.back.graphics.drawRoundRect(0, s.backgroundColor, [1, s.height * 0.5, s.width - 2, s.height * 0.5 - 1, s.height * 0.1], true, grd2);
        s.bitmap_over.graphics.drawRoundRect(1, s.backgroundColor, [0, 0, s.width, s.height, s.height * 0.1], true, grd);
        s.bitmap_over.graphics.drawRoundRect(0, s.backgroundColor, [1, s.height * 0.5, s.width - 2, s.height * 0.5 - 1, s.height * 0.1], true, grd2);
        s.disableState.graphics.drawRoundRect(1, s.backgroundColor, [0, 0, s.width, s.height, s.height * 0.1], true, grd);
        s.disableState.graphics.drawRoundRect(0, s.backgroundColor, [1, s.height * 0.5, s.width - 2, s.height * 0.5 - 1, s.height * 0.1], true, grd2);
    }
}