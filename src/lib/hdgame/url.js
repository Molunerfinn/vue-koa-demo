export function jointUrlArg(root, arg) {
  if (arg) {
    return root + (root.indexOf("?") >= 0 ? "&": "?") + arg
  } else {
    return root
  }
}

export function jointParams(params) {
  var s = [];
  for( let [key,val] in Object.entries(params))
  {
    s.push(key + "=" + val)
  }
  return s.join("&")
}

export function removeUrlArg() {
  var argsArray = Array.from(arguments);
  if (argsArray.length < 2) {
    return
  }
  var urlInfo = parseURL(argsArray.shift());
  argsArray.forEach( function(item, index) {
    if (urlInfo.params.hasOwnProperty(item)) {
      delete urlInfo.params[item]
    }
  });
  urlInfo.obj.search = jointUrlArg("", jointParams(urlInfo.params));
  return urlInfo.obj.href
}

export function  parseURL(url) {
  var a = document.createElement("a");
  a.href = url;
  return {
    obj: a,
    source: url,
    protocol: a.protocol.replace(":", ""),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function() {
      var ret = {},
      seg = a.search.replace(/^\?/, "").split("&"),
      len = seg.length,
      i = 0,
      s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue
        }
        s = seg[i].split("=");
        ret[s[0]] = s[1]
      }
      return ret
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1],
    hash: a.hash.replace("#", ""),
    path: a.pathname.replace(/^([^\/])/, "/$1"),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['', ''])[1],
    segments: a.pathname.replace(/^\//, "").split("/")
  }
}
