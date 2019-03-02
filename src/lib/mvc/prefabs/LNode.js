import LSprite from '../../lufylegend/display/LSprite';
import LDisplayObject from '../../lufylegend/display/LDisplayObject';
import PrefabContainer from './PrefabContainer';
import LPoint from '../../lufylegend/geom/LPoint';
import ll from '../../lufylegend/ll';
import { UNDEFINED } from '../../lufylegend/utils/LConstant';
class LNode extends LSprite {
    constructor(data) {
        super();
        this.type = 'LNode';
        if (data) {
            this._initDataProperty(data);
            this.init(data);
            this._initDataChildNodes(data);
        }
    }
    _initDataProperty(data) {
        let property = data.property;
        if (!property) {
            return;
        }
        for (let key in property) {
            let value = property[key];
            if (key === 'width') {
                key = '_widgetWidth';
            } else if (key === 'height') {
                key = '_widgetHeight';
            }
            this[key] = value;
        }
    }
    _initDataChildNodes(data) {
        if (!data.childNodes) {
            return;
        }
        for (let childNode of data.childNodes) {
            let child = LNode.create(childNode);
            if (child instanceof LDisplayObject) {
                this.addChild(child);
            }
            if (child instanceof LNode) {
                child.lateInit();
            }
        }
    }
    init(data) {
        
    }
    lateInit() {
    }
    get widgetWidth() {
        if (this._widgetWidth) {
            return this._widgetWidth;
        }
        if (this.sprite && this.sprite.width) {
            return this.sprite.width;
        }
        return this.getWidth();
    }
    get widgetHeight() {
        if (this._widgetHeight) {
            return this._widgetHeight;
        }
        if (this.sprite && this.sprite.height) {
            return this.sprite.height;
        }
        return this.getHeight();
    }
    widgetInit() {
        let target = this._getWidgetTarget(this.widget.target);
        let targetWidth, targetHeight, width, height, widget;
        if (target) {
            targetWidth = target.widgetWidth || target.getWidth();
            targetHeight = target.widgetHeight || target.getHeight();
        } else {
            targetWidth = ll.LGlobal.width;
            targetHeight = ll.LGlobal.height;
        }
        widget = this.widget;
        let resizeH = (typeof widget.top === 'number' && typeof widget.bottom === 'number');
        let resizeW = (typeof widget.left === 'number' && typeof widget.right === 'number');
        if (resizeH) {
            height = targetHeight - widget.top - widget.bottom;
            this._widgetHeight = height;
        } else {
            height = this.widgetHeight;
        }
        if (resizeW) {
            width = targetWidth - widget.left - widget.right;
            this._widgetWidth = width;
        } else {
            width = this.widgetWidth;
        }
        if (resizeH || resizeW) {
            if (typeof this.resize === 'function') {
                this.resize(this.widgetWidth, this.widgetHeight);
            }
        }
        let x, y;
        if (typeof widget.left === 'number') {
            x = widget.left;
        } else if (typeof widget.right === 'number') {
            x = targetWidth - width - widget.right;
        }
        if (typeof widget.top === 'number') {
            y = widget.top;
        } else if (typeof widget.bottom === 'number') {
            y = targetHeight - height - widget.bottom;
        }
        let localPoint = new LPoint(typeof x === UNDEFINED ? 0 : x, typeof y === UNDEFINED ? 0 : y);
        let targetGlobal = target ? target.localToGlobal(localPoint) : localPoint;
        let point = this.parent.globalToLocal(targetGlobal);
        this.x = typeof x === UNDEFINED ? this.x : point.x;
        this.y = typeof y === UNDEFINED ? this.y : point.y;
    }
    _getWidgetTarget(target) {
        if (!target) {
            return null;
        }
        let parent = this.parent;
        while (parent) {
            if (target) {
                if (parent._ll_className === target) {
                    return parent;
                }
            } else if (parent instanceof LNode) {
                return parent;
            }
            
            parent = parent.parent;
            if (typeof parent !== 'object') {
                break;
            }
        }
        return null;
    }
}
LNode.create = function(data) {
    let className = data.class;
    let node, cls = PrefabContainer.get(className);
    if (cls) {
        node = new cls(data);
    } else {
        console.error('class not found : ', className);
    }
    return node;
};
PrefabContainer.set('LNode', LNode);
export default LNode;