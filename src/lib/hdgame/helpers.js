
import HdUtil from '../hdutil'

function initializeCallback(target, arg) {
  var callBackObj = new HdUtil.CallBack();
  target = target || {};
  console.log( "callBackObj=", callBackObj)
  callBackObj.getApiKeys().forEach(
  function(key, i) {
    target[key] = function() {
      var rt = callBackObj[key].apply(callBackObj, arguments);
      return rt === callBackObj ? this: rt
    }
  });
  if (getType(arg) == "array") {
    callBackObj.register(arg)
  }
  return target
}

function getType(obj) {
  return Object.prototype.toString.call(obj).match(/\[object\s(\w+)]/)[1].toLowerCase()
}


export {
  getType,
  initializeCallback
}
