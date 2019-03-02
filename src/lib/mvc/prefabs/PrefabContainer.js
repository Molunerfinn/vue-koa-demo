class PrefabContainer {
    constructor() {
        this._nodeMap = {};
    }
    set(className, classInstance) {
        this._nodeMap[className] = classInstance;
        classInstance.prototype._ll_className = className;
    }
    get(className) {
        return this._nodeMap[className];
    }
}
export default new PrefabContainer();