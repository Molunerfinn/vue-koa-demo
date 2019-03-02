import BaseView from './BaseView';
import PrefabContainer from '../prefabs/PrefabContainer';
class BaseBindView extends BaseView {
    lateInit() {
        super.lateInit();
        this.updateView();
    }
    updateView(model) {
        this.model = model;
    }
}
PrefabContainer.set('BaseBindView', BaseBindView);
export default BaseBindView;