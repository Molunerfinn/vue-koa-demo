import LInteractiveObject from '../display/LInteractiveObject';
import LShape from '../display/LShape';
import LTextFieldType from './LTextFieldType';
import LTextFormat from './LTextFormat';
import LSprite from '../display/LSprite';
import LMouseEventContainer from '../events/LMouseEventContainer';
import LMouseEvent from '../events/LMouseEvent';
import LEvent from '../events/LEvent';
import LKeyboardEvent from '../events/LKeyboardEvent';
import LFocusEvent from '../events/LFocusEvent';
import LTextEvent from '../events/LTextEvent';
import { UNDEFINED, NONE } from '../utils/LConstant';
import lufylegend from '../ll';
class LTextField extends LInteractiveObject {
    constructor() {
        super();
        let s = this;
        s.type = 'LTextField';
        s.texttype = null;
        s.text = '';
        s.htmlText = '';
        s.styleSheet = '';
        s.font = 'Arial';
        s.size = 15;
        s.color = '#000000';
        s.weight = 'normal';
        s.textAlign = 'left';
        s.textBaseline = 'top';
        s.heightMode = LTextField.HEIGHT_MODE_BOTTOM;
        s.stroke = false;
        s.lineWidth = 1;
        s.lineColor = '#000000';
        s.width = 150;
        s.height = s.size;
        s.displayAsPassword = false;
        s.wordWrap = false;
        s.multiline = false;
        s.numLines = 1;
        s.speed = 0;
        s._speedIndex = 100;
    }
	
    _showReady(c) {
        let s = this;
        c.font = s.weight + ' ' + s.size + 'px ' + s.font;  
        c.textAlign = s.textAlign;
        c.textBaseline = s.textBaseline;
        c.fillStyle = s.color;
        if (s.stroke) {
            c.strokeStyle = s.lineColor;
            c.lineWidth = s.lineWidth + 1;  
        }
    }
    ll_getStyleSheet(textFormat, tabName, attribute, text) {
        let s = this, pattern, tf = textFormat.clone();
        if (tabName === 'font') {
            let i = 0;
            while (attribute) {
                if (i++ > 4)
                    break;
                pattern = /(([^\s]*?)(\s*)=(\s*)("|')(.*?)\5)*/g;
                let arr = pattern.exec(attribute);
                if (!arr || !arr[0]) {
                    break;
                }
                switch (arr[2]) {
                case 'face':
                    tf.font = arr[6];
                    break;
                case 'color':
                    tf.color = arr[6];
                    break;
                case 'size':
                    tf.size = arr[6];
                    break;
                }
                attribute = attribute.replace(arr[0], '').replace(/(^\s*)|(\s*$)|(\n)/g, '');
            }
        } else if (tabName === 'b') {
            tf.bold = true;
        } else if (tabName === 'u') {
            tf.underline = true;
        } else if (tabName === 'i') {
            tf.italic = true;
        } else if (tabName === 'p' && s.wordWrap) {
            text = '\n' + text + '\n';
        } else if (s.styleSheet) {
            let sheetObj;
            if (tabName === 'span') {
                pattern = /(([^\s]*?)(\s*)=(\s*)("|')(.*?)\5)*/g;
                let arr = pattern.exec(attribute);
                if (arr && arr[0]) {
                    switch (arr[2]) {
                    case 'class':
                        sheetObj = s.styleSheet.getStyle('.' + arr[6]);
                        break;
                    }
                }
            } else if (s.styleSheet.getStyle(tabName)) {
                sheetObj = s.styleSheet.getStyle(tabName);
            }
            if (sheetObj) {
                tf.setCss(sheetObj);
            }
        }
        s.ll_getHtmlText(tf, text); 
    }
    ll_getHtmlText(tf, text) {
        if (!text) {
            return;
        }
        let s = this, tabName, content, start, end, pattern = /<(.*?)(\s*)(.*?)>(.*?)<\/\1>/g, arr = pattern.exec(text);
        if (!arr || !arr[0]) {
            s.ll_htmlTexts.push({
                textFormat: tf.clone(),
                text: text
            });
            return;
        }
        if (arr.index > 0) {
            s.ll_htmlTexts.push({
                textFormat: tf.clone(),
                text: text.substring(0, arr.index)
            });
        }
        tabName = arr[1];
        start = arr.index;
        end = start;
        do {
            end = text.indexOf('</' + tabName, end + 1);
            start = text.indexOf('<' + tabName, start + 1);
        } while (start > 0 && start < end);

        content = text.substring(text.indexOf('>', arr.index) + 1, end);
        s.ll_getStyleSheet(tf, tabName, arr[3], content);
        s.ll_getHtmlText(tf, text.substring(end + tabName.length + 3));
    }
    _ll_show(ctx) {
        let s = this, c, lbl, i, rc, j, l, k, m, h, enter, tf, underlineY;
        if (s.texttype === LTextFieldType.INPUT) {
            s.inputBackLayer.ll_show();
            rc = s.getRootCoordinate();
            if (lufylegend.LGlobal.inputBox.name === 'input' + s.objectIndex) {
                lufylegend.LGlobal.inputBox.style.marginTop = (parseInt(lufylegend.LGlobal.canvasObj.style.marginTop) + (((rc.y + s.inputBackLayer.startY()) * parseInt(lufylegend.LGlobal.canvasObj.style.height) / lufylegend.LGlobal.canvasObj.height) >>> 0)) + 'px';
                lufylegend.LGlobal.inputBox.style.marginLeft = (parseInt(lufylegend.LGlobal.canvasObj.style.marginLeft) + (((rc.x + s.inputBackLayer.startX()) * parseInt(lufylegend.LGlobal.canvasObj.style.width) / lufylegend.LGlobal.canvasObj.width) >>> 0)) + 'px';
            }
            if (lufylegend.LGlobal.inputTextField && lufylegend.LGlobal.inputTextField.objectIndex === s.objectIndex) {
                return;
            } else {
                c.clip();
            }
        }
        if (lufylegend.LGlobal.fpsStatus) {
            lufylegend.LGlobal.fpsStatus.text++;
        }
        if (lufylegend.LGlobal.enableWebGL) {
            s._createCanvas();
            s._canvas.width = lufylegend.LGlobal.width;
            s._canvas.height = lufylegend.LGlobal.height;
            s._showReady(s._context);
            c = s._context;
        } else {
            c = ctx;
        }
        if (s.htmlText) {
            if (s.ll_htmlText !== s.htmlText || (s.styleSheet && (s.ll_style_objectIndex !== s.styleSheet.objectIndex || s.ll_styleIndex === s.styleSheet.styleIndex))) {
                tf = new LTextFormat();
                s.ll_htmlTexts = [];
                s.ll_htmlText = s.htmlText;
                if (s.styleSheet) {
                    s.ll_style_objectIndex = s.styleSheet.objectIndex;
                    s.ll_styleIndex = s.styleSheet.styleIndex;
                }
                s.ll_getHtmlText(tf, s.htmlText);
            }
            j = 0, k = 0, m = 0;
            s._ll_height = s.wordHeight || 30;
            if (!LTextField.underlineY) {
                LTextField.underlineY = { 'alphabetic': 0, 'top': 1, 'bottom': -0.2, 'middle': 0.4, 'hanging': 0.8 };
            }
            s.ll_htmlTexts.forEach(function(element) {
                let textFormat = element.textFormat, text = element.text;
                c.font = textFormat.getFontText();
                c.fillStyle = textFormat.color;
                for (i = 0, l = text.length; i < l; i++) {
                    enter = /(?:\r\n|\r|\n|¥n)/.exec(text.substr(i, 1));
                    if (enter) {
                        j = 0;
                        k = i + 1;
                        m++;
                    } else {
                        h = c.measureText('O').width * 1.2;
                        if (s.stroke) {
                            c.strokeText(text.substr(i, 1), j, m * s._ll_height);
                        }
                        c.fillText(text.substr(i, 1), j, m * s._ll_height);
                        if (textFormat.underline) {
                            c.beginPath();
                            underlineY = m * s._ll_height + h * LTextField.underlineY[s.textBaseline];
                            c.moveTo(j, underlineY);
                            c.lineTo(j + c.measureText(text.substr(i, 1)).width, underlineY);
                            c.stroke();
                        }
                    }
                    j += c.measureText(text.substr(i, 1)).width;
                    if (s.wordWrap && j + c.measureText(text.substr(i + 1, 1)).width > s.width) {
                        j = 0;
                        k = i + 1;
                        m++;
                    }
                }
                s.height = (m + 1) * s._ll_height;
            });
            if (lufylegend.LGlobal.enableWebGL) {
                ctx.drawImage(s._canvas, 0, 0);
            }
            return;
        }
        lbl = s.text;
        if (s.displayAsPassword) {
            lbl = '';
            for (i = 0, l = s.text.length; i < l; i++) {
                lbl += '*';
            }
        }
        if (s.wordWrap || s.multiline) {
            j = 0, k = 0, m = 0;
            for (i = 0, l = s.text.length; i < l; i++) {
                enter = /(?:\r\n|\r|\n|¥n)/.exec(lbl.substr(i, 1));
                if (enter) {
                    j = 0;
                    k = i + 1;
                    m++;
                } else {
                    if (s.stroke) {
                        c.strokeText(lbl.substr(i, 1), j, m * s.wordHeight);
                    }
                    c.fillText(lbl.substr(i, 1), j, m * s.wordHeight);
                }
                s.numLines = m;
                j = c.measureText(s.text.substr(k, i + 1 - k)).width;
                if (s.wordWrap && j + c.measureText(lbl.substr(i, 1)).width > s.width) {
                    j = 0;
                    k = i + 1;
                    m++;
                }
            }
            s.height = (m + 1) * s.wordHeight;
        } else {
            s.numLines = 1;
            if (s.stroke) {
                c.strokeText(lbl, 0, 0, c.measureText(lbl).width);
            }
            c.fillText(lbl, 0, 0, c.measureText(lbl).width);
        }
        if (lufylegend.LGlobal.enableWebGL) {
            ctx.drawImage(s._canvas, 0, 0);
        }
        if (s.windRunning) {
            s._ll_windRun();
        }
    }
    _wordHeight(h) {
        let s = this;
        if (h > 0) {
            s.wordHeight = h;
        } else {
            s.wordWrap = false;
            s.wordHeight = s.getHeight();
        }
        s.height = 0;
    }
    setMultiline(v, h) {
        let s = this;
        if (v) {
            s._wordHeight(h);
        }
        s.multiline = v;
    }
    setWordWrap(v, h) {
        let s = this;
        if (v) {
            s._wordHeight(h);
        }
        s.wordWrap = v;
    }
    setType(type, inputBackLayer) {
        let s = this;
        if (s.texttype !== type && type === LTextFieldType.INPUT) {
            if (!inputBackLayer || !(inputBackLayer instanceof LSprite)) {
                s.inputBackLayer = new LSprite();
                s.inputBackLayer.graphics.drawRect(1, '#000000', [0, -s.getHeight() * 0.4, s.width, s.getHeight() * 1.5]);
            } else {
                s.inputBackLayer = inputBackLayer;
            }
            s.inputBackLayer.parent = s;
            if (LMouseEventContainer.container[LMouseEvent.MOUSE_DOWN]) {
                LMouseEventContainer.pushInputBox(s);
            }
        } else {
            s.inputBackLayer = null;
            LMouseEventContainer.removeInputBox(s);
        }
        s.texttype = type;
    }
    ismouseon(e, cood) {
        let s = this;
        if (!e) {
            return false;
        }
        if (!s.visible) {
            return false;
        }
        if (!cood) {
            cood = { x: 0, y: 0, scaleX: 1, scaleY: 1 };
        }
        if (s.mask) {
            if (!s.mask.parent) {
                s.mask.parent = s.parent;
            }
            if (!s.mask.ismouseon(e, cood)) {
                return false;
            }
        }
        if (s.inputBackLayer) {
            return s.inputBackLayer.ismouseon(e, { x: s.x * cood.scaleX + cood.x, y: s.y * cood.scaleY + cood.y, scaleX: cood.scaleX * s.scaleX, scaleY: cood.scaleY * s.scaleY });
        }
        return s.ismouseonShapes([{ type: LShape.RECT, arg: [0, 0, s._getWidth(), s._getHeight()] }], e.offsetX, e.offsetY);
    }
    clone() {
        let s = this, a = new s.constructor();
        a.copyProperty(s);
        a.texttype = null;
        if (s.texttype === LTextFieldType.INPUT) {
            a.setType(LTextFieldType.INPUT);
        }
        return a;
    }
    mouseEvent(event, type, cood) {
        let s = this, on;
        if (!s.inputBackLayer || type !== LMouseEvent.MOUSE_DOWN) {
            return;
        }
        on = s.ismouseon(event, cood);
        if (!on) {
            return;
        }
        s.focus();
    }
    _ll_getValue() {
        if (lufylegend.LGlobal.inputBox.style.display !== NONE) {
            lufylegend.LGlobal.inputTextField.text = lufylegend.LGlobal.inputTextBox.value;
            LEvent.removeEventListener(lufylegend.LGlobal.inputTextBox, LKeyboardEvent.KEY_DOWN, lufylegend.LGlobal.inputTextField._ll_input);
            lufylegend.LGlobal.inputBox.style.display = NONE;
            if (typeof lufylegend.LGlobal.inputTextField.preventDefault !== UNDEFINED) {
                lufylegend.LGlobal.preventDefault = lufylegend.LGlobal.inputTextField.preventDefault;
            }
            lufylegend.LGlobal.inputTextField.dispatchEvent(LFocusEvent.FOCUS_OUT);
            lufylegend.LGlobal.inputTextField = null;
        }
    }
    updateInput() {
        let s = this;
        if (s.texttype === LTextFieldType.INPUT && lufylegend.LGlobal.inputTextField.objectIndex === s.objectIndex) {
            lufylegend.LGlobal.inputTextBox.value = lufylegend.LGlobal.inputTextField.text;
        }
    }
    _ll_input(e) {
        let event = new LEvent(LTextEvent.TEXT_INPUT);
        event.keyCode = e.keyCode;
        lufylegend.LGlobal.inputTextField.text = lufylegend.LGlobal.inputTextBox.value;
        if (lufylegend.LGlobal.inputTextField.hasEventListener(LTextEvent.TEXT_INPUT)) {
            e.returnValue = lufylegend.LGlobal.inputTextField.dispatchEvent(event);
        } else {
            e.returnValue = true;
        }
    }
    focus() {
        let s = this, sc, sx, sy, rc;
        if (!s.parent) {
            return;
        }
        if (s.texttype !== LTextFieldType.INPUT) {
            return;
        }
        if (lufylegend.LGlobal.inputTextField && lufylegend.LGlobal.inputTextField.objectIndex !== s.objectIndex) {
            s._ll_getValue();
        }
        s.dispatchEvent(LFocusEvent.FOCUS_IN);
        sc = s.getAbsoluteScale();
        lufylegend.LGlobal.inputBox.style.display = '';
        lufylegend.LGlobal.inputBox.name = 'input' + s.objectIndex;
        lufylegend.LGlobal.inputTextField = s;
        lufylegend.LGlobal.inputTextareaBoxObj.style.display = NONE;
        lufylegend.LGlobal.inputTextBoxObj.style.display = NONE;
        lufylegend.LGlobal.passwordBoxObj.style.display = NONE;
        if (s.displayAsPassword) {
            lufylegend.LGlobal.inputTextBox = lufylegend.LGlobal.passwordBoxObj;
        } else if (s.multiline) {
            lufylegend.LGlobal.inputTextBox = lufylegend.LGlobal.inputTextareaBoxObj;
        } else {
            lufylegend.LGlobal.inputTextBox = lufylegend.LGlobal.inputTextBoxObj;
        }
        sx = parseInt(lufylegend.LGlobal.canvasObj.style.width) / lufylegend.LGlobal.canvasObj.width;
        sy = parseInt(lufylegend.LGlobal.canvasObj.style.height) / lufylegend.LGlobal.canvasObj.height;
        lufylegend.LGlobal.inputTextBox.style.display = '';
        lufylegend.LGlobal.inputTextBox.value = s.text;
        lufylegend.LGlobal.inputTextBox.style.height = s.inputBackLayer.getHeight() * sc.scaleY * s.scaleY * sy + 'px';
        lufylegend.LGlobal.inputTextBox.style.width = s.inputBackLayer.getWidth() * sc.scaleX * s.scaleX * sx + 'px';
        lufylegend.LGlobal.inputTextBox.style.color = s.color;
        lufylegend.LGlobal.inputTextBox.style.fontSize = ((s.size * parseFloat(lufylegend.LGlobal.canvasObj.style.height) / lufylegend.LGlobal.canvasObj.height) >> 0) + 'px';
        lufylegend.LGlobal.inputTextBox.style.fontFamily = s.font;
        LEvent.addEventListener(lufylegend.LGlobal.inputTextBox, LKeyboardEvent.KEY_DOWN, lufylegend.LGlobal.inputTextField._ll_input);
        if (s.texttype === LTextFieldType.INPUT) {
            rc = s.getRootCoordinate();
            if (lufylegend.LGlobal.inputBox.name === 'input' + s.objectIndex) {
                lufylegend.LGlobal.inputBox.style.marginTop = (parseInt(lufylegend.LGlobal.canvasObj.style.marginTop) + (((rc.y + s.inputBackLayer.startY()) * parseInt(lufylegend.LGlobal.canvasObj.style.height) / lufylegend.LGlobal.canvasObj.height) >>> 0)) + 'px';
                lufylegend.LGlobal.inputBox.style.marginLeft = (parseInt(lufylegend.LGlobal.canvasObj.style.marginLeft) + (((rc.x + s.inputBackLayer.startX()) * parseInt(lufylegend.LGlobal.canvasObj.style.width) / lufylegend.LGlobal.canvasObj.width) >>> 0)) + 'px';
            }
        }
        setTimeout(function() {
            if (lufylegend.LGlobal.ios) {
                s.preventDefault = lufylegend.LGlobal.preventDefault;
                lufylegend.LGlobal.preventDefault = false;
            }
            lufylegend.LGlobal.inputTextBox.focus();
        }, 0);
    }
    _getWidth() {
        let s = this;
        if (s.wordWrap) {
            return s.width;
        }
        if (lufylegend.LGlobal.enableWebGL) {
            this._createCanvas();
        }
        let c = lufylegend.LGlobal.enableWebGL ? s._context : lufylegend.LGlobal.canvas;
        c.font = s.size + 'px ' + s.font;
        return c.measureText(s.text).width;
    }
    getWidth(maskSize) {
        let s = this, w, mx, mw;
        w = s._getWidth() * s.scaleX;
        if (maskSize && s.mask) {
            mx = s.mask._startX ? s.mask._startX() : s.mask.startX();
            if (mx > w) {
                return 0;
            }
            mw = s.mask.getWidth();
            if (mx + mw > w) {
                return w - mx;
            } else {
                return mw;
            }
        }
        return w;
    }
    _startX(maskSize) {
        let s = this;
        if (s.textAlign === 'left') {
            return s.x;
        }
        let w = s.getWidth(maskSize);
        return s.x + (s.textAlign === 'right' ? -w : -w * 0.5);
    }
    _getHeight() {
        let s = this;
        if (lufylegend.LGlobal.enableWebGL) {
            this._createCanvas();
        }
        let c = lufylegend.LGlobal.enableWebGL ? s._context : lufylegend.LGlobal.canvas, i, l, j, k, m, enter;
        if (s.wordWrap) {
            c.font = s.weight + ' ' + s.size + 'px ' + s.font;
            if (s.height === 0) {
                j = 0, k = 0, m = 0;
                for (i = 0, l = s.text.length; i < l; i++) {
                    enter = /(?:\r\n|\r|\n|¥n)/.exec(s.text.substr(i, 1));
                    if (enter) {
                        j = 0;
                        k = i + 1;
                        m++;
                    }
                    j = c.measureText(s.text.substr(k, i + 1 - k)).width;
                    if (s.wordWrap && j + c.measureText(s.text.substr(i + 1, 1)).width > s.width) {
                        j = 0;
                        k = i + 1;
                        m++;
                    }
                }
                s.height = (m + 1) * s.wordHeight;
            }
            return s.height;
        }
        c.font = s.weight + ' ' + s.size + 'px ' + s.font; 
        l = c.measureText('O').width * 1.2;
        if (s.heightMode === LTextField.HEIGHT_MODE_BASELINE) {
            l = l * 1.2;
        }
        return l;
    }
    getHeight(maskSize) {
        let s = this, h, my, mh;
        h = s._getHeight() * s.scaleY;
        if (maskSize && s.mask) {
            my = s.mask._startY ? s.mask._startY() : s.mask.startY();
            if (my > h) {
                return 0;
            }
            mh = s.mask.getHeight();
            if (my + mh > h) {
                return h - my;
            } else {
                return mh;
            }
        }
        return h;
    }
    wind(listener) {
        let s = this;
        s.wind_over_function = listener;
        s.windRunning = true;
        s._ll_wind_text = s.text;
        s.text = '';
        s._ll_wind_length = 0;
    }
    _ll_windRun() {
        let s = this;
        if (s._speedIndex++ < s.speed) {
            return;
        }
        s._speedIndex = 0;
        if (s._ll_wind_length > s._ll_wind_text.length) {
            s.windRunning = false;
            if (s.wind_over_function) {
                s.wind_over_function();
            }
            s.dispatchEvent(new LEvent(LTextEvent.WIND_COMPLETE));
            return;
        }
        s.text = s._ll_wind_text.substring(0, s._ll_wind_length);
        s._ll_wind_length++;
    }
    windComplete() {
        let s = this;
        s._speedIndex = s.speed;
        s.text = s._ll_wind_text;
        s._ll_wind_length = s._ll_wind_text.length + 1;
        s._ll_windRun();
    }
    die() {
        LMouseEventContainer.removeInputBox(this);
    }
}
LTextField.HEIGHT_MODE_BOTTOM = 'bottom';
LTextField.HEIGHT_MODE_BASELINE = 'baseline';
export default LTextField;
