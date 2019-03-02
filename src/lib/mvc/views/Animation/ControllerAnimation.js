import LTweenLite from '../../../lufylegend/transitions/LTweenLite';
class ControllerAnimation {
    constructor() {
        this.duration = 0.3;
    }
    fadeAnimation(oldPanel, newPanel) {
        newPanel.alpha = 0;
        if (oldPanel) {
            LTweenLite.to(oldPanel, this.duration, { alpha: 0, onComplete: (event) => {
                event.target.remove();
            } });
        }
        LTweenLite.to(newPanel, this.duration, { alpha: 1 });
    }
}
export default ControllerAnimation;