var UA = {
  val: window.navigator.userAgent,
  isPC: function() {
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (UA.val.indexOf(Agents[v]) > 0) {
        flag = false;
        break
      }
    }
    return flag
  },
  isIOS: function() {
    return /iPhone/i.test(UA.val) || /iPad/i.test(UA.val)
  },
  isIPhone: function() {
    return /iPhone/i.test(UA.val)
  },
  isIPhone6(){
     return this.isIPhone()&&(window.screen.availWidth === 375 || window.screen.availWidth === 414)
  },
  isIPhone4(){
     return this.isIPhone()&&(window.screen.availHeight === 460)
  },
  isAndroid: function() {
    return /Android/i.test(UA.val) || /Linux/i.test(UA.val)
  },
  isWX: function() {
    return /MicroMessenger/i.test(UA.val)
  },
  getWxVer: function() {
    var wechatInfo = UA.val.match(/MicroMessenger\/([\d\.]+)/i);
    if (wechatInfo && wechatInfo[1]) {
      return wechatInfo[1]
    }
    return ""
  },
};

// for( let [key,fn] of Object.entries( UA )){
//   if (typeof fn != "function") {
//     return
//   }
//   var cache;
//   UA[key] = function() {
//     cache = fn.call(UA);
//     UA[key] = function() {
//       return cache
//     };
//     return cache
//   }
// }

UA.getWxVerNum = function(ver) {
  if (!ver) {
    ver = UA.getWxVer()
  }
  if (!ver) {
    return 0
  }
  var num = 0;
  ver.split(".").forEach((val, index)=> {
    num += Math.pow(1000, 2 - index) * parseInt(val)
  })
  return num
};

export default UA
