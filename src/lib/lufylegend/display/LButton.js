import LSprite from './LSprite';
import LMouseEventContainer from '../events/LMouseEventContainer';
import LMouseEvent from '../events/LMouseEvent';
import LGlobal from '../utils/LGlobal';
import { OS_PC } from '../utils/LConstant';
import ll from '../ll';
import LEasing from '../transitions/LEasing';
class LButton extends LSprite {
    constructor(upState, overState, downState, disableState) {
        super();
        let s = this;
        s.type = 'LButton';
        s.addChild(upState);
        if (!overState) {
            overState = upState;
        } else {
            s.addChild(overState);
        }
        if (!downState) {
            downState = overState;
        } else {
            s.addChild(downState);
        }
        if (!disableState) {
            disableState = upState;
        } else {
            s.addChild(disableState);
        }
        s.upState = s.bitmap_up = upState;
        s.overState = s.bitmap_over = overState;
        s.downState = downState;
        s.disableState = disableState;
        s._ll_down_sx = s.downState.scaleX;
        s._ll_down_sy = s.downState.scaleY;
        s.overState.visible = false;
        s.downState.visible = false;
        s.upState.visible = true;
        s.buttonMode = true;
        s.staticMode = false;
        s.setState(LButton.STATE_ENABLE);
        if (LMouseEventContainer.container[LMouseEvent.MOUSE_MOVE]) {
            LMouseEventContainer.pushButton(s);
        }
        s.addEventListener(LMouseEvent.MOUSE_DOWN, s.ll_modeDown);
        s.setCursorEnabled(true);
    }
	
    setState(state) {
        let s = this;
        if (state === LButton.STATE_DISABLE) {
            s.upState.visible = false;
            s.overState.visible = false;
            s.downState.visible = false;
            s.disableState.visible = true;
            s.mouseEnabled = false;
        } else if (state === LButton.STATE_ENABLE) {
            s.overState.visible = false;
            s.downState.visible = false;
            s.disableState.visible = false;
            s.upState.visible = true;
            s.mouseEnabled = true;
        } else {
            return;
        }
        s.state = state;
    }
    ll_mouseout(e, type, cd, ox, oy) {
        let s = this;
        if (!s.ll_mousein) {
            return;
        }
        e.clickTarget = s;
        s.ll_modeOut(e);
        s.ll_mousein = false;
    }
    mouseEvent(e, type, cd) {
        if (!e) {
            return false;
        }
        let s = this;
        if (LGlobal.os === OS_PC && type === LMouseEvent.MOUSE_MOVE && s.ll_button_mode) {
            s.ll_button_mode(e);
        }
        super.mouseEvent(e, type, cd);
    }
    ll_button_mode(e) {
        let s = this;
        if (!s.visible) {
            return;
        }
        e.clickTarget = s;
        if (s.hitTestPoint(e.offsetX, e.offsetY)) {
            s.ll_modeOver(e);
        } else {
            s.ll_modeOut(e);
        }
    }
    ll_modeDown(e) {
        let s = e.clickTarget, w, h, tw, th, x, y, tx, ty, onComplete;
        if (!s.buttonMode || s.tween) {
            return;
        }
        if (s.state === LButton.STATE_DISABLE) {
            s.upState.visible = false;
            s.overState.visible = false;
            s.downState.visible = false;
            s.disableState.visible = true;
            return;
        }
        s.upState.visible = false;
        s.overState.visible = false;
        s.downState.visible = true;	
        s._tweenOver = s.ll_modeOver;
        onComplete = function(event) {
            let target = event.target;
            let s = target.parent;
            if (!s || !s.tween) {
                return;
            }
            delete s.tween;
            s._tweenOver({ clickTarget: s });
            delete s._tweenOver;
        };
        if (s.staticMode) {
            s.tween = ll.LTweenLiteTimeline.to(s.downState, 0.3, {}).to(s.downState, 0.1, { onComplete: onComplete });
        } else {
            w = s.downState.getWidth();
            h = s.downState.getHeight();
            tw = w * 1.1;
            th = h * 1.1;
            x = s.downState.x;
            y = s.downState.y;
            tx = x + (w - tw) * 0.5;
            ty = y + (h - th) * 0.5;
            s.tween = ll.LTweenLiteTimeline.to(s.downState, 0.3, { x: tx, y: ty, scaleX: s._ll_down_sx * 1.1, scaleY: s._ll_down_sy * 1.1, ease: LEasing.Quart.easeOut })
                .to(s.downState, 0.1, { x: x, y: y, scaleX: s._ll_down_sx, scaleY: s._ll_down_sy, ease: LEasing.Quart.easeOut, onComplete: onComplete });
        }
    }
    ll_modeOver(e) {
        let s = e.clickTarget;
        if (!s.buttonMode) {
            return;
        }
        if (s.tween) {
            s._tweenOver = s.ll_modeOver;
            return;
        }
        if (s.state === LButton.STATE_DISABLE) {
            s.upState.visible = false;
            s.overState.visible = false;
            s.downState.visible = false;
            s.disableState.visible = true;
            return;
        }
        s.upState.visible = false;
        s.downState.visible = false;
        s.overState.visible = true;
    }
    ll_modeOut(e) {
        let s = e.clickTarget;
        if (!s.buttonMode) {
            return;
        }
        if (s.tween) {
            s._tweenOver = s.ll_modeOut;
            return;
        }
        if (s.state === LButton.STATE_DISABLE) {
            s.upState.visible = false;
            s.overState.visible = false;
            s.downState.visible = false;
            s.disableState.visible = true;
            return;
        }
        s.overState.visible = false;
        s.downState.visible = false;
        s.upState.visible = true;
    }
    setCursorEnabled(value) {
        this.useCursor = value ? 'pointer' : null;
    }
    clone() {
        let s = this;
        return new LButton(s.upState.clone(), s.overState.clone(), s.downState.clone(), s.disableState.clone());
    }
    die() {
        let s = this;
        if (LMouseEventContainer.container[LMouseEvent.MOUSE_MOVE]) {
            LMouseEventContainer.removeButton(s);
        }
        super.die();
    }
}
LButton.STATE_DISABLE = 'disable';
LButton.STATE_ENABLE = 'enable';
export default LButton;