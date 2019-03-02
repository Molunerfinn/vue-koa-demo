import BaseBindView from './BaseBindView';
import LSprite from '../../lufylegend/display/LSprite';
import LButton from '../../lufylegend/display/LButton';
import LMouseEvent from '../../lufylegend/events/LMouseEvent';
import PrefabContainer from '../prefabs/PrefabContainer';
import LNode from '../prefabs/LNode';
const ButtonTransition = {
    None: 'none',
    Sprite: 'sprite',
    Scale: 'scale'
};
class BindButtonView extends BaseBindView {
    constructor(data) {
        super(data);
    }
    init() {
        super.init();
    }
    updateView() {
        super.updateView();
        let button = this.button;
        if (button.onMouseDown) {
            this._addMouseEvent(LMouseEvent.MOUSE_DOWN, button.onMouseDown);
        }
        if (button.onMouseMove) {
            this._addMouseEvent(LMouseEvent.MOUSE_MOVE, button.onMouseMove);
        }
        if (button.onMouseUp) {
            this._addMouseEvent(LMouseEvent.MOUSE_UP, button.onMouseUp);
        }
    }
    _addMouseEvent(eventType, eventObj) {
        let target = this.getTarget(eventObj.target);
        if (target) {
            this.addEventListener(eventType, (event) => {
                target[eventObj.method](event, eventObj.param);
            });
        }
    }
    get widgetWidth() {
        if (this._widgetWidth) {
            return this._widgetWidth;
        }
        if (this.currentButton.upState.widgetWidth) {
            return this.currentButton.upState.widgetWidth;
        }
        return this.currentButton.upState.getWidth();
    }
    get widgetHeight() {
        if (this._widgetHeight) {
            return this._widgetHeight;
        }
        if (this.currentButton.upState.widgetHeight) {
            return this.currentButton.upState.widgetHeight;
        }
        return this.currentButton.upState.getHeight();
    }
    get currentButton() {
        return this.getChildAt(0);
    }
    _initDataChildNodes(data) {
        if (!data.property || !data.property.button) {
            return;
        }
        let states = [];
        let sprites = [];
        let button = data.property.button;
        states.push(button.upState || new LSprite());
        if (button.transition === ButtonTransition.Sprite) {
            if (button.overState) {
                states.push(button.overState);
            }
            if (button.downState) {
                states.push(button.downState);
            }
            if (button.disableState) {
                states.push(button.disableState);
            }
        }
        for (let childNode of states) {
            if (!childNode) {
                sprites.push(null);
                continue;
            }
            let child = LNode.create(childNode);
            sprites.push(child);
            if (child instanceof LNode) {
                child.lateInit();
            }
        }
        for (let i = sprites.length - 1;i < 4;i++) {
            sprites.push(null);
        }
        let lButton = new LButton(sprites[0], sprites[1], sprites[2], sprites[3]);
        if (button.transition !== ButtonTransition.Scale) {
            lButton.staticMode = true;
        }
        this.addChild(lButton);
    }
}
PrefabContainer.set('BindButtonView', BindButtonView);
export default BindButtonView;