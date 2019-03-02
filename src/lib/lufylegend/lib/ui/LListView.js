import LSprite from '../../display/LSprite';
import LBitmapData from '../../display/LBitmapData';
import LBitmap from '../../display/LBitmap';
import LRectangle from '../../geom/LRectangle';
import lufylegend from '../../ll';
import LEvent from '../../events/LEvent';
import LMouseEvent from '../../events/LMouseEvent';
import LPoint from '../../geom/LPoint';
import { UNDEFINED } from '../../utils/LConstant';
import LPanel from './LPanel';
import LFocusEvent from '../../events/LFocusEvent';
import LTweenLite from '../../transitions/LTweenLite';
import LEasing from '../../transitions/LEasing';
export class LListView extends LSprite {
    constructor() {
        super();
        let self = this;
        let bitmapData = new LBitmapData('#fff000', 0, 0, 100, 100, LBitmapData.DATA_CANVAS);
        self.bitmap = new LBitmap(bitmapData);
        self.addChild(self.bitmap);


        self.clipping = new LRectangle(0, 0, 100, 100);
        self.clipping.parent = self;
        if (lufylegend.LGlobal.enableWebGL) {
            self.bitmap.visible = false;
            self.childLayer = new LSprite();
            self.addChild(self.childLayer);
            self.childLayer.mask = new LSprite();
        }
        self.cellWidth = 100;
        self.cellHeight = 100;
        self.arrangement = LListView.Direction.Horizontal;
        self.movement = LListView.Direction.Vertical;
        self.dragEffect = LListView.DragEffects.MomentumAndSpring;
        self.centerOn = false;
        self.scrollBarVertical = new LListScrollBar();
        self.addChild(self.scrollBarVertical);
        self.scrollBarHorizontal = new LListScrollBar();
        self.addChild(self.scrollBarHorizontal);
        self.maxPerLine = 1;
        self._ll_items = [];
        self._ll_x = Number.MAX_VALUE;
        self._ll_y = 0;
        self.addEventListener(LEvent.ENTER_FRAME, self._ll_onframe);
        self.addEventListener(LMouseEvent.MOUSE_DOWN, self._ll_ondown);
        self.resize(100, 100);
    }
    setVerticalScrollBar(value) {
        let self = this;
        self.scrollBarVertical.remove();
        self.scrollBarVertical = value;
        self.addChild(self.scrollBarVertical);
        self.scrollBarVertical.resizeHeight(self.clipping.height);
    }
    setHorizontalScrollBar(value) {
        let self = this;
        self.scrollBarHorizontal.remove();
        self.scrollBarHorizontal = value;
        self.addChild(self.scrollBarHorizontal);
        self.scrollBarHorizontal.resizeWidth(self.clipping.width);
    }
    resize(w, h) {
        let self = this;
        w = w >>> 0;
        h = h >>> 0;
        let bitmapData = self.bitmap.bitmapData;
        bitmapData.image.height = bitmapData.height = h;
        bitmapData.image.width = bitmapData.width = w;
        self.clipping.width = w;
        self.clipping.height = h;
        self.scrollBarVertical.x = self.clipping.width;
        self.scrollBarHorizontal.y = self.clipping.height;
        self.scrollBarVertical.resizeHeight(self.clipping.height);
        self.scrollBarHorizontal.resizeWidth(self.clipping.width);
        self.resizeScrollBar();
        if (lufylegend.LGlobal.enableWebGL) {
            self.childLayer.mask.graphics.clear();
            self.childLayer.mask.graphics.drawRect(0, '#ff0000', 
                [0, 0, self.clipping.width, self.clipping.height]);
        }
    }
    _ll_ondown(event) {
        let self = event.currentTarget;
        let dragObject = new LListViewDragObject(self, event.selfX, event.selfY);
        lufylegend.LGlobal.stage.addChild(dragObject);
        dragObject.startDrag(event.touchPointID);
        self.clickOnChild(event.selfX, event.selfY, 'touch');
    }
    updateView() {
        let self = this;
        self._ll_x = Number.MAX_VALUE;
    }
    getItems() {
        return this._ll_items;
    }
    isInClipping(index) {
        let self = this, x, y;
        if (self.arrangement === LListView.Direction.Horizontal) {
            x = (index % self.maxPerLine) * self.cellWidth;
            y = (index / self.maxPerLine >>> 0) * self.cellHeight;
        } else {
            x = (index / self.maxPerLine >>> 0) * self.cellWidth;
            y = (index % self.maxPerLine) * self.cellHeight;
        }
        return self.clipping.x <= x && self.clipping.x + self.clipping.width > x && self.clipping.y <= y && self.clipping.y + self.clipping.height > y;
    }
    _ll_onframe(event) {
        let self = event.currentTarget;
        if (self.clipping.x === self._ll_x && self.clipping.y === self._ll_y) {
            return;
        }
        if (lufylegend.LGlobal.enableWebGL) {
            self.childLayer.x = -self.clipping.x;
            self.childLayer.y = -self.clipping.y;
            for (let i = 0;i < self.childLayer.childList.length;i++) {
                self.childLayer.childList[i].visible = false;
            }
        } else {
            self.bitmap.bitmapData.clear();
        }
        let length = self._ll_items.length;
        let startX = self.clipping.x / self.cellWidth >> 0;
        let startY = self.clipping.y / self.cellHeight >> 0;
        let addX;
        let addY;
        addX = addY = 1;
        if (self.arrangement === LListView.Direction.Horizontal) {
            for (let i = 0, l = Math.ceil(self.clipping.height / self.cellHeight) + addY; i < l; i++) {
                let xIndex = (startY + i) * self.maxPerLine + startX;
                for (let j = 0, jl = Math.ceil(self.clipping.width / self.cellWidth) + addX;j < self.maxPerLine && j < jl; j++) {
                    let index = xIndex + j;
                    if (index < 0) continue;
                    if (index >= length) {
                        break;
                    }
                    let item = self._ll_items[index];
                    let x = (index % self.maxPerLine) * self.cellWidth;
                    let y = (index / self.maxPerLine >>> 0) * self.cellHeight;
                    item.updateView(self.bitmap, new LRectangle(0, 0, self.cellWidth, self.cellHeight), new LPoint(x - self.clipping.x, y - self.clipping.y));
                }
            }
        } else {
            for (let i = 0, l = Math.ceil(self.clipping.width / self.cellWidth) + addX; i < l; i++) {
                let yIndex = (startX + i) * self.maxPerLine + startY;
                for (let j = 0, jl = Math.ceil(self.clipping.height / self.cellHeight) + addY;j < self.maxPerLine && j < jl; j++) {
                    let index = yIndex + j;
                    if (index < 0) continue;
                    if (index >= length) {
                        break;
                    }
                    let item = self._ll_items[index];
                    let y = (index % self.maxPerLine) * self.cellHeight;
                    let x = (index / self.maxPerLine >>> 0) * self.cellWidth;
                    item.updateView(self.bitmap, new LRectangle(0, 0, self.cellWidth, self.cellHeight), new LPoint(x - self.clipping.x, y - self.clipping.y));
                }
            }
        }
        self.setScrollBarsPositon();
        self._ll_x = self.clipping.x;
        self._ll_y = self.clipping.y;
    }
    clickOnChild(selfX, selfY, type) {
        let self = this;
        let x = self.clipping.x + selfX;
        let y = self.clipping.y + selfY;
        let index;
        if (self.arrangement === LListView.Direction.Horizontal) {
            index = (y / self.cellHeight >>> 0) * self.maxPerLine + (x / self.cellWidth >>> 0);
        } else {
            index = (y / self.cellHeight >>> 0) + (x / self.cellWidth >>> 0) * self.maxPerLine;
        }
        if (index < self._ll_items.length) {
            let child = self._ll_items[index];
            let event = { currentTarget: self, target: child, offsetX: lufylegend.LGlobal.offsetX, offsetY: lufylegend.LGlobal.offsetY, selfX: (x % self.cellWidth), selfY: (y % self.cellHeight) };
            if (type === 'touch') {
                child.onTouch(event);
            } else {
                child.onClick(event);
            }
        }
    }
    insertChildView(child, index) {
        let self = this;
        if (lufylegend.LGlobal.enableWebGL) {
            if (typeof index === UNDEFINED) {
                self.childLayer.addChild(child);
            } else {
                self.childLayer.addChildAt(child, index);
            }
        }
        if (typeof index === UNDEFINED) {
            self._ll_items.push(child);
        } else {
            self._ll_items.splice(index, 0, child);
        }
        self.resizeScrollBar();
    }
    clear() {
        let self = this;
        for (let i = 0, l = self._ll_items.length; i < l; i++) {
            self._ll_items[i].die();
            self._ll_items[i].removeAllChild();
        }
        self._ll_items.length = 0;
        self.resizeScrollBar();
    }
    deleteChildView(child) {
        let self = this, c = self._ll_items, i, l;
        for (i = 0, l = c.length; i < l; i++) {
            if (child.objectIndex === c[i].objectIndex) {
                c[i].die();
                c[i].removeAllChild();
                self._ll_items.splice(i, 1);
                break;
            }
        }
        self.resizeScrollBar();
    }
    updateList(list) {
        let self = this;
        self._ll_items = list;
        self.resizeScrollBar();
    }
	
    setScrollBarsPositon() {
        let self = this;
        if (self.allWidth > 0) {
            self.scrollBarHorizontal.setX(self.clipping.x / self.allWidth);
        }
        if (self.allHeight > 0) {
            self.scrollBarVertical.setY(self.clipping.y / self.allHeight);
        }
    }
    dragStart() {
        let self = this;
        if (self.scrollBarHorizontal.showCondition === LListView.ScrollBarCondition.WhenDragging) {
            self.scrollBarHorizontal.visible = true;
        }
        if (self.scrollBarVertical.showCondition === LListView.ScrollBarCondition.WhenDragging) {
            self.scrollBarVertical.visible = true;
        }
    }
    dragEnd() {
        let self = this;
        if (self.scrollBarHorizontal.showCondition === LListView.ScrollBarCondition.WhenDragging) {
            self.scrollBarHorizontal.visible = false;
        }
        if (self.scrollBarVertical.showCondition === LListView.ScrollBarCondition.WhenDragging) {
            self.scrollBarVertical.visible = false;
        }
    }
    resizeScrollBar() {
        let self = this, scaleX, scaleY, w, h;
        let length = self._ll_items.length;
        if (self.arrangement === LListView.Direction.Horizontal) {
            w = self.cellWidth * (length > self.maxPerLine ? self.maxPerLine : length);
            h = self.cellHeight * Math.ceil(length / self.maxPerLine);
        } else {
            h = self.cellHeight * (length > self.maxPerLine ? self.maxPerLine : length);
            w = self.cellWidth * Math.ceil(length / self.maxPerLine);
        }
        scaleX = self.clipping.width < w ? self.clipping.width / w : 1;
        scaleY = self.clipping.height < h ? self.clipping.height / h : 1;
        self.allWidth = w - self.clipping.width;
        self.allHeight = h - self.clipping.height;
        self.scrollBarHorizontal.setWidthScale(scaleX);
        self.setScrollBarVisible(self.scrollBarHorizontal, scaleX);
        self.scrollBarVertical.setHeightScale(scaleY);
        self.setScrollBarVisible(self.scrollBarVertical, scaleY);
        self.updateView();
    }
    setScrollBarVisible(bar, scale) {
        if (bar.showCondition === LListView.ScrollBarCondition.Always) {
            bar.visible = true;
        } else if (bar.showCondition === LListView.ScrollBarCondition.OnlyIfNeeded) {
            if (scale >= 1) {
                bar.visible = false;
            } else {
                bar.visible = true;
            }
        } else {
            bar.visible = false;
        }
    }
    die() {
        let self = this;
        for (let i = 0, l = self._ll_items.length; i < l; i++) {
            self._ll_items[i].die();
            self._ll_items[i].removeAllChild();
        }
        self._ll_items.length = 0;
        super.die();
    }
}
LListView.PULL_TO_REFRESH = 'pull_to_refresh';
LListView.DragEffects = {
    None: 'none', /*无效果*/
    Momentum: 'momentum', /*拖动惯性*/
    MomentumAndSpring: 'momentumAndSpring'/*拖动惯性+边界惯性*/
};
LListView.Direction = {
    Horizontal: 'horizontal', /*水平*/
    Vertical: 'vertical', /*垂直*/
    Unrestricted: 'unrestricted'/*无限制*/
};
LListView.ScrollBarCondition = {
    Always: 'always',
    OnlyIfNeeded: 'onlyIfNeeded',
    WhenDragging: 'whenDragging'
};
export class LListScrollBar extends LSprite {
    constructor(background, foreground, showCondition) {
        super();
        let self = this;
        self.background = background ? background : new LPanel('#333333', 8, 8);
        self.addChild(self.background);
        self.foreground = foreground ? foreground : new LPanel('#CCCCCC', 8, 8);
        self.addChild(self.foreground);
        self.showCondition = showCondition ? showCondition : LListView.ScrollBarCondition.OnlyIfNeeded;
    }
    resizeWidth(value) {
        let self = this;
        self.background.cacheAsBitmap(false);
        self.background.resize(value, self.background.getSize().height);
        self.background.cacheAsBitmap(true);
    }
    resizeHeight(value) {
        let self = this;
        self.background.cacheAsBitmap(false);
        self.background.resize(self.background.getSize().width, value);
        self.background.cacheAsBitmap(true);
    }
    setWidthScale(value) {
        let self = this;
        self.foreground.cacheAsBitmap(false);
        self.foreground.resize(self.background.getSize().width * value, self.foreground.getSize().height);
        self.foreground.cacheAsBitmap(true);
    }
    setHeightScale(value) {
        let self = this;
        self.foreground.cacheAsBitmap(false);
        self.foreground.resize(self.foreground.getSize().width, self.background.getSize().height * value);
        self.foreground.cacheAsBitmap(true);
    }
    setX(scaleX) {
        let self = this;
        if (scaleX < 0) {
            scaleX = 0;
        } else if (scaleX > 1) {
            scaleX = 1;
        }
        self.foreground.x = (self.background.getSize().width - self.foreground.getSize().width) * scaleX;
    }
    setY(scaleY) {
        let self = this;
        if (scaleY < 0) {
            scaleY = 0;
        } else if (scaleY > 1) {
            scaleY = 1;
        }
        self.foreground.y = (self.background.getSize().height - self.foreground.getSize().height) * scaleY;
    }

}
export class LListChildView extends LSprite {
    constructor() {
        super();
    }
    die() {
        let self = this;
        self.cacheAsBitmap(false);
        self.removeAllChild();
        self.ll_baseBitmap = null;
        self.ll_baseRectangle = null;
        self.ll_basePoint = null;
        self._ll_cacheAsBitmap = null;
        self._canvas = null;
        self._context = null;
        super.die();
    }
    updateView(bitmap, rectangle, point) {
        let self = this;
        if (!self._ll_cacheAsBitmap && !lufylegend.LGlobal.enableWebGL) {
            self.cacheAsBitmap(true);
        }
        if (bitmap) {
            self.ll_baseBitmap = bitmap;
            self.ll_baseRectangle = rectangle;
            self.ll_basePoint = point;
        }
        if (!self.ll_baseBitmap) {
            return;
        }
        if (self.ll_basePoint.x > self.ll_baseBitmap.bitmapData.width || self.ll_basePoint.y > self.ll_baseBitmap.bitmapData.height || self.ll_basePoint.x + self.ll_baseRectangle.width < 0 || self.ll_basePoint.y + self.ll_baseRectangle.height < 0) {
            return;
        }
        let listView = self.ll_baseBitmap.parent;
        if (!bitmap) {
            let index = -1, items = listView.getItems(), x, y;
            for (let i = 0, l = items.length;i < l;i++) {
                if (items[i] && items[i].objectIndex === self.objectIndex) {
                    index = i;
                    break;
                }
            }
            if (index < 0) {
                return;
            }
            if (listView.arrangement === LListView.Direction.Horizontal) {
                x = (index % listView.maxPerLine) * listView.cellWidth;
                y = (index / listView.maxPerLine >>> 0) * listView.cellHeight;
            } else {
                x = (index / listView.maxPerLine >>> 0) * listView.cellWidth;
                y = (index % listView.maxPerLine) * listView.cellHeight;
            }
            let isIn = (listView.clipping.x <= x && listView.clipping.x + listView.clipping.width > x && listView.clipping.y <= y && listView.clipping.y + listView.clipping.height > y);
            if (!isIn) {
                return;
            }
            self.ll_basePoint.x = x - listView.clipping.x;
            self.ll_basePoint.y = y - listView.clipping.y;
            if (!lufylegend.LGlobal.enableWebGL) {
                self.ll_baseBitmap.bitmapData.clear(new LRectangle(self.ll_basePoint.x, self.ll_basePoint.y, self.ll_baseRectangle.width, self.ll_baseRectangle.height));
            }
        }
        if (lufylegend.LGlobal.enableWebGL) {
            self.x = self.ll_basePoint.x + listView.clipping.x;
            self.y = self.ll_basePoint.y + listView.clipping.y;
            self.visible = true;
            return;
        }
        self.ll_baseBitmap.bitmapData.copyPixels(self._ll_cacheAsBitmap.bitmapData, self.ll_baseRectangle, self.ll_basePoint);
    }
    onClick(event) {}
    onTouch(event) {}
}
class LListViewDragObject extends LSprite {
    constructor(listView, selfX, selfY) {
        super();
        let self = this;
        self.graphics.drawRect(0, '#000000', [-10, -10, 20, 20]);
        self.listView = listView;
        self.sx = self.x = lufylegend.LGlobal.offsetX;
        self.sy = self.y = lufylegend.LGlobal.offsetY;
        self.vx = self.listView.clipping.x;
        self.vy = self.listView.clipping.y;
        self.pullToRefreshX = self.pullToRefreshY = 0;
        let m = self.listView.getRootMatrix();
        self.needChangeToLocal = (m.b !== 0 || m.c !== 0);
        self.vPoint = new LPoint(self.x, self.y);
        if (self.needChangeToLocal) {
            self.vPoint = self.listView.globalToLocal(self.vPoint);
        }
        self.selfX = selfX;
        self.selfY = selfY;
        if (lufylegend.LGlobal.listViewDragObject) {
            lufylegend.LGlobal.listViewDragObject.remove();
        }
        self.horizontalStop = true, self.verticalStop = true;
        if (listView.movement === LListView.Direction.Unrestricted) {
            self.horizontalStop = self.verticalStop = false;
        } else if (listView.movement === LListView.Direction.Horizontal) {
            self.horizontalStop = false;
            self.verticalStop = true;
        } else if (listView.movement === LListView.Direction.Vertical) {
            self.horizontalStop = true;
            self.verticalStop = false;
        }
        listView.dragStart();
        lufylegend.LGlobal.listViewDragObject = self;
        self.addEventListener(LMouseEvent.MOUSE_UP, self._ll_onup);
        self.addEventListener(LEvent.ENTER_FRAME, self._ll_onframe);
        lufylegend.LGlobal.stage.addEventListener(LFocusEvent.FOCUS_OUT, self._ll_focusout);
    }
    _ll_onup(event) {
        let self = event.currentTarget;
        self._ll_stop();
    }
    _ll_focusout(event) {
        let self = lufylegend.LGlobal.listViewDragObject;
        if (self) {
            self._ll_stop();
        }
    }
    _ll_stop() {
        let self = this;
        if (self.isDeleted) {
            return;
        }
        let listView = self.listView;
        listView.dragEnd();
        self.stopDrag();
        self.isDeleted = true;
        if (Math.abs(lufylegend.LGlobal.offsetX - self.sx) < 5 && Math.abs(lufylegend.LGlobal.offsetY - self.sy) < 5) {
            listView.clickOnChild(lufylegend.LGlobal.offsetX - self.sx + self.selfX, lufylegend.LGlobal.offsetY - self.sy + self.selfY);
        }
		
        if (listView.dragEffect === LListView.DragEffects.None) {
            return;
        }
        let move = self.inertia();
        if (self.pullToRefreshX !== 0 || self.pullToRefreshY !== 0) {
            let event = new LEvent(LListView.PULL_TO_REFRESH);
            event.pullToRefreshX = self.pullToRefreshX;
            event.pullToRefreshY = self.pullToRefreshY;
            listView.dispatchEvent(event);
        }
        if (move) {
            return;
        }
        self._ll_tween();
    }
    inertia() {
        let self = this;
        let listView = self.listView;
        if (typeof self.fX === UNDEFINED) {
            self.fX = listView.clipping.x;
            self.fY = listView.clipping.y;
        }
        let mx = listView.clipping.x - self.fX;
        let my = listView.clipping.y - self.fY;
        if (Math.abs(mx) < 5) {
            mx = 0;
        }
        if (Math.abs(my) < 5) {
            my = 0;
        }
        if (mx === 0 && my === 0) {
            return false;
        }
        let tx = listView.clipping.x;
        let ty = listView.clipping.y;
        if (mx !== 0) {
            tx += mx * 5;
        }
        if (my !== 0) {
            ty += my * 5;
        }
        if (listView.dragEffect === LListView.DragEffects.Momentum) {
            if (tx < 0) {
                tx = 0;
            } else if (tx > listView.allWidth) {
                tx = listView.allWidth;
            }
            if (ty < 0) {
                ty = 0;
            } else if (ty > listView.allHeight) {
                ty = listView.allHeight;
            }
        }
        LListViewDragObject.listToPosition(listView, tx, ty, () => {
            self.tweenComplete();
        });
        return true;
    }
    tweenComplete() {
        this.dragAmend();
    }
    _ll_tween() {
        let self = this;
        LListViewDragObject.listToPosition(self.listView, self.toX, self.toY);
    }
    _ll_onframe(event) {
        let self = event.currentTarget;
        if (self.isDeleted) {
            self.remove();
            lufylegend.LGlobal.listViewDragObject = null;
            return;
        }
        let listView = self.listView;
        self.fX = self.toX = listView.clipping.x;
        self.fY = self.toY = listView.clipping.y;
		
        self.nPoint = new LPoint(self.x, self.y);
        if (self.needChangeToLocal) {
            self.nPoint = self.listView.globalToLocal(self.nPoint);
        }
        if (!self.horizontalStop) {
            listView.clipping.x = self.vPoint.x - self.nPoint.x + self.vx;
        }
        if (!self.verticalStop) {
            listView.clipping.y = self.vPoint.y - self.nPoint.y + self.vy;
        }
        self.dragAmend();
    }
    dragAmend() {
        let self = this, listView, dragObject = false;
        if (self.listView) {
            listView = self.listView;
            dragObject = true;
        } else {
            listView = self.parent;
        }
        let tx = listView.clipping.x;
        let ty = listView.clipping.y;
        self.pullToRefreshX = self.pullToRefreshY = 0;
        if (listView.clipping.x < 0) {
            if (!dragObject) {
                tx = 0;
            } else if (listView.dragEffect === LListView.DragEffects.MomentumAndSpring) {
                listView.clipping.x *= 0.5;
                self.toX = 0;
                self.pullToRefreshX = listView.clipping.x - tx;
            } else {
                listView.clipping.x = 0;
            }
        } else {
            let length = listView._ll_items.length, width;
            if (listView.arrangement === LListView.Direction.Horizontal) {
                width = (length > listView.maxPerLine ? listView.maxPerLine : length) * listView.cellWidth;
            } else {
                width = Math.ceil(length / listView.maxPerLine) * listView.cellWidth;
            }
            if (width <= listView.clipping.width) {
                if (dragObject) {
                    listView.clipping.x = 0;
                } else {
                    tx = 0;
                }
            } else if (listView.clipping.x > width - listView.clipping.width) {
                if (!dragObject) {
                    tx = width - listView.clipping.width;
                } else if (listView.dragEffect === LListView.DragEffects.MomentumAndSpring) {
                    self.toX = width - listView.clipping.width;
                    listView.clipping.x = self.toX + (listView.clipping.x - width + listView.clipping.width) * 0.5;
                    self.pullToRefreshX = listView.clipping.x - tx;
                } else {
                    listView.clipping.x = width - listView.clipping.width;
                }
            }
        }
        if (listView.clipping.y < 0) {
            if (!dragObject) {
                ty = 0;
            } else if (listView.dragEffect === LListView.DragEffects.MomentumAndSpring) {
                listView.clipping.y *= 0.5;
                self.toY = 0;
                self.pullToRefreshY = listView.clipping.y - ty;
            } else {
                listView.clipping.y = 0;
            }
        } else {
            let length = listView._ll_items.length, height;
            if (listView.arrangement === LListView.Direction.Horizontal) {
                height = Math.ceil(length / listView.maxPerLine) * listView.cellHeight;
            } else {
                height = (length > listView.maxPerLine ? listView.maxPerLine : length) * listView.cellHeight;
            }
            if (height <= listView.clipping.height) {
                if (dragObject) {
                    listView.clipping.y = 0;
                } else {
                    ty = 0;
                }
            } else if (listView.clipping.y > height - listView.clipping.height) {
                if (!dragObject) {
                    ty = height - listView.clipping.height;
                } else if (listView.dragEffect === LListView.DragEffects.MomentumAndSpring) {
                    self.toY = height - listView.clipping.height;
                    listView.clipping.y = self.toY + (listView.clipping.y - height + listView.clipping.height) * 0.5;
                    self.pullToRefreshY = listView.clipping.y - ty;
                } else {
                    listView.clipping.y = height - listView.clipping.height;
                }
            }
        }
        if (!dragObject && (tx !== listView.clipping.x || ty !== listView.clipping.y)) {
            LListViewDragObject.listToPosition(listView, tx, ty);
        }
    }
}
LListViewDragObject.listToPosition = function(listView, tx, ty, tweenComplete) {
    if (listView.centerOn) {
        let centerX = -(listView.clipping.width % listView.cellWidth) / 2;
        let centerY = -(listView.clipping.height % listView.cellHeight) / 2;
        let px, py;
        if (tx % listView.cellWidth > listView.cellWidth * 0.5) {
            px = Math.ceil(tx / listView.cellWidth);
        } else {
            px = Math.floor(tx / listView.cellWidth);
        }
        if (ty % listView.cellHeight > listView.cellHeight * 0.5) {
            py = Math.ceil(ty / listView.cellHeight);
        } else {
            py = Math.floor(ty / listView.cellHeight);
        }
        tx = centerX + px * listView.cellWidth;
        ty = centerY + py * listView.cellHeight;
    }
    LTweenLite.to(listView.clipping, 0.3, { x: tx, y: ty, ease: LEasing.Sine.easeOut, onComplete: tweenComplete });
};
