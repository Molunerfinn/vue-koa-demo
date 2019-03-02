import LNode from '../prefabs/LNode';
import BaseManager from '../managers/BaseManager';
class BaseController extends LNode {
    constructor(data) {
        super(data);
    }
    get isController() {
        return true;
    }
    init(data) {
        super.init(data);
        this.dispatcher = this.dispatcher || {};
        this.onLoad(data.request);
        setTimeout(() => {
            if (this.widget && BaseManager.currentScene) {
                BaseManager.currentScene.nextFrameExecute(() => {
                    this.widgetInit();
                });
            }
        });
    }
    onLoad(request) {
    }
    onLoadEnd() {
    }

}
export default BaseController;