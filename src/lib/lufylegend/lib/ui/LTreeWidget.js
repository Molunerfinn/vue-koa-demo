import LSprite from '../../display/LSprite';
import LMouseEvent from '../../events/LMouseEvent';
import LTextField from '../../text/LTextField';
class LTreeWidget extends LSprite {
    constructor(list, style) {
        super();
        let s = this;
        s.list = list;
        if (!style) {
            style = {};
        }
        if (!style.textColor) {
            style.textColor = 'black';
        }
        if (!style.textSize) {
            style.textSize = 11;
        }
        if (!style.textFont) {
            style.textFont = 'Arial';
        }
        if (!style.textWeight) {
            style.textWeight = 'normal';
        }
        if (!style.branchIndent) {
            style.branchIndent = 10;
        }
        if (!style.branchButtonColor) {
            style.branchButtonColor = 'black';
        }
        s.style = style;
        s._branchBtnSize = style.textSize - 1;
        s._createBranch(s, s, 0, s.list);
    }
    _createBranch(layer, parentBranch, deep, list) {
        let s = this;
        let toY = 0;
        for (let i = 0, l = list.length; i < l; i++) {
            let item = list[i];
            let branchLayer = new LSprite();
            branchLayer.parentBranch = parentBranch;
            branchLayer.y = toY;
            layer.addChild(branchLayer);
            let textLayer = new LSprite();
            textLayer.x = s._branchBtnSize + 5;
            branchLayer.addChild(textLayer);
            if (item.click) {
                textLayer.addEventListener(LMouseEvent.MOUSE_UP, item.click);
            }
            let textObj = new LTextField();
            textObj.text = item.label;
            textObj.color = s.style.textColor;
            textObj.size = s.style.textSize;
            textObj.weight = s.style.textWeight;
            textObj.font = s.style.textFont;
            textLayer.addChild(textObj);
	
            if (item.branch && item.branch.length > 0) {
                branchLayer.branch = new LSprite();
                branchLayer.branch.x = 30;
                branchLayer.branch.y = branchLayer.getHeight() + s.style.branchIndent;
                branchLayer.branch.visible = false;
                branchLayer.addChild(branchLayer.branch);
	
                let branchBtn = new LSprite();
                branchBtn.root = s;
                branchBtn.status = LTreeWidget.BRANCH_CLOSE;
                branchBtn.y = (textLayer.getHeight() - s._branchBtnSize) / 2;
                branchBtn.graphics.drawRect(0, '', [0, 0, s._branchBtnSize, s._branchBtnSize]);
                branchBtn.graphics.drawVertices(0, '', [[0, 0], [s._branchBtnSize, s._branchBtnSize / 2], [0, s._branchBtnSize]], true, s.style.branchButtonColor);
                branchLayer.addChild(branchBtn);
                branchBtn.addEventListener(LMouseEvent.MOUSE_UP, s._openOrCloseBranch);
	
                s._createBranch(branchLayer.branch, branchLayer, deep + 1, item.branch);
            }
	
            toY += branchLayer.getHeight() + s.style.branchIndent;
        }
    }
    _openOrCloseBranch(event) {
        let branchBtn = event.currentTarget;
        let s = branchBtn.root;
        let branchLayer = branchBtn.parent;
        let p = branchLayer.parent;
        let currentBranchIndex = p.getChildIndex(branchLayer);
	
        if (branchBtn.status === LTreeWidget.BRANCH_CLOSE) {
            branchLayer.branch.visible = true;
            branchBtn.graphics.clear();
            branchBtn.graphics.drawRect(0, '', [0, 0, s._branchBtnSize, s._branchBtnSize]);
            branchBtn.graphics.drawVertices(0, '', [[0, 0], [s._branchBtnSize, 0], [s._branchBtnSize / 2, s._branchBtnSize]], true, s.style.branchButtonColor);
            branchBtn.status = LTreeWidget.BRANCH_OPEN;
        } else {
            branchLayer.branch.visible = false;
            branchBtn.graphics.clear();
            branchBtn.graphics.drawRect(0, '', [0, 0, s._branchBtnSize, s._branchBtnSize]);
            branchBtn.graphics.drawVertices(0, '', [[0, 0], [s._branchBtnSize, s._branchBtnSize / 2], [0, s._branchBtnSize]], true, s.style.branchButtonColor);
            branchBtn.status = LTreeWidget.BRANCH_CLOSE;
        }
	
        while (p.objectIndex !== s.parent.objectIndex) {
            let toY = branchLayer.y;
            for (let i = currentBranchIndex; i < p.childList.length; i++) {
                let currentBranch = p.childList[i];
                currentBranch.y = toY;
                toY += currentBranch.getHeight() + s.style.branchIndent;
            }
            branchLayer = branchLayer.parentBranch;
            p = branchLayer.parent;
            currentBranchIndex = p.getChildIndex(branchLayer);
        }
    }
}
LTreeWidget.BRANCH_OPEN = 'branch_open';
LTreeWidget.BRANCH_CLOSE = 'branch_close';
export default LTreeWidget;