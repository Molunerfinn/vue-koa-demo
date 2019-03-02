import LSprite from '../../display/LSprite';
import LEvent from '../../events/LEvent';
import LButton from '../../display/LButton';
class LTable extends LSprite {
    constructor(row, col, style) {
        super();
        let s = this;
        s.type = 'LTable';
        s.row = row || 0;
        s.col = col || 0;
        if (!style)style = {};
        if (!style.cellWidth)style.cellWidth = 100;
        if (!style.cellHeight)style.cellHeight = 30;
        if (!style.borderWidth)style.borderWidth = 1;
        if (!style.borderColor)style.borderColor = 'black';
        if (!style.backgroundColor)style.backgroundColor = 'white';
        if (!style.selectColor)style.selectColor = '#E0E0E0';
        if (!style.indentX)style.indentX = 10;
        if (!style.indentY)style.indentY = 10;
        s.style = style;
        s._tableSizeData = new Array();
        s._createTableData();
        s._isChange = true;
	
        s._createOriginalTable();
        s.addEventListener(LEvent.ENTER_FRAME, s._onDraw);
    }
    addRow() {
        let s = this;
        let t = s._tableSizeData;
        let st = s.style;
        let rowItem = new Array();
	
        let rowLayer = new LSprite();
        rowLayer.y = s.getHeight();
        s.addChild(rowLayer);
        let toX = 0;
        let w = 0, h = 0;
        for (let i = 0; i < s.col; i++) {
            w = t[s.row - 1][i].width,
            h = st.cellHeight;
	
            let upLayer = new LSprite();
            upLayer.graphics.drawRect(st.borderWidth, st.borderColor, [0, 0, w, h], true, st.backgroundColor);
            let overLayer = new LSprite();
            overLayer.graphics.drawRect(st.borderWidth, st.borderColor, [0, 0, w, h], true, st.selectColor);
	
            let colLayer = new LButton(upLayer, overLayer);
            colLayer.setCursorEnabled(false);
            colLayer.staticMode = true;
            colLayer.x = toX;
            rowLayer.addChild(colLayer);
            colLayer.child = new LSprite();
            colLayer.addChild(colLayer.child);
	
            let colItem = {
                width: w,
                height: h,
            };
            rowItem.push(colItem);
	
            toX += w;
        }
	
        t.push(rowItem);
        s.row++;
    }
    addCol() {
        let s = this;
        let t = s._tableSizeData;
        let st = s.style;
	
        let w = 0, h = 0;
        for (let i = 0; i < s.row; i++) {
            let rowLayer = s.getChildAt(i);
            w = st.cellWidth,
            h = t[i][s.col - 1].height;
	
            let upLayer = new LSprite();
            upLayer.graphics.drawRect(st.borderWidth, st.borderColor, [0, 0, w, h], true, st.backgroundColor);
            let overLayer = new LSprite();
            overLayer.graphics.drawRect(st.borderWidth, st.borderColor, [0, 0, w, h], true, st.selectColor);
	
            let colLayer = new LButton(upLayer, overLayer);
            colLayer.setCursorEnabled(false);
            colLayer.staticMode = true;
            colLayer.x = rowLayer.getWidth();
            rowLayer.addChild(colLayer);
            colLayer.child = new LSprite();
            colLayer.addChild(colLayer.child);
	
            let colItem = {
                width: w,
                height: h,
            };
            t[i].push(colItem);
        }
	
        s.col++;
    }
    setCell(child, row, col) {
        let s = this;
        if (!child || !s.childList[row] || !s.childList[row].childList[col]) return -1;
        s.childList[row].childList[col].child.addChild(child);
        let t = s._tableSizeData;
        if (child.getWidth() >= t[row][col].width) {
            for (let i = 0, l = t.length; i < l; i++) {
                t[i][col].width = child.getWidth() + s.style.indentX * 2;
            }
        }
        if (child.getHeight() >= t[row][col].height) {
            for (let i = 0, l = t[row].length; i < l; i++) {
                t[row][i].height = child.getHeight() + s.style.indentY * 2;
            }
        }
    }
    _onDraw(e) {
        let s = e.target;
        if (!s.childList.length > 0) return;
        let st = s.style;
        let t = s._tableSizeData;
        let toY = 0;
        for (let i = 0; i < s.row; i++) {
            let w = 0, h = 0;
            let rowLayer = s.getChildAt(i);
            rowLayer.y = toY;
	
            if (rowLayer.childList.length > 0) {
                let toX = 0;
                for (let j = 0; j < s.col; j++) {
                    w = t[i][j].width,
                    h = t[i][j].height;
	
                    let colLayer = rowLayer.getChildAt(j);
                    if (w !== colLayer.getWidth() || h !== colLayer.getHeight()) {
                        colLayer.bitmap_up.graphics.drawRect(st.borderWidth, st.borderColor, [0, 0, w, h], true, st.backgroundColor);
                        colLayer.bitmap_over.graphics.drawRect(st.borderWidth, st.borderColor, [0, 0, w, h], true, st.selectColor);
                    }
                    colLayer.x = toX;
	
                    let child = colLayer.child;
                    if (child) {
                        if (child.getWidth() >= w) {
                            for (let k = 0, l = t.length; k < l; k++) {
                                t[k][j].width = child.getWidth() + s.style.indentX * 2;
                            }
                        }
                        if (child.getHeight() >= h) {
                            for (let k = 0, l = t[s.row].length; k < l; k++) {
                                t[i][k].height = child.getHeight() + s.style.indentY * 2;
                            }
                        }
                        w = t[i][j].width,
                        h = t[i][j].height;
                        child.x = (w - child.getWidth()) * 0.5;
                        child.y = (h - child.getHeight()) * 0.5;
                    }
	
                    toX += w;
                }
            }
	
            toY += h;
        }
    }
    _createOriginalTable() {
        let s = this;
        let st = s.style;
        let t = s._tableSizeData;
        let toY = 0;
        for (let i = 0; i < s.row; i++) {
            let w = 0, h = 0;
            let rowLayer = new LSprite();
            rowLayer.y = toY;
            s.addChild(rowLayer);
	
            let toX = 0;
            for (let j = 0; j < s.col; j++) {
                w = t[i][j].width,
                h = t[i][j].height;
	
                let upLayer = new LSprite();
                upLayer.graphics.drawRect(st.borderWidth, st.borderColor, [0, 0, w, h], true, st.backgroundColor);
                let overLayer = new LSprite();
                overLayer.graphics.drawRect(st.borderWidth, st.borderColor, [0, 0, w, h], true, st.selectColor);
	
                let colLayer = new LButton(upLayer, overLayer);
                colLayer.setCursorEnabled(false);
                colLayer.staticMode = true;
                colLayer.x = toX;
                rowLayer.addChild(colLayer);
                colLayer.child = new LSprite();
                colLayer.addChild(colLayer.child);
	
                toX += w;
            }
	
            toY += h;
        }
    }
    _createTableData() {
        let s = this;
        for (let i = 0; i < s.row; i++) {
            let rowItem = new Array();
            for (let j = 0; j < s.col; j++) {
                let colItem = {
                    width: s.style.cellWidth,
                    height: s.style.cellHeight,
                };
                rowItem.push(colItem);
            }
            s._tableSizeData.push(rowItem);
        }
    }
}
export default LTable;