
class LEvent {
    constructor(type) {
        this.eventType = type;
        this._ll_preventDefault = false;
    }
    preventDefault() {
        this._ll_preventDefault = true;
    }
}
LEvent.INIT = 'init';
LEvent.COMPLETE = 'complete';
LEvent.ERROR = 'error';
LEvent.PROGRESS = 'progress';
LEvent.ENTER_FRAME = 'enter_frame';
LEvent.WINDOW_RESIZE = 'resize';
LEvent.WINDOW_ORIENTATIONCHANGE = 'orientationchange';
LEvent.SOUND_COMPLETE = 'sound_complete';
LEvent.END_CONTACT = 'endContact';
LEvent.PRE_SOLVE = 'preSolve';
LEvent.POST_SOLVE = 'postSolve';
LEvent.BEGIN_CONTACT = 'beginContact';
LEvent.addEventListener = function(n, t, f, b) {
    b = b || false;
    if (n.addEventListener) {
        n.addEventListener(t, f, b);
    } else if (n.attachEvent) {
        n['e' + t + f] = f;
        n[t + f] = function() {
            n['e' + t + f]();
        };
        n.attachEvent('on' + t, n[t + f]);
    }
};
LEvent.removeEventListener = function(n, t, f, b) {
    b = b || false;
    if (n.removeEventListener) {
        n.removeEventListener(t, f, b);
    } else if (n.detachEvent) {
        n['e' + t + f] = f;
        n[t + f] = function() {
            n['e' + t + f]();
        };
        n.detachEvent('on' + t, n[t + f]);
    }
};
export default LEvent;