import LEventDispatcher from '../events/LEventDispatcher';
import LEvent from '../events/LEvent';
import { getExtension } from '../utils/Function';
import LAjax from './LAjax';
class LURLLoader extends LEventDispatcher {
    constructor() {
        super();
        this.type = 'LURLLoader';
        this.loadtype = '';
        this.content = null;
        this.event = {};
    }
    load(u, t) {
        let s = this, event, ext;
        if (!t) {
            ext = getExtension(u);
            if (ext === 'txt') {
                t = LURLLoader.TYPE_TEXT;
            } else if (ext === 'js') {
                t = LURLLoader.TYPE_JS;
            }
        }
        s.loadtype = t;
        if (t === LURLLoader.TYPE_TEXT) {
            LAjax.progress = function(e) {
                let event = new LEvent(LEvent.PROGRESS);
                event.currentTarget = s;
                event.target = e.currentTarget;
                event.loaded = e.loaded;
                event.total = e.total;
                event.responseURL = e.responseURL;
                s.dispatchEvent(event);
            };
            LAjax.get(u, {}, function(data) {
                event = new LEvent(LEvent.COMPLETE);
                s.data = data;
                event.currentTarget = s;
                event.target = data;
                s.dispatchEvent(event);
                delete s.content;
                delete s.data;
            }, function(request) {
                let event = new LEvent(LEvent.ERROR);
                event.currentTarget = s;
                event.target = request;
                event.responseURL = request.responseURL;
                s.dispatchEvent(event);
            });
        } else if (t === LURLLoader.TYPE_JS) {
            let script = document.createElement('script');
            script.onerror = function(e) {
                let event = new LEvent(LEvent.ERROR);
                event.currentTarget = s;
                event.target = e.target;
                event.responseURL = u;
                s.dispatchEvent(event);
            };
            script.onload = function() {
                event = new LEvent(LEvent.COMPLETE);
                event.currentTarget = s;
                event.target = s;
                s.dispatchEvent(event);
                delete s.content;
            };
            script.src = u;
            script.type = 'text/javascript';
            document.querySelector('head').appendChild(script);
        }
    }
}
LURLLoader.TYPE_TEXT = 'text';
LURLLoader.TYPE_JS = 'js';
export default LURLLoader;
