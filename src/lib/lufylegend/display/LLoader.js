import LEventDispatcher from '../events/LEventDispatcher';
import LAjax from '../net/LAjax';
import LEvent from '../events/LEvent';
class LLoader extends LEventDispatcher {
    constructor() {
        super();
        this.type = 'LLoader';
    }
	
    load(u, t, xhr) {
        let s = this;
        if (!t) {
            t = LLoader.TYPE_BITMAPDATE;
        }
        s.loadtype = t;
        s.useXHR = xhr && !LAjax.local && LAjax.canUseBlob;
        if (t === LLoader.TYPE_BITMAPDATE) {
            let data = LLoader.get(u);
            if (data) {
                setTimeout(() => {
                    s.dispatchCompleteEvent(data);
                });
                return;
            }
            if (s.useXHR) {
                LAjax.responseType = LAjax.ARRAY_BUFFER;
                LAjax.progress = function(e) {
                    let event = new LEvent(LEvent.PROGRESS);
                    event.currentTarget = s;
                    event.target = e.currentTarget;
                    event.loaded = e.loaded;
                    event.total = e.total;
                    event.responseURL = e.responseURL;
                    s.dispatchEvent(event);
                };
                LAjax.post(u, {}, function(response) {
                    let blob;
                    try {
                        blob = new Blob([response], { type: 'image/png' });
                    } catch (e) {
                        if (e.name === 'TypeError' && window.BlobBuilder) {
                            let builder = new BlobBuilder();
                            builder.append(response);
                            blob = builder.getBlob();
                        } else {
                            blob = null;
                            s.useXHR = false;
                        }
                    }
                    if (s.useXHR) {
                        u = s.createObjectURL(blob);
                    }
                    s.loadStart(u);
                }, function(request) {
                    let event = new LEvent(LEvent.ERROR);
                    event.currentTarget = s;
                    event.target = request;
                    event.responseURL = request.responseURL;
                    s.dispatchEvent(event);
                });
            } else {
                s.loadStart(u);
            }
        }
    }
    dispatchCompleteEvent(target) {
        let event = new LEvent(LEvent.COMPLETE);
        event.currentTarget = this;
        event.target = target;
        if (this.useXHR) {
            this.revokeObjectURL(target.src);
        }
        this.dispatchEvent(event);
    }
    loadStart(u) {
        let s = this;
        s.content = new Image();
        s.content.onload = function() {
            s.content.onload = null;
            s.dispatchCompleteEvent(s.content);
            LLoader._container[u] = s.content;
            delete s.content;
        };
        if (!s.useXHR) {
            s.content.onerror = function(e) {
                let event = new LEvent(LEvent.ERROR);
                event.currentTarget = s;
                event.target = e.target;
                event.responseURL = e.target.src;
                s.dispatchEvent(event);
            };
        }
        s.content.src = u;
    }
    createObjectURL(obj) {
        let URL = window.URL || window.webkitURL;
        return URL.createObjectURL(obj);
    }
    revokeObjectURL(src) {
        let URL = window.URL || window.webkitURL;
        URL.revokeObjectURL(src);
    }
}
LLoader.TYPE_BITMAPDATE = 'bitmapData';
LLoader._container = {};
LLoader.get = function(name) {
    return LLoader._container[name];
};
export default LLoader;