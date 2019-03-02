
export const LString = {
    trim: function(s) {
        return s.replace(/(^\s*)|(\s*$)|(\n)/g, '');
    },
    leftTrim: function(s) {
        return s.replace(/(^\s*)|(^\n)/g, '');
    },
    rightTrim: function(s) {
        return s.replace(/(\s*$)|(\n$)/g, '');
    },
    numberFormat: function(s, l) {
        if (!l || l < 1) {
            l = 3;
        }
        s = String(s).split('.');
        s[0] = s[0].replace(new RegExp('(\\d)(?=(\\d{' + l + '})+$)', 'ig'), '$1,');
        return s.join('.');
    },
    isString: function(s) {
        let p = /^([a-z]|[A-Z])+$/;
        return p.exec(s); 
    },
    isNumber: function(s) {
        let p = /^\d+\.\d+$/;
        return p.exec(s); 
    },
    isInt: function(s) {
        let p = /^\d+$/;
        return p.exec(s); 
    }
};
export const LMath = LString;