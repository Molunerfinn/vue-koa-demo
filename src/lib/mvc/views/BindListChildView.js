import BaseBindView from './BaseBindView';
import PrefabContainer from '../prefabs/PrefabContainer';
class BindListChildView extends BaseBindView {
    updateWidget(model) {
        this.model = model;
        for (let child of this.childList) {
            child.updateView();
        }
    }
}
PrefabContainer.set('BindListChildView', BindListChildView);
export default BindListChildView;