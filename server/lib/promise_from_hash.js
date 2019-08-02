'use strict';

var Promise = Promise || require('es6-promise').Promise;

var isArray = function(arr) {
    return Array.isArray(arr);
};

var isObject = function(obj) {
    return typeof obj === 'object' && obj !== null;
};

var isSimple = function(obj) {
    return !isArray(obj) && !isObject(obj);
};

var isPromise = function(obj) {
    return obj && typeof obj.then === 'function';
};

var clone = function(obj) {
    var newObj = isArray(obj) ? [] : {};
    for (var i in obj) {
        if (isSimple(obj[i])) {
            newObj[i] =  obj[i];
        } else {
            newObj[i] = isPromise(obj[i]) ? obj[i] : clone(obj[i]);
        }
    }
    return newObj;
};

var attachPromise = function(node, key, promise) {
    return new Promise(function(resolve) {
        promise.then(function(result) {
            node[key] = result;
            if (isSimple(result)) {
                resolve(result);
            } else {
                return fromHash(result).then(resolve);
            }
        });
    });
};

var fromHash = function(hash) { 
    var promises = Object.keys(hash).map(function(key) {
        if (isPromise(hash[key])) return attachPromise(hash, key, hash[key]);
        if (!isSimple(hash[key])) return fromHash(hash[key]);
        return hash[key];
    });

    return new Promise(function(resolve) { 
        Promise.all(promises).then(function() {
            resolve(hash);
        });
    });
};

module.exports = function(hash) {
    if (isSimple(hash)) throw new Error(hash + ' is not an object');

    return fromHash( clone(hash) );
};
