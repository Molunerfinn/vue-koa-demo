import LEventDispatcher from '../events/LEventDispatcher';
import LEvent from '../events/LEvent';
class LFontLoader extends LEventDispatcher {
    constructor() {
        super();
        this.type = 'LFontLoader';
    }
    load(u, name) {
        let s = this, font, tff, eot, a, b, d, t = '';
        font = document.createElement('style');
        font.onerror = function(e) {
            let event = new LEvent(LEvent.ERROR);
            event.currentTarget = s;
            event.target = e.target;
            event.responseURL = u;
            s.dispatchEvent(event);
        };
        a = u.split(',');
        for (let i = 0; i < a.length; i++) {
            b = a[i].split('.');
            d = b[b.length - 1];
            if (d === 'ttf') {
                tff = a[i];
            } else if (d === 'eot') {
                eot = a[i];
            }
        }
        t = '@font-face { font-family:\'' + name + '\';';
        if (eot) {
            t += 'src: url(' + eot + ');'; 
        }
        if (tff) {
            t += 'src: local(\'lufy\'),url(' + tff + ') format(\'opentype\');'; 
        }
        font.innerHTML = t;
        document.querySelector('head').appendChild(font);
        setTimeout(function() {
            let event = new LEvent(LEvent.COMPLETE);
            event.currentTarget = s;
            event.target = s;
            s.dispatchEvent(event);
        }, 1);
    }
}
LFontLoader.TYPE_FONT = 'font';
export default LFontLoader;