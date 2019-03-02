
class LPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
	
    toString() {
        return '[object LPoint(' + this.x + ',' + this.y + ')]';
    }
    length() {
        return LPoint.distance2(this.x, this.y, 0, 0);
    }
    add(v) {
        return new LPoint(this.x + v.x, this.y + v.y);
    }
    clone() {
        return new LPoint(this.x, this.y);
    }
    setTo(x, y) {
        this.x = x, this.y = y;
    }
    copyFrom(s) {
        this.setTo(s.x, s.y);
    }
    equals(t) {
        return this.x === t.x && this.y === t.y;
    }
    normalize(t) {
        let s = this, scale = t / s.length();
        s.x *= scale, s.y *= scale;
    }
    offset(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    subtract(v) {
        return new LPoint(this.x - v.x, this.y - v.y);
    }
}

LPoint.distance = function(p1, p2) {
    return LPoint.distance2(p1.x, p1.y, p2.x, p2.y);
};
LPoint.distance2 = function(x1, y1, x2, y2) {
    let x = x1 - x2, y = y1 - y2;
    return Math.sqrt(x * x + y * y);
};
LPoint.interpolate = function(p1, p2, f) {
    return new LPoint(p1.x + (p2.x - p1.x) * (1 - f), p1.y + (p2.y - p1.y) * (1 - f));
};
LPoint.polar = function(l, a) {
    return new LPoint(l * Math.cos(a), l * Math.sin(a));
};
export default LPoint;
