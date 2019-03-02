import LNode from '../prefabs/LNode';
import BaseManager from '../managers/BaseManager';
class BaseView extends LNode {
    init() {
        super.init();
        setTimeout(() => {
            if (this.widget && BaseManager.currentScene) {
                BaseManager.currentScene.nextFrameExecute(() => {
                    this.widgetInit();
                });
            }
        });
    }
    getTarget(target) {
        let parent = this.parent;
        while (parent) {
            if (target) {
                if (parent._ll_className === target) {
                    return parent;
                }
            } else if (parent.isController) {
                return parent;
            }
            
            parent = parent.parent;
            if (typeof parent !== 'object') {
                break;
            }
        }
        return null;
    }
    getValue(key) {
        let target = this.bind.target;
        let parent = this.getTarget(target);
        if (parent) {
            if (parent.isController) {
                return parent.dispatcher[key];
            } else {
                return parent.model ? parent.model[key] : null;
            }
        }
        return null;
    }
    getByPath(path) {
        if (path.indexOf('.') < 0) {
            return this.getValue(path) || null;
        }
        let paths = path.split('.');
        let currentVal = this.getValue(paths[0]);
        if (!currentVal) {
            return null;
        }
        for (let i = 1; i < paths.length; i++) {
            let key = paths[i];
            currentVal = currentVal[key];
            if (currentVal === null) {
                break;
            }
        }
        return currentVal;
    }
}
export default BaseView;