import { addChild } from '../../lufylegend/utils/Function';
import LNode from '../prefabs/LNode';
import LLoadManage from '../../lufylegend/system/LLoadManage';
import LURLLoader from '../../lufylegend/net/LURLLoader';
import LAtlas from '../../lufylegend/system/LAtlas';
import LTweenLite from '../../lufylegend/transitions/LTweenLite';
import LGlobal from '../../lufylegend/utils/LGlobal';
import PanelAnimation from '../views/Animation/PanelAnimation';
class BaseManager {
    constructor() {
        this._currentScene = null;
        this._currentPanel = null;
        this._panelList = [];
        this._dialogList = [];
    }
    showDialog(prefabName, request) {
        console.log('showDialog', prefabName, request);
        return this.loadPrefab(prefabName)
            .then((prefab) => {
                let node = LNode.create(prefab);
                this._currentPanel.addChild(node);
            });
    }
    loadPanel(prefabName, request, controllerAnimation) {
        controllerAnimation = controllerAnimation || 'fade';
        return this.loadPrefab(prefabName)
            .then((prefab) => {
                prefab.request = request;
                let node = LNode.create(prefab);
                let oldPanel = this._currentPanel || null;
                if (!oldPanel) {
                    controllerAnimation = 'fade';
                }
                this._currentPanel = node;
                let layer = this._currentScene.childList.find((child) => {
                    return child.name === 'panel';
                });
                if (layer) {
                    layer.addChild(node);
                } else {
                    this._currentScene.addChildAt(node, 0);
                }
                if (node instanceof LNode) {
                    node.lateInit();
                }
                if (node.onLoadEnd) {
                    node.onLoadEnd(request);
                }
                PanelAnimation.changePanel(oldPanel, this._currentPanel, controllerAnimation);
            });
    }
    get currentScene() {
        return this._currentScene;
    }
    loadScene(prefabName, request) {
        return this.loadPrefab(prefabName)
            .then((prefab) => {
                prefab.request = request;
                let node = LNode.create(prefab);
                let oldScene = this._currentScene || null;
                this._currentScene = node;
                addChild(node);
                if (node instanceof LNode) {
                    node.lateInit();
                }
                if (node.onLoadEnd) {
                    node.onLoadEnd(request);
                }
                if (oldScene) {
                    node.alpha = 0;
                    LTweenLite.to(oldScene, 0.3, { alpha: 0, onComplete: (event) => {
                        event.target.remove();
                    } });
                    LTweenLite.to(node, 0.3, { alpha: 1 });
                }
            });
    }
    loadPrefab(prefabPath, folder) {
        let prefab;
        prefabPath = `resources/${prefabPath}.prefab`;
        let metaPath = `${prefabPath}.meta`;
        if (LGlobal.traceDebug) {
            prefabPath += '?t=' + Date.now();
            metaPath += '?t=' + Date.now();
        }
        return new Promise(function(resolve, reject) {
            LLoadManage.load([
                { name: 'prefab', path: prefabPath, type: LURLLoader.TYPE_TEXT },
                { name: 'meta', path: metaPath, type: LURLLoader.TYPE_TEXT }
            ], null, (res) => {
                resolve(res);
            });
        })
            .then((res) => {
                prefab = JSON.parse(res['prefab']);
                let meta = JSON.parse(res['meta']);
                return this.loadResources(meta);
            })
            .then(() => {
                return Promise.resolve(prefab);
            });
    }
    loadResources(meta) {
        let dataList = [];
        if (meta.atlas) {
            for (let atlas of meta.atlas) {
                dataList.push({ name: atlas.name, path: `resources/${atlas.path}`, type: LAtlas.TYPE_PLIST });
            }
        }
        return new Promise(function(resolve, reject) {
            LLoadManage.load(dataList, null, (res) => {
                resolve(res);
            });
        });
    }
}
export default new BaseManager();