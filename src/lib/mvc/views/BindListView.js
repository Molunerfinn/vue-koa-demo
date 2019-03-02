import BaseBindView from './BaseBindView';
import BaseManager from '../managers/BaseManager';
import { LListView, LListChildView } from '../../lufylegend/lib/ui/LListView';
import LNode from '../prefabs/LNode';
import PrefabContainer from '../prefabs/PrefabContainer';
class BindListView extends BaseBindView {
    init() {
        super.init();
        this._listView = new LListView();
        this.addChild(this._listView);
    }
    updateView() {
        super.updateView();
        let value = this.getByPath(this.bind.key);
        if (value === null) {
            return;
        }
        let listView = this._listView;
        for (let key in this.listView) {
            let value = this.listView[key];
            switch (key) {
            case 'size':
                listView.resize(value.width, value.height);
                break;
            case 'maxPerLine':
            case 'cellWidth':
            case 'cellHeight':
                listView[key] = value;
                break;
            default:
                break;
            }
        }
        listView.scrollBarHorizontal.showCondition === LListView.ScrollBarCondition.Always;
        listView.scrollBarVertical.showCondition === LListView.ScrollBarCondition.Always;
        
        listView.arrangement = LListView.Direction.Horizontal;
        listView.movement = LListView.Direction.Vertical;
        let childPrefab = this.bind.childPrefab;
        return BaseManager.loadPrefab(childPrefab)
            .then((data) => {
                for (let child of value) {
                    this.createListObject(data, child);
                }
            });
    }
    createListObject(data, model) {
        let listChild = new LListChildView();
        this.model = model;
        let node = LNode.create(data);
        listChild.addChild(node);
        node.updateWidget(model);
        this._listView.insertChildView(listChild);
    }
}
PrefabContainer.set('BindListView', BindListView);
export default BindListView;