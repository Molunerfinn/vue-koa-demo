import BaseBindView from './BaseBindView';
import PrefabContainer from '../prefabs/PrefabContainer';
import LBitmap from '../../lufylegend/display/LBitmap';
import LBitmapData from '../../lufylegend/display/LBitmapData';
import LLoader from '../../lufylegend/display/LLoader';
import LEvent from '../../lufylegend/events/LEvent';
class BindTextureView extends BaseBindView {
    constructor(data) {
        super(data);
        this._bitmap = null;
    }
    init() {
        super.init();
        if (this.bind.default) {
            this._loadTexture(this.bind.default);
        }
    }
    _loadTexture(path) {
        path = `resources/${path}`;
        let image = LLoader.get(path);
        if (image) {
            this._updateBitmapData(image);
            return;
        }
        let loader = new LLoader();
        loader.addEventListener(LEvent.COMPLETE, (event) => {
            this._updateBitmapData(event.target);
        });
        loader.load(path);
    }
    _updateBitmapData(image) {
        let bitmapData = new LBitmapData(image);
        if (this._bitmap !== null) {
            this._bitmap.bitmapData = bitmapData;
            return;
        }
        this._bitmap = new LBitmap(bitmapData);
        this.addChild(this._bitmap);
    }
    updateView() {
        super.updateView();
        if (!this.bind || !this.bind.key) {
            return;
        }
        let value = this.getByPath(this.bind.key);
        if (value === null) {
            return;
        }
        this._loadTexture(value);
    }
}
PrefabContainer.set('BindTextureView', BindTextureView);
export default BindTextureView;