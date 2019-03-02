import ControllerAnimation from './ControllerAnimation';
import LTweenLite from '../../../lufylegend/transitions/LTweenLite';
import LGlobal from '../../../lufylegend/utils/LGlobal';
class PanelAnimation extends ControllerAnimation {
    constructor() {
        super();
    }
    changePanel(oldPanel, newPanel, animation) {
        if (animation === 'fade') {
            this.fadeAnimation(oldPanel, newPanel);
        } else if (animation === 'left') {
            this.leftAnimation(oldPanel, newPanel);
        } else if (animation === 'right') {
            this.rightAnimation(oldPanel, newPanel);
        }
    }
    leftAnimation(oldPanel, newPanel) {
        newPanel.x = -LGlobal.width;
        LTweenLite.to(newPanel, this.duration, { x: 0,
            onUpdate: (event) => {
                oldPanel.x = newPanel.x + LGlobal.width;
            }, 
            onComplete: (event) => {
                oldPanel.x = newPanel.x + LGlobal.width;
                oldPanel.remove();
            } 
        });
    }
    rightAnimation(oldPanel, newPanel) {
        newPanel.x = LGlobal.width;
        LTweenLite.to(newPanel, this.duration, { x: 0,
            onUpdate: (event) => {
                oldPanel.x = newPanel.x - LGlobal.width;
            }, 
            onComplete: (event) => {
                oldPanel.x = newPanel.x - LGlobal.width;
                oldPanel.remove();
            } 
        });
    }
  
}
export default new PanelAnimation();