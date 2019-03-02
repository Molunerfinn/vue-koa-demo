class LObject {
    constructor() {
        this.type = 'LObject';
        this.objectIndex = ++LObject.objectIndex;
        this.objectindex = this.objectIndex;
    }
    copyProperty(target) {
        for (let k in target) {
            if (typeof target[k] === 'number' || typeof target[k] === 'string' || typeof target[k] === 'boolean') {
                if (k === 'objectindex' || k === 'objectIndex') {
                    continue;
                }
                this[k] = target[k];
            } else if (Array.isArray(target[k])) {
                this[k] = target[k].slice();
            } 
        }
        if (target.mask) {
            this.mask = target.mask.clone();
        }
    }
    toString() {
        return '[object ' + this.constructor.name + ']';
    }
}
LObject.objectIndex = 1;
export default LObject;