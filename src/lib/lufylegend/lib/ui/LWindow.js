import LSprite from '../../display/LSprite';
import LBitmap from '../../display/LBitmap';
import LBitmapData from '../../display/LBitmapData';
import LGlobal from '../../utils/LGlobal';
import LMouseEvent from '../../events/LMouseEvent';
import LTextField from '../../text/LTextField';
import LGraphics from '../../display/LGraphics';
class LWindow extends LSprite {
    constructor() {
        super();
        let s = this;
        s.type = 'LWindow';
        let style;
        /*{width:nunber,height:number,title:string,header:LSprite,closeButton:LSprite,background:LSprite}*/
        if (typeof arguments[0] === 'object') {
            style = arguments[0];
        } else {
            /*width,height,title*/
            style = { width: arguments[0], height: arguments[1], title: arguments[2] };
        }
        s.style = style;
        s.w = style.width;
        s.h = style.height;
        if (style.header) {
            if (style.header instanceof LBitmapData) {
                let bitmapBar = new LBitmap(style.header);
                let bar = new LSprite();
                bar.addChild(bitmapBar);
                s.bar = bar;
            } else {
                s.bar = style.header;
            }
            s.bar.w = s.bar.getWidth();
            s.bar.h = s.bar.getHeight();
        } else {
            s.bar = new LSprite();
            style.header = s.bar;
            s.bar.alpha = 0.7;
            s.barColor = '#0000FF';
            s.bar.w = s.w;
            s.bar.h = 30;
            let barGrd = LGlobal.canvas.createLinearGradient(0, -s.bar.h * 0.5, 0, s.bar.h * 2);
            barGrd.addColorStop(0, '#FFFFFF');
            barGrd.addColorStop(1, s.barColor);
            s.bar.graphics.drawRoundRect(1, s.barColor, [0, 0, s.bar.w, s.bar.h, s.bar.h * 0.1], true, barGrd);
        }
        s.addChild(s.bar);
        s.bar.addEventListener(LMouseEvent.MOUSE_DOWN, s._onBarDown);
        if (style.title && style.title instanceof LTextField) {
            s.title = style.title;
        } else {
            s.title = new LTextField();
            if (style.font) {
                s.title.font = style.font;
            }
            s.title.size = style.size ? style.size : 16;
            s.title.color = style.color ? style.color : '#000000';
            s.title.text = style.title ? style.title : '';
        }
        s.title.x = s.title.getHeight() * 0.5;
        s.title.y = (s.bar.h - s.title.getHeight()) * 0.5;
        s.bar.addChild(s.title);
		
        if (style.closeButton) {
            if (style.closeButton instanceof LBitmapData) {
                let bitmapClose = new LBitmap(style.closeButton);
                let closeButton = new LSprite();
                closeButton.addChild(bitmapClose);
                s.closeObj = closeButton;
            } else {
                s.closeObj = style.closeButton;
            }
            s.closeObj.x = s.w - s.closeObj.getWidth();
        } else {
            s.closeObj = new LSprite();
            style.closeButton = s.closeObj;
            s.closeObj.w = 50;
            s.closeObj.h = 25;
            s.closeObj.x = s.w - s.closeObj.w;
            let closeGrd = LGlobal.canvas.createLinearGradient(0, -s.closeObj.h * 0.5, 0, s.closeObj.h * 2);
            closeGrd.addColorStop(0, '#FFFFFF');
            closeGrd.addColorStop(1, '#800000');
            s.closeObj.graphics.drawRoundRect(1, '#800000', [0, 0, s.closeObj.w, s.closeObj.h, s.closeObj.h * 0.1], true, closeGrd);
            s.closeObj.graphics.drawLine(4, '#FFFFFF', [15, 5, s.closeObj.w - 15, s.closeObj.h - 5]);
            s.closeObj.graphics.drawLine(4, '#FFFFFF', [15, s.closeObj.h - 5, s.closeObj.w - 15, 5]);
        }
        s.addChild(s.closeObj);
        s.closeObj.addEventListener(LMouseEvent.MOUSE_UP, s._onClose);
	
        s.layer = new LSprite();
        s.layer.y = s.bar.h;
        if (style.background) {
            if (style.background instanceof LBitmapData) {
                let bitmapBackground = new LBitmap(style.background);
                let background = new LSprite();
                background.addChild(bitmapBackground);
                s.background = background;
            } else {
                s.background = style.background;
            }
            s.layer.h = s.background.getHeight();
        } else {
            s.layerColor = '#FFFFFF';
            s.layer.h = s.h - s.bar.h;
            s.background = new LSprite();
            style.background = s.background;
            s.background.graphics.drawRect(1, s.barColor, [0, 0, s.w, s.layer.h], true, s.layerColor);
        }
        s.background.y = s.bar.h;
        s.addChild(s.background);
        s.addChild(s.layer);
        let g = new LGraphics();
        g.rect(0, 0, s.w, s.layer.h);
        s.layer.mask = g;
	
        s.addEventListener(LMouseEvent.MOUSE_UP, function(e) {});
        s.addEventListener(LMouseEvent.MOUSE_DOWN, function(e) {});
        s.addEventListener(LMouseEvent.MOUSE_MOVE, function(e) {});
        s.addEventListener(LMouseEvent.MOUSE_OVER, function(e) {});
        s.addEventListener(LMouseEvent.MOUSE_OUT, function(e) {});
    }
    clone() {
        let s = this, a = new LWindow({ width: s.style.width, height: s.style.height, title: s.style.title, header: s.style.header.clone(), closeButton: s.style.closeButton.clone(), background: s.style.background.clone() });
        let mask = a.layer.mask;
        a.removeChild(a.layer);
        a.layer = s.layer.clone();
        a.layer.mask = mask;
        a.addChild(a.layer);
        a.bar.addEventListener(LMouseEvent.MOUSE_DOWN, a._onBarDown);
        a.close.addEventListener(LMouseEvent.MOUSE_UP, a._onClose);
        return a;
    }
    _onClose(event) {
        event.clickTarget.parent.close();
    }
    close() {
        let s = this;
        s.dispatchEvent(LWindow.CLOSE);
        s.parent.removeChild(s);
    }
    _onBarDown(event) {
        let s = event.clickTarget.parent;
        s.bar.addEventListener(LMouseEvent.MOUSE_UP, s._onBarUp);
        s.startDrag(event.touchPointID);
    }
    _onBarUp(event) {
        let s = event.clickTarget.parent;
        s.stopDrag();
        s.bar.removeEventListener(LMouseEvent.MOUSE_UP, s._onBarUp);
    }
}
LWindow.CLOSE = 'close';
export default LWindow;