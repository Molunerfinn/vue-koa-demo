import LSprite from '../../display/LSprite';
import LBitmapData from '../../display/LBitmapData';
import LBitmap from '../../display/LBitmap';
import LGlobal from '../../utils/LGlobal';
import LButton from '../../utils/LButton';
import LTextField from '../../text/LTextField';
import LMouseEvent from '../../events/LMouseEvent';
import { UNDEFINED } from '../../utils/LConstant';
import { LListView, LListChildView } from './LListView';
export class LComboBox extends LSprite {
    constructor(size, color, font, layerBack, layerUp, layerOver) {
        super();
        let s = this;
        s.type = 'LComboBox';
        s.list = [];
        s.selectIndex = -1;
        s.value = null;
        s.selectWidth = 100;
        let params;
        if (typeof size !== 'object') {
            params = { size: size, color: color, font: font, layerBack: layerBack, layerUp: layerUp, layerOver: layerOver };
        }
        s.size = params.size ? params.size : 16;
        s.font = params.font ? params.font : 'Arial';
        s.color = params.color ? params.color : '#000000'; 
        layerBack = params.layerBack;
        layerUp = params.layerUp;
        layerOver = params.layerOver;

        s.params = params;
        s.maxIndex = 5;
        if (!layerBack) {
            layerBack = new LSprite();
            layerBack.graphics.drawRoundRect(1, '#999999', [0, 0, 200, 30, 4], true, '#f5f5f9');
        }
        s.listView = new LListView();
        s.listView.dragEffect = LListView.DragEffects.Momentum;
        s.listView.cellWidth = s.minWidth = layerBack.getWidth();
        s.listView.cellHeight = s.minHeight = layerBack.getHeight();
        let layer, grd;
        if (!layerUp || !layerOver) {
            let up, down, data;
            grd = LGlobal.canvas.createLinearGradient(0, -20, 0, 40);
            grd.addColorStop(0, '#FFFFFF');
            grd.addColorStop(1, '#CCCCCC');
            up = new LSprite();
            up.graphics.drawRoundRect(1, '#CCCCCC', [0, 0, 22, 22, 2], true, grd);
            up.graphics.drawVertices(1, '#CCCCCC', [[6, 6], [16, 6], [11, 18]], true, '#008000');
            data = new LBitmapData(null, 0, 0, 22, 22, LBitmapData.DATA_CANVAS);
            data.draw(up);
            layerUp = new LBitmap(data);
            down = new LSprite();
            down.graphics.drawRoundRect(1, '#CCCCCC', [0, 0, 22, 22, 2], true, grd);
            down.graphics.drawVertices(1, '#CCCCCC', [[6, 6], [16, 6], [11, 18]], true, '#32CD32');
            data = new LBitmapData(null, 0, 0, 22, 22, LBitmapData.DATA_CANVAS);
            data.draw(down);
            layerOver = new LBitmap(data);
        }
		
        let layer1 = layerBack.clone();
        layerUp.x = layer1.getWidth() - layerUp.getWidth() - 4;
        layerUp.y = 4;
        layer1.arraw = layerUp;
        layer1.addChild(layerUp);
        layer1.cacheAsBitmap(true);
        let layer2 = layerBack.clone();
        layerOver.x = layer2.getWidth() - layerOver.getWidth() - 4;
        layerOver.y = 4;
        layer2.arraw = layerOver;
        layer2.addChild(layerOver);
        layer2.cacheAsBitmap(true);
        layer = new LButton(layer1, layer2);
        layer.setCursorEnabled(false);
        layer.staticMode = true;
		
        s.addChild(layer);
        let label = new LTextField();
        label.x = 4;
        label.y = 4;
        label.text = '';
        label.size = s.size;
        label.color = s.color;
        label.font = s.font;
        layer.addChild(label);
        s.label = label;
        s.layer = layer;
        s.listChildView = LComboBoxChild;
        s.addEventListener(LMouseEvent.MOUSE_UP, s._showChildList);
    }
    deleteChild(value) {
        let s = this, i, l, delIndex = -1;
        for (i = 0, l = s.list.length; i < l; i++) {
            if (s.list[i].value === value) {
                delIndex = i;
                break;
            }
        }
        if (delIndex === -1) {
            return;
        }
        s.list.splice(delIndex, 1);
        if (s.value !== value) {
            return;
        }
        if (s.list.length > 0) {
            s.setValue(s.list[delIndex > 0 ? delIndex - 1 : 0].value);
        } else {
            s.selectIndex = -1;
            s.label.text = '';
            s.value = null;
        }
    }
    setChild(child) {
        let s = this, i, l;
        if (!child || typeof child.value === UNDEFINED || typeof child.label === UNDEFINED) {
            throw 'the child must be an object like:{label:a,value:b}';
        }
		
        for (i = 0, l = s.list.length; i < l; i++) {
            if (s.list[i].value === child.value) {
                return;
            }
        }
        s.list.push(child);
        if (s.list.length === 1) {
            s.setValue(child.value);
        }
    }
    die() {
        let self = this;
        self.listView.die();
        self.listView.removeAllChild();
        super.die();
    }
    _showChildList(event) {
        let s = event.currentTarget;
        if (!s.list || s.list.length === 0) {
            return;
        }
        s.dispatchEvent(LComboBox.PRE_OPEN);
        setTimeout(function() {
            s.showChildList();
        }, 0);
    }
    setListChildView(childClass) {
        this.listChildView = childClass;
    }
    showChildList(list, index) {
        let s = this, i, child;
        if (!list) {
            let translucent = new LSprite();
            translucent.graphics.drawRect(0, '#000000', [0, 0, LGlobal.width, LGlobal.height], true, '#000000');
            translucent.alpha = 0;
            LGlobal.stage.addChild(translucent);
            translucent.addEventListener(LMouseEvent.MOUSE_UP, function(e) {
                let cnt = LGlobal.stage.numChildren;
                if (e.target instanceof LListView) {
                    return;
                }
                let destroy = LGlobal.destroy;
                LGlobal.destroy = false;
                LGlobal.stage.removeChildAt(cnt - 1);
                LGlobal.destroy = destroy;
                LGlobal.stage.removeChildAt(cnt - 2);
            });
            translucent.addEventListener(LMouseEvent.MOUSE_DOWN, function(e) {});
            translucent.addEventListener(LMouseEvent.MOUSE_MOVE, function(e) {});
            translucent.addEventListener(LMouseEvent.MOUSE_OVER, function(e) {});
            translucent.addEventListener(LMouseEvent.MOUSE_OUT, function(e) {});

            let coordinate = s.getRootCoordinate();
            s.listView.x = coordinate.x;
            s.listView.y = coordinate.y + s.layer.getHeight();
            LGlobal.stage.addChild(s.listView);
            if (typeof s.listView._ll_saveY !== UNDEFINED) {
                s.listView.clipping.y = s.listView._ll_saveY;
            }
            list = [];
            index = 0;
        }
        i = index;
        let selected = s.value === s.list[i].value;
        child = new s.listChildView(s.list[i], s, selected);
        if (selected) {
            s.listView._ll_selectedChild = child;
        }
        list.push(child);
        if (index < s.list.length - 1) {
            setTimeout(function() {
                s.showChildList(list, index + 1);
            }, 0);
            return;
        }
        s.listView.resize(s.listView.cellWidth, s.listView.cellHeight * (s.list.length > s.maxIndex ? s.maxIndex : s.list.length));
        s.listView.updateList(list);
        s.dispatchEvent(LComboBox.END_OPEN);
    }
    setValue(value, noEvent) {
        let s = this, c, i, l;
        if (s.value === value) {
            return;
        }
        c = s.list;
        for (i = 0, l = c.length; i < l; i++) {
            if (c[i].value === value) {
                s.selectIndex = i;
                s.value = s.list[s.selectIndex].value;
                s.label.text = s.list[s.selectIndex].label;
                if (!noEvent) {
                    s.dispatchEvent(LComboBox.ON_CHANGE);
                }
                break;
            }
        }
    }
    clone() {
        let s = this, a = new LComboBox(), k, c;
        for (k in s.list) {
            c = s.list[k];
            a.setChild({ label: c.label, value: c.value });
        }	
        a.setValue(s.value);
        return a;
    }
}
LComboBox.ON_CHANGE = 'onchange';
LComboBox.PRE_OPEN = 'pre_open';
LComboBox.END_OPEN = 'end_open';
export class LComboBoxChild extends LListChildView {
    constructor(content, comboBox, selected) {
        super();
        let self = this;
        self.content = content;
        self.comboBox = comboBox;
        if (selected) {
            self.setSelectStatus(content, comboBox);
        } else {
            self.setStatus(content, comboBox);
        }
    }
    setStatus(content, comboBox) {
        let self = this;
        let listView = comboBox.listView;
        self.graphics.drawRect(0, '#f5f5f9', [0, 0, listView.cellWidth, listView.cellHeight], true, '#f5f5f9');
        let text = new LTextField();
        text.size = comboBox.size;
        text.color = comboBox.color;
        text.font = comboBox.font;
        text.text = content.label;
        text.x = text.y = 5;
        self.addChild(text);
        self.updateView();
    }
    setSelectStatus(content, comboBox) {
        let self = this;
        let listView = comboBox.listView;
        self.graphics.clear();
        self.graphics.drawRect(0, '#CCCCCC', [0, 0, listView.cellWidth, listView.cellHeight], true, '#CCCCCC');
        let text = new LTextField();
        text.size = comboBox.size;
        text.color = comboBox.color;
        text.font = comboBox.font;
        text.text = content.label;
        text.x = text.y = 5;
        self.addChild(text);
        self.updateView();
    }
    onTouch(event) {
        let self = event.target;
        let listView = event.currentTarget;
        if (listView._ll_selectedChild) {
            listView._ll_selectedChild.removeAllChild();
            listView._ll_selectedChild.cacheAsBitmap(false);
            listView._ll_selectedChild.setStatus(listView._ll_selectedChild.content, listView._ll_selectedChild.comboBox);
        }
        self.removeAllChild();
        self.cacheAsBitmap(false);
        self.setSelectStatus(self.content, self.comboBox);
        listView._ll_selectedChild = self;
    }
    onClick(event) {
        let self = event.target;
        let listView = event.currentTarget;
        let comboBox = self.comboBox;
        comboBox.setValue(self.content.value);
        for (let i = LGlobal.stage.numChildren - 1;i >= 0;i--) {
            if (LGlobal.stage.childList[i].constructor.name === 'LListViewDragObject') {
                LGlobal.stage.removeChildAt(i);
                LGlobal.listViewDragObject = null;
                continue;
            }
            if (LGlobal.stage.childList[i].objectIndex !== listView.objectIndex) {
                continue;
            }
            let destroy = LGlobal.destroy;
            LGlobal.destroy = false;
            LGlobal.stage.removeChildAt(i);
            LGlobal.destroy = destroy;
            LGlobal.stage.removeChildAt(i - 1);
            listView._ll_saveY = listView.clipping.y;
            break;
        }
    }
}