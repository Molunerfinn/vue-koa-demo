class LVec2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    length() {
        let s = this;
        return Math.sqrt(s.x * s.x + s.y * s.y);
    }
    normalize() {
        let s = this, l = s.length();
        return new LVec2(s.x / l, s.y / l);
    }
    /*[x*cosA-y*sinA  x*sinA+y*cosA]*/
    normR() {
        return new LVec2(-this.y, this.x);
    }
    normL() {
        return new LVec2(this.y, -this.x);
    }
}
/*|a||b|Cosθ*/
LVec2.dot = function(a, b) {
    return a.x * b.x + a.y * b.y;
};
/*|a||b|Sinθ*/
LVec2.cross = function(a, b) {
    return a.x * b.y - a.y * b.x;
};
LVec2.distance = function(a, b) {
    let x = a.x - b.x;
    let y = a.y - b.y;
    return Math.sqrt(x * x + y * y);
};
LVec2.getMinMax = function(vecs, axis) {
    let min_o = LVec2.dot(vecs[0], axis);
    let max_o = LVec2.dot(vecs[0], axis);
    let min_i = 0;
    let max_i = 0;
    for (let i = 1; i < vecs.length; i++) {
        let this_o = LVec2.dot(vecs[i], axis);
        if (min_o > this_o) {
            min_o = this_o;
            min_i = i;
        }
        if (max_o < this_o) {
            max_o = this_o;
            max_i = i;
        }
    }
    let r = { 'min_o': min_o, 'min_i': min_i, 'max_o': max_o, 'max_i': max_i };
    return r;
};
export default LVec2;