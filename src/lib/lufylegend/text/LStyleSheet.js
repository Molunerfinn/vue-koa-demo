import LObject from '../utils/LObject';
class LStyleSheet extends LObject {
    constructor() {
        super();
        this.styleIndex = 0;
        this.styleNames = {};
    }
    clone() {
        let s = this, a = new s.constructor();
        a.copyProperty(s);
        return a;
    }
    setStyle(styleName, styleObject) {
        this.styleIndex++;
        if (!styleObject) {
            if (this.styleNames[styleName]) {
                delete this.styleNames[styleName];
            }
            return;
        }
        let arr = styleObject.replace(/(^\{)|(\}$)/g, '').split(';'), i, styleObjects;
        styleObject = {};
        for (i = 0; i < arr.length; i++) {
            if (!arr[i]) {
                continue;
            }
            styleObjects = arr[i].split(':');
            if (!styleObjects[0]) {
                continue;
            }
            styleObject[styleObjects[0]] = styleObjects[1];
        }
        this.styleNames[styleName] = styleObject;
    }
    getStyle(styleName) {
        return this.styleNames[styleName];
    }
}
export default LStyleSheet;
