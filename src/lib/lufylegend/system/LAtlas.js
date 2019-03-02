import LEventDispatcher from '../../lufylegend/events/LEventDispatcher';
import LLoadManage from '../../lufylegend/system/LLoadManage';
import LEvent from '../../lufylegend/events/LEvent';
import LAtlasSprite from '../../lufylegend/display/LAtlasSprite';
import LGlobal from '../../lufylegend/utils/LGlobal';
class LAtlas extends LEventDispatcher {
    destroy() {
        delete LAtlas._container[name];
    }
    load(path, name) {
        let loadData = [
            { name: `${path}/${name}.png`, path: this.url(`${path}/${name}.png`) },
            { name: `${path}/${name}.plist`, path: this.url(`${path}/${name}.plist`), type: 'text' },
            { name: `${path}/${name}.json`, path: this.url(`${path}/${name}.json`), type: 'text' }
        ];
        LLoadManage.load( 
            loadData, null, (datalist) => {
                this._loadComplete(datalist, path, name);
            }
        );
    }
    url(u) {
        if (!LGlobal.traceDebug) {
            return u;
        }
        return u + (u.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
    }
    _loadComplete(datalist, path, name) {
        let resourcesPath = 'resources/';
        let resourcesIndex = path.indexOf(resourcesPath);
        this._atlasKey = path.substring(resourcesIndex + resourcesPath.length) + '/' + name;
        LAtlas._container[this._atlasKey] = this;
        let texture = datalist[`${path}/${name}.png`];
        let xml = datalist[`${path}/${name}.plist`];
        let json = JSON.parse(datalist[`${path}/${name}.json`]);
        this.set(xml, texture, json);
        let event = new LEvent(LEvent.COMPLETE);
        event.currentTarget = this;
        event.target = this;
        this.dispatchEvent(event);
    }
    set(xml, texture, json) {
        this._texture = texture;
        this._setting = json;
        this._initData(xml);
    }
    _initData(xml) {
        let parser = new DOMParser();
        this.xmlDom = parser.parseFromString(xml, 'text/xml');
        let plistDom = this.xmlDom.querySelector('plist').querySelector('dict');
        let children = plistDom.children;
        let frames;
        for (let i = 0;i < children.length; i++) {
            let child = children[i];
            if (child.tagName === 'key' && child.textContent === 'frames') {
                frames = children[i + 1].children;
                break;
            }
        }
        this._textureData = {};
        for (let i = 0;i < frames.length; i += 2) {
            let key = frames[i].textContent.replace('.png', '');
            let value = frames[i + 1];
            let data = this._getTextureData(value.children);
            this._textureData[key] = data;
        }
    }
    getSprite(name, type, width, height) {
        let data = this._textureData[name];
        let atlasSprite = new LAtlasSprite(this._texture, this._setting[name], data, type);
        if (width && height) {
            atlasSprite.resize(width, height);
        }
        return atlasSprite;
    }
    _getTextureData(children) {
        let data = {};
        for (let i = 0;i < children.length; i += 2) {
            let key = children[i].textContent;
            let tict = children[i + 1];
            let value = JSON.parse(tict.tagName === 'string' ? tict.textContent.replace(/\{/g, '[').replace(/\}/g, ']') : tict.tagName);
            data[key] = value;
        }
        return data;
    }
}
LAtlas.TYPE_PLIST = 'type_plist';
LAtlas._container = {};
LAtlas.get = function(name) {
    return LAtlas._container[name] || new LAtlas();
};
export default LAtlas;